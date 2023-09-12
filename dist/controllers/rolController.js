"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRegister = exports.updateRegister = exports.insertRegister = exports.getOneRegister = exports.getAllRegister = void 0;
const database_1 = require("../database");
// METODOS DEL CONTROLADOR
const getAllRegister = async (req, res) => {
    try {
        // Establece la conexión a la base de datos utilizando la función de conexión
        const connection = await (0, database_1.conexionBD)();
        // Ejecuta una consulta para obtener todos los roles
        const [rows] = await connection.execute('SELECT * FROM rol');
        // Convierte los resultados a objetos RolModel
        const roles = [];
        for (const row of rows) {
            roles.push({
                rol_id: row.rol_id,
                descripcion: row.descripcion,
            });
        }
        // Envía la respuesta con los datos de los roles  
        res.status(200).json(roles);
    }
    catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).json({ message: 'Error al obtener roles', error: error });
    }
};
exports.getAllRegister = getAllRegister;
const getOneRegister = async (req, res) => {
    const ID = req.params.id; // Obtiene el ID del parámetro de la solicitud
    try {
        // Establece la conexión a la base de datos utilizando la función de conexión
        const connection = await (0, database_1.conexionBD)();
        // Ejecuta una consulta para obtener un rol por ID
        const [rows] = await connection.execute('SELECT * FROM rol WHERE rol_id = ?', [ID]);
        // Verifica si se encontró un rol con el ID proporcionado
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        // Convierte el resultado a un objeto RolModel
        const rol = {
            rol_id: rows[0].rol_id,
            descripcion: rows[0].descripcion,
        };
        // Envía la respuesta con el rol encontrado
        res.status(200).json(rol);
    }
    catch (error) {
        console.error('Error al obtener un rol:', error);
        res.status(500).json({ message: 'Error al obtener un rol', error: error });
    }
};
exports.getOneRegister = getOneRegister;
const insertRegister = async (req, res) => {
    try {
        const { descripcion } = req.body;
        const missingFields = [];
        // Verifica que todos los campos necesarios estén definidos en el cuerpo de la solicitud
        if (!descripcion)
            missingFields.push('descripcion');
        if (missingFields.length > 0) {
            return res.status(400).json({ message: 'Faltan campos obligatorios', missingFields });
        }
        // Verifica si ya existe un rol con la misma descripción
        const connection = await (0, database_1.conexionBD)();
        const [descripcionRows] = await connection.execute('SELECT descripcion FROM rol WHERE descripcion = ?', [descripcion]);
        if (descripcionRows.length > 0) {
            return res.status(400).json({ message: 'La descripción ya está en uso' });
        }
        // Ejecuta una consulta para insertar un nuevo rol
        await connection.execute('INSERT INTO rol (descripcion) VALUES (?)', [descripcion]);
        res.status(201).json({ message: 'Rol registrado con éxito' });
    }
    catch (error) {
        console.error('Error al registrar rol:', error);
        res.status(500).json({ message: 'Error al registrar rol', error: error });
    }
};
exports.insertRegister = insertRegister;
const updateRegister = async (req, res) => {
    try {
        const { descripcion } = req.body;
        const rol_id = req.params.id; // Recupera el rol_id de los parámetros de la ruta
        // Verifica que el ID del rol y al menos un campo obligatorio estén presentes
        if (!rol_id) {
            return res.status(400).json({ message: 'Falta el ID del rol' });
        }
        const connection = await (0, database_1.conexionBD)();
        // Verifica si el rol con el ID proporcionado existe en la base de datos
        const [rolRows] = await connection.execute('SELECT * FROM rol WHERE rol_id = ?', [rol_id]);
        if (rolRows.length === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        // Verifica si la descripción en la solicitud es igual a la descripción actual en la base de datos
        if (descripcion !== rolRows[0].descripcion) {
            // Si no son iguales, verifica si la nueva descripción ya existe en la base de datos
            const [existingDescripcionRows] = await connection.execute('SELECT descripcion FROM rol WHERE descripcion = ? AND rol_id <> ?', [descripcion, rol_id]);
            if (existingDescripcionRows.length > 0) {
                return res.status(400).json({ message: 'La descripción ya está en uso' });
            }
        }
        // Ejecuta la consulta para actualizar el rol
        await connection.execute('UPDATE rol SET descripcion = ? WHERE rol_id = ?', [descripcion, rol_id]);
        // Obtén el rol actualizado desde la base de datos
        const [updatedRolRows] = await connection.execute('SELECT * FROM rol WHERE rol_id = ?', [rol_id]);
        // Crea un objeto RolModel con los datos actualizados
        const rolActualizado = {
            rol_id: updatedRolRows[0].rol_id,
            descripcion: updatedRolRows[0].descripcion,
        };
        res.status(200).json({ message: 'Rol actualizado con éxito', rol: rolActualizado });
    }
    catch (error) {
        console.error('Error al actualizar rol:', error);
        res.status(500).json({ message: 'Error al actualizar rol', error: error });
    }
};
exports.updateRegister = updateRegister;
const deleteRegister = async (req, res) => {
    try {
        const rol_id = req.params.id; // Recupera el rol_id de los parámetros de la URL
        if (!rol_id) {
            return res.status(400).json({ message: 'Falta el ID del rol' });
        }
        const connection = await (0, database_1.conexionBD)();
        // Ejecuta la consulta para eliminar el rol
        const [deleteResult] = await connection.execute('DELETE FROM rol WHERE rol_id = ?', [rol_id]);
        // Verifica si se eliminó correctamente
        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        // Crea un objeto RolModel con los datos del rol eliminado
        const rolEliminado = {
            rol_id: deleteResult.insertId,
            descripcion: '', // Puedes dejar la descripción en blanco o definir un valor apropiado
        };
        res.status(200).json({ message: 'Rol eliminado con éxito', rol: rolEliminado });
    }
    catch (error) {
        // Verifica si el error se debe a una restricción de llave foránea
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'No se puede eliminar el rol debido a que esta relacionado a otros registros' });
        }
        console.error('Error al eliminar rol:', error);
        res.status(500).json({ message: 'Error al eliminar rol', error: error });
    }
};
exports.deleteRegister = deleteRegister;
