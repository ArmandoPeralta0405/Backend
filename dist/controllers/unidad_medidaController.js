"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRegister = exports.updateRegister = exports.insertRegister = exports.getOneRegister = exports.getAllRegister = void 0;
const database_1 = require("../database");
// METODOS DEL CONTROLADOR
const getAllRegister = async (req, res) => {
    try {
        // Establece la conexión a la base de datos utilizando la función de conexión
        const connection = await (0, database_1.conexionBD)();
        // Ejecuta una consulta para obtener todos los módulos
        const [rows] = await connection.execute('SELECT * FROM unidad_medida');
        // Convierte los resultados a objetos UnidadMedidaModel
        const unidad_medida = [];
        for (const row of rows) {
            unidad_medida.push({
                unidad_medida_id: row.unidad_medida_id,
                descripcion: row.descripcion,
                abreviacion: row.abreviacion
            });
        }
        // Envía la respuesta con los datos de los módulos  
        res.status(200).json(unidad_medida);
    }
    catch (error) {
        console.error('Error al obtener unidades de medidas:', error);
        res.status(500).json({ message: 'Error al obtener unidades de medidas', error: error });
    }
};
exports.getAllRegister = getAllRegister;
const getOneRegister = async (req, res) => {
    const ID = req.params.id; // Obtiene el ID del parámetro de la solicitud
    try {
        // Establece la conexión a la base de datos utilizando la función de conexión
        const connection = await (0, database_1.conexionBD)();
        // Ejecuta una consulta para obtener un módulo por ID
        const [rows] = await connection.execute('SELECT * FROM unidad_medida WHERE unidad_medida_id = ?', [ID]);
        // Verifica si se encontró un módulo con el ID proporcionado
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Unidad de medida no encontrado' });
        }
        // Convierte el resultado a un objeto UnidadMedidaModel
        const unidad_medida = {
            unidad_medida_id: rows[0].unidad_medida_id,
            descripcion: rows[0].descripcion,
            abreviacion: rows[0].abreviacion
        };
        // Envía la respuesta con el módulo encontrado
        res.status(200).json(unidad_medida);
    }
    catch (error) {
        console.error('Error al obtener la Unidad de medida:', error);
        res.status(500).json({ message: 'Error al obtener la Unidad de medida', error: error });
    }
};
exports.getOneRegister = getOneRegister;
const insertRegister = async (req, res) => {
    try {
        const { descripcion, abreviacion } = req.body;
        const missingFields = [];
        // Verifica que todos los campos necesarios estén definidos en el cuerpo de la solicitud
        if (!descripcion)
            missingFields.push('descripcion');
        if (!abreviacion)
            missingFields.push('abreviacion');
        if (missingFields.length > 0) {
            return res.status(400).json({ message: 'Faltan campos obligatorios', missingFields });
        }
        // Verifica si ya existe un módulo con la misma abreviación
        const connection = await (0, database_1.conexionBD)();
        const [abreviacionRows] = await connection.execute('SELECT abreviacion FROM unidad_medida WHERE abreviacion = ?', [abreviacion]);
        if (abreviacionRows.length > 0) {
            return res.status(400).json({ message: 'La abreviación ya está en uso' });
        }
        // Ejecuta una consulta para insertar un nuevo módulo
        await connection.execute('INSERT INTO unidad_medida (descripcion, abreviacion) VALUES (?, ?)', [descripcion, abreviacion]);
        res.status(201).json({ message: 'Unidad de medida registrado con éxito' });
    }
    catch (error) {
        console.error('Error al registrar Unidad de medida:', error);
        res.status(500).json({ message: 'Error al registrar Unidad de medida', error: error });
    }
};
exports.insertRegister = insertRegister;
const updateRegister = async (req, res) => {
    try {
        const { descripcion, abreviacion } = req.body;
        const unidad_medida_id = req.params.id; // Recupera el unidad_medida_id de los parámetros de la ruta
        // Verifica que el ID del módulo y al menos un campo obligatorio estén presentes
        if (!unidad_medida_id || (descripcion === undefined && abreviacion === undefined)) {
            return res.status(400).json({ message: 'Falta el ID del módulo o al menos un campo obligatorio' });
        }
        const connection = await (0, database_1.conexionBD)();
        // Verifica si el módulo con el ID proporcionado existe en la base de datos
        const [unidad_medidaRows] = await connection.execute('SELECT * FROM unidad_medida WHERE unidad_medida_id = ?', [unidad_medida_id]);
        if (unidad_medidaRows.length === 0) {
            return res.status(404).json({ message: 'Unidad de medida no encontrado' });
        }
        // Verifica si la abreviación en la solicitud es igual a la abreviación actual en la base de datos
        if (abreviacion !== undefined && abreviacion !== unidad_medidaRows[0].abreviacion) {
            // Si no son iguales, verifica si la nueva abreviación ya existe en la base de datos
            const [existingAbreviacionRows] = await connection.execute('SELECT abreviacion FROM unidad_medida WHERE abreviacion = ? AND unidad_medida_id <> ?', [abreviacion, unidad_medida_id]);
            if (existingAbreviacionRows.length > 0) {
                return res.status(400).json({ message: 'La abreviación ya está en uso' });
            }
        }
        // Construye la consulta SQL y los parámetros dinámicamente
        const sqlParams = [];
        let sqlQuery = 'UPDATE unidad_medida SET';
        if (descripcion !== undefined) {
            sqlQuery += ' descripcion = ?,';
            sqlParams.push(descripcion);
        }
        if (abreviacion !== undefined) {
            sqlQuery += ' abreviacion = ?,';
            sqlParams.push(abreviacion);
        }
        // Elimina la última coma de la consulta SQL
        sqlQuery = sqlQuery.slice(0, -1);
        // Agrega el WHERE para el unidad_medida_id
        sqlQuery += ' WHERE unidad_medida_id = ?';
        sqlParams.push(unidad_medida_id);
        // Ejecuta la consulta SQL de actualización con parámetros dinámicos
        await connection.execute(sqlQuery, sqlParams);
        // Obtén el módulo actualizado desde la base de datos
        const [updatedunidad_medidaRows] = await connection.execute('SELECT * FROM unidad_medida WHERE unidad_medida_id = ?', [unidad_medida_id]);
        // Crea un objeto UnidadMedidaModel con los datos actualizados
        const unidad_medidaActualizado = {
            unidad_medida_id: updatedunidad_medidaRows[0].unidad_medida_id,
            descripcion: updatedunidad_medidaRows[0].descripcion,
            abreviacion: updatedunidad_medidaRows[0].abreviacion
        };
        res.status(200).json({ message: 'Unidad de Medida actualizada con éxito', unidad_medida: unidad_medidaActualizado });
    }
    catch (error) {
        console.error('Error al actualizar Unidad de medida:', error);
        res.status(500).json({ message: 'Error al actualizar Unidad de medida', error: error });
    }
};
exports.updateRegister = updateRegister;
const deleteRegister = async (req, res) => {
    try {
        const unidad_medida_id = req.params.id; // Recupera el unidad_medida_id de los parámetros de la URL
        if (!unidad_medida_id) {
            return res.status(400).json({ message: 'Falta el ID de la Undad de medida' });
        }
        const connection = await (0, database_1.conexionBD)();
        // Ejecuta la consulta para eliminar el módulo
        const [deleteResult] = await connection.execute('DELETE FROM unidad_medida WHERE unidad_medida_id = ?', [unidad_medida_id]);
        // Verifica si se eliminó correctamente
        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Módulo no encontrado' });
        }
        // Crea un objeto UnidadMedidaModel con los datos del módulo eliminado
        const unidad_medidaEliminado = {
            unidad_medida_id: deleteResult.insertId,
            descripcion: '',
            abreviacion: '', // Puedes dejar la abreviación en blanco o definir un valor apropiado
        };
        res.status(200).json({ message: 'Unidad de medida eliminada con éxito', unidad_medida: unidad_medidaEliminado });
    }
    catch (error) {
        // Verifica si el error se debe a una restricción de llave foránea
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'No se puede eliminar la Unidad de medida debido a que está relacionado a otros registros' });
        }
        console.error('Error al eliminar Unidad de medida:', error);
        res.status(500).json({ message: 'Error al eliminar Unidad de medida', error: error });
    }
};
exports.deleteRegister = deleteRegister;
