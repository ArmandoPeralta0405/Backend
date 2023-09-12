"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRegister = exports.updateRegister = exports.insertRegister = exports.getOneRegister = exports.getAllRegister = void 0;
const database_1 = require("../database");
// METODOS DEL CONTROLADOR
const getAllRegister = async (req, res) => {
    try {
        const connection = await (0, database_1.conexionBD)();
        const [rows] = await connection.execute('SELECT * FROM impuesto');
        const impuestos = [];
        for (const row of rows) {
            impuestos.push({
                impuesto_id: row.impuesto_id,
                descripcion: row.descripcion,
                valor: row.valor
            });
        }
        res.status(200).json(impuestos);
    }
    catch (error) {
        console.error('Error al obtener impuestos:', error);
        res.status(500).json({ message: 'Error al obtener impuestos', error: error });
    }
};
exports.getAllRegister = getAllRegister;
const getOneRegister = async (req, res) => {
    const ID = req.params.id;
    try {
        const connection = await (0, database_1.conexionBD)();
        const [rows] = await connection.execute('SELECT * FROM impuesto WHERE impuesto_id = ?', [ID]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Impuesto no encontrado' });
        }
        const impuesto = {
            impuesto_id: rows[0].impuesto_id,
            descripcion: rows[0].descripcion,
            valor: rows[0].valor,
        };
        res.status(200).json(impuesto);
    }
    catch (error) {
        console.error('Error al obtener un impuesto:', error);
        res.status(500).json({ message: 'Error al obtener un impuesto', error: error });
    }
};
exports.getOneRegister = getOneRegister;
const insertRegister = async (req, res) => {
    try {
        const { descripcion, valor } = req.body;
        const missingFields = [];
        if (!descripcion)
            missingFields.push('descripcion');
        if (valor === undefined || valor === null) {
            missingFields.push('valor');
        }
        if (missingFields.length > 0) {
            return res.status(400).json({ message: 'Faltan campos obligatorios', missingFields });
        }
        const connection = await (0, database_1.conexionBD)();
        const [descripcionRows] = await connection.execute('SELECT descripcion FROM impuesto WHERE descripcion = ?', [descripcion]);
        if (descripcionRows.length > 0) {
            return res.status(400).json({ message: 'La descripción ya está en uso' });
        }
        await connection.execute('INSERT INTO impuesto (descripcion, valor) VALUES (?, ?)', [descripcion, valor]);
        res.status(201).json({ message: 'impuesto registrado con éxito' });
    }
    catch (error) {
        console.error('Error al registrar impuesto:', error);
        res.status(500).json({ message: 'Error al registrar impuesto', error: error });
    }
};
exports.insertRegister = insertRegister;
const updateRegister = async (req, res) => {
    try {
        const { descripcion, valor } = req.body;
        const impuesto_id = req.params.id;
        if (!impuesto_id) {
            return res.status(400).json({ message: 'Falta el ID del impuesto' });
        }
        const connection = await (0, database_1.conexionBD)();
        const [impuestoRows] = await connection.execute('SELECT * FROM impuesto WHERE impuesto_id = ?', [impuesto_id]);
        if (impuestoRows.length === 0) {
            return res.status(404).json({ message: 'impuesto no encontrado' });
        }
        if (descripcion !== impuestoRows[0].descripcion) {
            const [existingDescripcionRows] = await connection.execute('SELECT descripcion FROM impuesto WHERE descripcion = ? AND impuesto_id <> ?', [descripcion, impuesto_id]);
            if (existingDescripcionRows.length > 0) {
                return res.status(400).json({ message: 'La descripción ya está en uso' });
            }
        }
        await connection.execute('UPDATE impuesto SET descripcion = ?, valor = ? WHERE impuesto_id = ?', [descripcion, valor, impuesto_id]);
        const [updatedimpuestoRows] = await connection.execute('SELECT * FROM impuesto WHERE impuesto_id = ?', [impuesto_id]);
        const impuestoActualizado = {
            impuesto_id: updatedimpuestoRows[0].impuesto_id,
            descripcion: updatedimpuestoRows[0].descripcion,
            valor: updatedimpuestoRows[0].valor,
        };
        res.status(200).json({ message: 'impuesto actualizado con éxito', impuesto: impuestoActualizado });
    }
    catch (error) {
        console.error('Error al actualizar impuesto:', error);
        res.status(500).json({ message: 'Error al actualizar impuesto', error: error });
    }
};
exports.updateRegister = updateRegister;
const deleteRegister = async (req, res) => {
    try {
        const impuesto_id = req.params.id;
        if (!impuesto_id) {
            return res.status(400).json({ message: 'Falta el ID del impuesto' });
        }
        const connection = await (0, database_1.conexionBD)();
        const [deleteResult] = await connection.execute('DELETE FROM impuesto WHERE impuesto_id = ?', [impuesto_id]);
        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: 'impuesto no encontrado' });
        }
        const impuestoEliminado = {
            impuesto_id: deleteResult.insertId,
            descripcion: '',
            valor: 0
        };
        res.status(200).json({ message: 'impuesto eliminado con éxito', impuesto: impuestoEliminado });
    }
    catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'No se puede eliminar el impuesto debido a que esta relacionado a otros registros' });
        }
        console.error('Error al eliminar impuesto:', error);
        res.status(500).json({ message: 'Error al eliminar impuesto', error: error });
    }
};
exports.deleteRegister = deleteRegister;
