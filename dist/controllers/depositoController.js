"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRegister = exports.updateRegister = exports.insertRegister = exports.getOneRegister = exports.getAllRegister = void 0;
const database_1 = require("../database");
// METODOS DEL CONTROLADOR
const getAllRegister = async (req, res) => {
    try {
        const connection = await (0, database_1.conexionBD)();
        const [rows] = await connection.execute('SELECT * FROM deposito');
        const depositos = [];
        for (const row of rows) {
            depositos.push({
                deposito_id: row.deposito_id,
                descripcion: row.descripcion,
            });
        }
        res.status(200).json(depositos);
    }
    catch (error) {
        console.error('Error al obtener depositos:', error);
        res.status(500).json({ message: 'Error al obtener depositos', error: error });
    }
};
exports.getAllRegister = getAllRegister;
const getOneRegister = async (req, res) => {
    const ID = req.params.id;
    try {
        const connection = await (0, database_1.conexionBD)();
        const [rows] = await connection.execute('SELECT * FROM deposito WHERE deposito_id = ?', [ID]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Deposito no encontrado' });
        }
        const deposito = {
            deposito_id: rows[0].deposito_id,
            descripcion: rows[0].descripcion,
        };
        res.status(200).json(deposito);
    }
    catch (error) {
        console.error('Error al obtener un deposito:', error);
        res.status(500).json({ message: 'Error al obtener un deposito', error: error });
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
        const [descripcionRows] = await connection.execute('SELECT descripcion FROM deposito WHERE descripcion = ?', [descripcion]);
        if (descripcionRows.length > 0) {
            return res.status(400).json({ message: 'La descripción ya está en uso' });
        }
        await connection.execute('INSERT INTO deposito (descripcion) VALUES (?)', [descripcion]);
        res.status(201).json({ message: 'Deposito registrado con éxito' });
    }
    catch (error) {
        console.error('Error al registrar deposito:', error);
        res.status(500).json({ message: 'Error al registrar deposito', error: error });
    }
};
exports.insertRegister = insertRegister;
const updateRegister = async (req, res) => {
    try {
        const { descripcion } = req.body;
        const deposito_id = req.params.id;
        if (!deposito_id) {
            return res.status(400).json({ message: 'Falta el ID del deposito' });
        }
        const connection = await (0, database_1.conexionBD)();
        const [depositoRows] = await connection.execute('SELECT * FROM deposito WHERE deposito_id = ?', [deposito_id]);
        if (depositoRows.length === 0) {
            return res.status(404).json({ message: 'Deposito no encontrado' });
        }
        if (descripcion !== depositoRows[0].descripcion) {
            const [existingDescripcionRows] = await connection.execute('SELECT descripcion FROM deposito WHERE descripcion = ? AND deposito_id <> ?', [descripcion, deposito_id]);
            if (existingDescripcionRows.length > 0) {
                return res.status(400).json({ message: 'La descripción ya está en uso' });
            }
        }
        await connection.execute('UPDATE deposito SET descripcion = ? WHERE deposito_id = ?', [descripcion, deposito_id]);
        const [updatedDepositoRows] = await connection.execute('SELECT * FROM deposito WHERE deposito_id = ?', [deposito_id]);
        const depositoActualizado = {
            deposito_id: updatedDepositoRows[0].deposito_id,
            descripcion: updatedDepositoRows[0].descripcion,
        };
        res.status(200).json({ message: 'Deposito actualizado con éxito', deposito: depositoActualizado });
    }
    catch (error) {
        console.error('Error al actualizar deposito:', error);
        res.status(500).json({ message: 'Error al actualizar deposito', error: error });
    }
};
exports.updateRegister = updateRegister;
const deleteRegister = async (req, res) => {
    try {
        const deposito_id = req.params.id;
        if (!deposito_id) {
            return res.status(400).json({ message: 'Falta el ID del deposito' });
        }
        const connection = await (0, database_1.conexionBD)();
        const [deleteResult] = await connection.execute('DELETE FROM deposito WHERE deposito_id = ?', [deposito_id]);
        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Deposito no encontrado' });
        }
        const depositoEliminado = {
            deposito_id: deleteResult.insertId,
            descripcion: '',
        };
        res.status(200).json({ message: 'Deposito eliminado con éxito', deposito: depositoEliminado });
    }
    catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'No se puede eliminar el deposito debido a que esta relacionado a otros registros' });
        }
        console.error('Error al eliminar deposito:', error);
        res.status(500).json({ message: 'Error al eliminar deposito', error: error });
    }
};
exports.deleteRegister = deleteRegister;
