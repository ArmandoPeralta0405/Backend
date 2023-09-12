"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRegister = exports.updateRegister = exports.insertRegister = exports.getOneRegister = exports.getAllRegister = void 0;
const database_1 = require("../database");
// METODOS DEL CONTROLADOR
const getAllRegister = async (req, res) => {
    try {
        const connection = await (0, database_1.conexionBD)();
        const [rows] = await connection.execute('SELECT * FROM marca');
        const marcas = [];
        for (const row of rows) {
            marcas.push({
                marca_id: row.marca_id,
                descripcion: row.descripcion,
            });
        }
        res.status(200).json(marcas);
    }
    catch (error) {
        console.error('Error al obtener marcas:', error);
        res.status(500).json({ message: 'Error al obtener marcas', error: error });
    }
};
exports.getAllRegister = getAllRegister;
const getOneRegister = async (req, res) => {
    const ID = req.params.id;
    try {
        const connection = await (0, database_1.conexionBD)();
        const [rows] = await connection.execute('SELECT * FROM marca WHERE marca_id = ?', [ID]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'marca no encontrado' });
        }
        const marca = {
            marca_id: rows[0].marca_id,
            descripcion: rows[0].descripcion,
        };
        res.status(200).json(marca);
    }
    catch (error) {
        console.error('Error al obtener un marca:', error);
        res.status(500).json({ message: 'Error al obtener un marca', error: error });
    }
};
exports.getOneRegister = getOneRegister;
const insertRegister = async (req, res) => {
    try {
        const { descripcion } = req.body;
        const missingFields = [];
        if (!descripcion)
            missingFields.push('descripcion');
        if (missingFields.length > 0) {
            return res.status(400).json({ message: 'Faltan campos obligatorios', missingFields });
        }
        const connection = await (0, database_1.conexionBD)();
        const [descripcionRows] = await connection.execute('SELECT descripcion FROM marca WHERE descripcion = ?', [descripcion]);
        if (descripcionRows.length > 0) {
            return res.status(400).json({ message: 'La descripción ya está en uso' });
        }
        await connection.execute('INSERT INTO marca (descripcion) VALUES (?)', [descripcion]);
        res.status(201).json({ message: 'marca registrado con éxito' });
    }
    catch (error) {
        console.error('Error al registrar marca:', error);
        res.status(500).json({ message: 'Error al registrar marca', error: error });
    }
};
exports.insertRegister = insertRegister;
const updateRegister = async (req, res) => {
    try {
        const { descripcion } = req.body;
        const marca_id = req.params.id;
        if (!marca_id) {
            return res.status(400).json({ message: 'Falta el ID del marca' });
        }
        const connection = await (0, database_1.conexionBD)();
        const [marcaRows] = await connection.execute('SELECT * FROM marca WHERE marca_id = ?', [marca_id]);
        if (marcaRows.length === 0) {
            return res.status(404).json({ message: 'marca no encontrado' });
        }
        if (descripcion !== marcaRows[0].descripcion) {
            const [existingDescripcionRows] = await connection.execute('SELECT descripcion FROM marca WHERE descripcion = ? AND marca_id <> ?', [descripcion, marca_id]);
            if (existingDescripcionRows.length > 0) {
                return res.status(400).json({ message: 'La descripción ya está en uso' });
            }
        }
        await connection.execute('UPDATE marca SET descripcion = ? WHERE marca_id = ?', [descripcion, marca_id]);
        const [updatedmarcaRows] = await connection.execute('SELECT * FROM marca WHERE marca_id = ?', [marca_id]);
        const marcaActualizado = {
            marca_id: updatedmarcaRows[0].marca_id,
            descripcion: updatedmarcaRows[0].descripcion,
        };
        res.status(200).json({ message: 'marca actualizado con éxito', marca: marcaActualizado });
    }
    catch (error) {
        console.error('Error al actualizar marca:', error);
        res.status(500).json({ message: 'Error al actualizar marca', error: error });
    }
};
exports.updateRegister = updateRegister;
const deleteRegister = async (req, res) => {
    try {
        const marca_id = req.params.id;
        if (!marca_id) {
            return res.status(400).json({ message: 'Falta el ID del marca' });
        }
        const connection = await (0, database_1.conexionBD)();
        const [deleteResult] = await connection.execute('DELETE FROM marca WHERE marca_id = ?', [marca_id]);
        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: 'marca no encontrado' });
        }
        const marcaEliminado = {
            marca_id: deleteResult.insertId,
            descripcion: '',
        };
        res.status(200).json({ message: 'marca eliminado con éxito', marca: marcaEliminado });
    }
    catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'No se puede eliminar el marca debido a que esta relacionado a otros registros' });
        }
        console.error('Error al eliminar marca:', error);
        res.status(500).json({ message: 'Error al eliminar marca', error: error });
    }
};
exports.deleteRegister = deleteRegister;
