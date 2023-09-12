"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEstado = exports.deleteRegister = exports.updateRegister = exports.insertRegister = exports.getOneRegister = exports.getAllRegister = void 0;
const database_1 = require("../database");
// METODOS DEL CONTROLADOR
const getAllRegister = async (req, res) => {
    try {
        const connection = await (0, database_1.conexionBD)();
        const [rows] = await connection.execute('SELECT * FROM articulo_view');
        const articulos = [];
        for (const row of rows) {
            articulos.push({
                articulo_id: row.articulo_id,
                descripcion: row.descripcion,
                codigo_alfanumerico: row.codigo_alfanumerico,
                marca_id: row.marca_id,
                marca_descripcion: row.marca_descripcion,
                impuesto_id: row.impuesto_id,
                impuesto_descripcion: row.impuesto_descripcion,
                unidad_medida_id: row.unidad_medida_id,
                unidad_medida_descripcion: row.unidad_medida_descripcion,
                estado: row.estado
            });
        }
        res.status(200).json(articulos);
    }
    catch (error) {
        console.error('Error al obtener articulos:', error);
        res.status(500).json({ message: 'Error al obtener articulos', error: error });
    }
};
exports.getAllRegister = getAllRegister;
const getOneRegister = async (req, res) => {
    const ID = req.params.id;
    try {
        const connection = await (0, database_1.conexionBD)();
        const [rows] = await connection.execute('SELECT * FROM articulo WHERE articulo_id = ?', [ID]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Articulo no encontrado' });
        }
        const articulo = {
            articulo_id: rows[0].articulo_id,
            descripcion: rows[0].descripcion,
            codigo_alfanumerico: rows[0].codigo_alfanumerico,
            marca_id: rows[0].marca_id,
            impuesto_id: rows[0].impuesto_id,
            unidad_medida_id: rows[0].unidad_medida_id,
            estado: rows[0].estado
        };
        res.status(200).json(articulo);
    }
    catch (error) {
        console.error('Error al obtener un articulo:', error);
        res.status(500).json({ message: 'Error al obtener un articulo', error: error });
    }
};
exports.getOneRegister = getOneRegister;
const insertRegister = async (req, res) => {
    try {
        const { descripcion, codigo_alfanumerico, marca_id, impuesto_id, unidad_medida_id } = req.body;
        const missingFields = [];
        if (!descripcion)
            missingFields.push('descripcion');
        if (!codigo_alfanumerico)
            missingFields.push('codigo_alfanumerico');
        if (!marca_id)
            missingFields.push('marca_id');
        if (!impuesto_id)
            missingFields.push('impuesto_id');
        if (!unidad_medida_id)
            missingFields.push('unidad_medida_id');
        if (missingFields.length > 0) {
            return res.status(400).json({ message: 'Faltan campos obligatorios', missingFields });
        }
        const connection = await (0, database_1.conexionBD)();
        const [descripcionRows] = await connection.execute('SELECT descripcion FROM articulo WHERE descripcion = ?', [descripcion]);
        if (descripcionRows.length > 0) {
            return res.status(400).json({ message: 'La descripción ya está en uso' });
        }
        await connection.execute('INSERT INTO articulo (descripcion, codigo_alfanumerico, marca_id, impuesto_id, unidad_medida_id) VALUES (?, ?, ?, ?, ?)', [descripcion, codigo_alfanumerico, marca_id, impuesto_id, unidad_medida_id]);
        res.status(201).json({ message: 'Articulo registrado con éxito' });
    }
    catch (error) {
        console.error('Error al registrar articulo:', error);
        res.status(500).json({ message: 'Error al registrar articulo', error: error });
    }
};
exports.insertRegister = insertRegister;
const updateRegister = async (req, res) => {
    try {
        const { descripcion, codigo_alfanumerico, marca_id, impuesto_id, unidad_medida_id } = req.body;
        const articulo_id = req.params.id;
        if (!articulo_id) {
            return res.status(400).json({ message: 'Falta el ID del articulo' });
        }
        if (!codigo_alfanumerico) {
            return res.status(400).json({ message: 'Falta el Codigo alfanumerico del articulo' });
        }
        if (!marca_id) {
            return res.status(400).json({ message: 'Falta el ID de la marca' });
        }
        if (!impuesto_id) {
            return res.status(400).json({ message: 'Falta el ID del impuesto' });
        }
        if (!unidad_medida_id) {
            return res.status(400).json({ message: 'Falta el ID de la unidad de medida' });
        }
        const connection = await (0, database_1.conexionBD)();
        const [articuloRows] = await connection.execute('SELECT * FROM articulo WHERE articulo_id = ?', [articulo_id]);
        if (articuloRows.length === 0) {
            return res.status(404).json({ message: 'Articulo no encontrado' });
        }
        if (descripcion !== articuloRows[0].descripcion) {
            const [existingDescripcionRows] = await connection.execute('SELECT descripcion FROM articulo WHERE descripcion = ? AND articulo_id <> ?', [descripcion, articulo_id]);
            if (existingDescripcionRows.length > 0) {
                return res.status(400).json({ message: 'La descripción ya está en uso' });
            }
        }
        await connection.execute('UPDATE articulo SET descripcion = ?, codigo_alfanumerico = ?, marca_id = ?, impuesto_id = ?, unidad_medida_id = ? WHERE articulo_id = ?', [descripcion, codigo_alfanumerico, marca_id, impuesto_id, unidad_medida_id, articulo_id]);
        const [updatedArticuloRows] = await connection.execute('SELECT * FROM articulo WHERE articulo_id = ?', [articulo_id]);
        const articuloActualizado = {
            articulo_id: updatedArticuloRows[0].articulo_id,
            descripcion: updatedArticuloRows[0].descripcion,
            codigo_alfanumerico: updatedArticuloRows[0].codigo_alfanumerico,
            marca_id: updatedArticuloRows[0].marca_id,
            impuesto_id: updatedArticuloRows[0].impuesto_id,
            unidad_medida_id: updatedArticuloRows[0].unidad_medida_id,
            estado: updatedArticuloRows[0].estado
        };
        res.status(200).json({ message: 'Articulo actualizado con éxito', articulo: articuloActualizado });
    }
    catch (error) {
        console.error('Error al actualizar articulo:', error);
        res.status(500).json({ message: 'Error al actualizar articulo', error: error });
    }
};
exports.updateRegister = updateRegister;
const deleteRegister = async (req, res) => {
    try {
        const articulo_id = req.params.id;
        if (!articulo_id) {
            return res.status(400).json({ message: 'Falta el ID del articulo' });
        }
        const connection = await (0, database_1.conexionBD)();
        const [deleteResult] = await connection.execute('DELETE FROM articulo WHERE articulo_id = ?', [articulo_id]);
        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Articulo no encontrado' });
        }
        const articuloEliminado = {
            articulo_id: deleteResult.insertId,
            descripcion: '',
            codigo_alfanumerico: '',
            marca_id: 0,
            impuesto_id: 0,
            unidad_medida_id: 0,
            estado: true
        };
        res.status(200).json({ message: 'Articulo eliminado con éxito', articulo: articuloEliminado });
    }
    catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'No se puede eliminar el articulo debido a que esta relacionado a otros registros' });
        }
        console.error('Error al eliminar articulo:', error);
        res.status(500).json({ message: 'Error al eliminar articulo', error: error });
    }
};
exports.deleteRegister = deleteRegister;
const updateEstado = async (req, res) => {
    try {
        const articulo_id = req.params.id;
        const nuevoEstado = req.body.estado;
        if (!articulo_id || nuevoEstado === undefined) {
            return res.status(400).json({ message: 'Falta el ID del articulo o el nuevo estado' });
        }
        const connection = await (0, database_1.conexionBD)();
        const [articuloRows] = await connection.execute('SELECT * FROM articulo WHERE articulo_id = ?', [articulo_id]);
        if (articuloRows.length === 0) {
            return res.status(404).json({ message: 'Articulo no encontrado' });
        }
        await connection.execute('UPDATE articulo SET estado = ? WHERE articulo_id = ?', [nuevoEstado, articulo_id]);
        const articuloActualizado = {
            ...articuloRows[0],
            estado: nuevoEstado,
        };
        res.status(200).json({ message: 'Estado del articulo actualizado con éxito', articulo: articuloActualizado });
    }
    catch (error) {
        console.error('Error al actualizar estado del articulo:', error);
        res.status(500).json({ message: 'Error al actualizar estado del articulo', error: error });
    }
};
exports.updateEstado = updateEstado;
