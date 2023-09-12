"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRegister = exports.updateRegister = exports.insertRegister = exports.getOneRegister = exports.getAllRegister = void 0;
const database_1 = require("../database");
// METODOS DEL CONTROLADOR
const getAllRegister = async (req, res) => {
    try {
        // Establece la conexión a la base de datos utilizando la función de conexión
        const connection = await (0, database_1.conexionBD)();
        // Ejecuta una consulta para obtener todos los datos
        const [rows] = await connection.execute('SELECT * FROM tipo_programa');
        // Convierte los resultados a objetos Model
        const tipo_programas = [];
        for (const row of rows) {
            tipo_programas.push({
                tipo_programa_id: row.tipo_programa_id,
                descripcion: row.descripcion,
            });
        }
        // Envía la respuesta con los datos  
        res.status(200).json(tipo_programas);
    }
    catch (error) {
        console.error('Error al obtener los tipos de programas:', error);
        res.status(500).json({ message: 'Error al obtener los tipos de programas', error: error });
    }
};
exports.getAllRegister = getAllRegister;
const getOneRegister = async (req, res) => {
    const ID = req.params.id; // Obtiene el ID del parámetro de la solicitud
    try {
        // Establece la conexión a la base de datos utilizando la función de conexión
        const connection = await (0, database_1.conexionBD)();
        // Ejecuta una consulta para obtener un rol por ID
        const [rows] = await connection.execute('SELECT * FROM tipo_programa WHERE tipo_programa_id = ?', [ID]);
        // Verifica si se encontró un rol con el ID proporcionado
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Tipo de Programa no encontrado' });
        }
        // Convierte el resultado a un objeto Model
        const tipo_programa = {
            tipo_programa_id: rows[0].tipo_programa_id,
            descripcion: rows[0].descripcion,
        };
        // Envía la respuesta
        res.status(200).json(tipo_programa);
    }
    catch (error) {
        console.error('Error al obtener el Tipo de Programa:', error);
        res.status(500).json({ message: 'Error al obtener el Tipo de Programa', error: error });
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
        // Verifica si ya existe un tipo de programa con la misma descripción
        const connection = await (0, database_1.conexionBD)();
        const [descripcionRows] = await connection.execute('SELECT descripcion FROM tipo_programa WHERE descripcion = ?', [descripcion]);
        if (descripcionRows.length > 0) {
            return res.status(400).json({ message: 'La descripción ya está en uso' });
        }
        // Ejecuta una consulta para insertar
        await connection.execute('INSERT INTO tipo_programa (descripcion) VALUES (?)', [descripcion]);
        res.status(201).json({ message: 'Tipo de Programa registrado con éxito' });
    }
    catch (error) {
        console.error('Error al registrar Tipo de Programa:', error);
        res.status(500).json({ message: 'Error al registrar Tipo de Programa', error: error });
    }
};
exports.insertRegister = insertRegister;
const updateRegister = async (req, res) => {
    try {
        const { descripcion } = req.body;
        const tipo_programa_id = req.params.id; // Recupera el tipo_programa_id de los parámetros de la ruta
        // Verifica que el ID  y al menos un campo obligatorio estén presentes
        if (!tipo_programa_id) {
            return res.status(400).json({ message: 'Falta el ID del Tipo de Programa' });
        }
        const connection = await (0, database_1.conexionBD)();
        // Verifica si el rol con el ID proporcionado existe en la base de datos
        const [tipoprogramaRows] = await connection.execute('SELECT * FROM tipo_programa WHERE tipo_programa_id = ?', [tipo_programa_id]);
        if (tipoprogramaRows.length === 0) {
            return res.status(404).json({ message: 'Tipo de Programa no encontrado' });
        }
        // Verifica si la descripción en la solicitud es igual a la descripción actual en la base de datos
        if (descripcion !== tipoprogramaRows[0].descripcion) {
            // Si no son iguales, verifica si la nueva descripción ya existe en la base de datos
            const [existingDescripcionRows] = await connection.execute('SELECT descripcion FROM tipo_programa WHERE descripcion = ? AND tipo_programa_id <> ?', [descripcion, tipo_programa_id]);
            if (existingDescripcionRows.length > 0) {
                return res.status(400).json({ message: 'La descripción ya está en uso' });
            }
        }
        // Ejecuta la consulta para actualizar
        await connection.execute('UPDATE tipo_programa SET descripcion = ? WHERE tipo_programa_id = ?', [descripcion, tipo_programa_id]);
        // Obtén el registro actualizado desde la base de datos
        const [updatedTipoProgramaRows] = await connection.execute('SELECT * FROM tipo_programa WHERE tipo_programa_id = ?', [tipo_programa_id]);
        // Crea un objeto Model con los datos actualizados
        const tipoprogramaActualizado = {
            tipo_programa_id: updatedTipoProgramaRows[0].rol_id,
            descripcion: updatedTipoProgramaRows[0].descripcion,
        };
        res.status(200).json({ message: 'Tipo de Programa actualizado con éxito', tipo_programa: tipoprogramaActualizado });
    }
    catch (error) {
        console.error('Error al actualizar Tipo de Programa:', error);
        res.status(500).json({ message: 'Error al actualizar Tipo de Programa', error: error });
    }
};
exports.updateRegister = updateRegister;
const deleteRegister = async (req, res) => {
    try {
        const tipo_programa_id = req.params.id; // Recupera el tipo_programa_id de los parámetros de la URL
        if (!tipo_programa_id) {
            return res.status(400).json({ message: 'Falta el ID del Tipo de Programa' });
        }
        const connection = await (0, database_1.conexionBD)();
        // Ejecuta la consulta para eliminar
        const [deleteResult] = await connection.execute('DELETE FROM tipo_programa WHERE tipo_programa_id = ?', [tipo_programa_id]);
        // Verifica si se eliminó correctamente
        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Tipo programa no encontrado' });
        }
        // Crea un objeto Model con los datos del rol eliminado
        const tipoProgramaEliminado = {
            tipo_programa_id: deleteResult.insertId,
            descripcion: '', // Puedes dejar la descripción en blanco o definir un valor apropiado
        };
        res.status(200).json({ message: 'Tipo de Programa eliminado con éxito', tipo_programa: tipoProgramaEliminado });
    }
    catch (error) {
        // Verifica si el error se debe a una restricción de llave foránea
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'No se puede eliminar el Tipo de Programa debido a que esta relacionado a otros registros' });
        }
        console.error('Error al eliminar Tipo de Programa:', error);
        res.status(500).json({ message: 'Error al eliminar Tipo de Programa', error: error });
    }
};
exports.deleteRegister = deleteRegister;
