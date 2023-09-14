"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRegister = exports.updateRegister = exports.insertRegister = exports.getOneRegister = exports.getAllRegister = void 0;
const database_1 = require("../database");
// METODOS DEL CONTROLADOR
const getAllRegister = async (req, res) => {
    try {
        const connection = await (0, database_1.conexionBD)();
        const [rows] = await connection.execute('SELECT * FROM lista_precio_view');
        const listas_precios = [];
        for (const row of rows) {
            listas_precios.push({
                lista_precio_id: row.lista_precio_id,
                descripcion: row.descripcion,
                moneda_id: row.moneda_id,
                moneda_descripcion: row.moneda_descripcion
            });
        }
        res.status(200).json(listas_precios);
    }
    catch (error) {
        console.error('Error al obtener listas de precios:', error);
        res.status(500).json({ message: 'Error al obtener listas de precios', error: error });
    }
};
exports.getAllRegister = getAllRegister;
const getOneRegister = async (req, res) => {
    const ID = req.params.id;
    try {
        const connection = await (0, database_1.conexionBD)();
        const [rows] = await connection.execute('SELECT * FROM lista_precio WHERE lista_precio_id = ?', [ID]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Lista de precio no encontrado' });
        }
        const lista_precio = {
            lista_precio_id: rows[0].lista_precio_id,
            descripcion: rows[0].descripcion,
            moneda_id: rows[0].moneda_id
        };
        res.status(200).json(lista_precio);
    }
    catch (error) {
        console.error('Error al obtener una lista de precio:', error);
        res.status(500).json({ message: 'Error al obtener una lista de precio', error: error });
    }
};
exports.getOneRegister = getOneRegister;
const insertRegister = async (req, res) => {
    try {
        const { descripcion, moneda_id } = req.body;
        const missingFields = [];
        if (!descripcion)
            missingFields.push('descripcion');
        if (!moneda_id)
            missingFields.push('moneda_id');
        if (missingFields.length > 0) {
            return res.status(400).json({ message: 'Faltan campos obligatorios', missingFields });
        }
        const connection = await (0, database_1.conexionBD)();
        const [descripcionRows] = await connection.execute('SELECT descripcion FROM lista_precio WHERE descripcion = ?', [descripcion]);
        if (descripcionRows.length > 0) {
            return res.status(400).json({ message: 'La descripción ya está en uso' });
        }
        await connection.execute('INSERT INTO lista_precio (descripcion, moneda_id) VALUES (?, ?)', [descripcion, moneda_id]);
        res.status(201).json({ message: 'Moneda registrado con éxito' });
    }
    catch (error) {
        console.error('Error al registrar moneda:', error);
        res.status(500).json({ message: 'Error al registrar moneda', error: error });
    }
};
exports.insertRegister = insertRegister;
const updateRegister = async (req, res) => {
    try {
        const { descripcion, moneda_id } = req.body;
        const lista_precio_id = req.params.id;
        if (!lista_precio_id) {
            return res.status(400).json({ message: 'Falta el ID de la lista de precio' });
        }
        if (!moneda_id) {
            return res.status(400).json({ message: 'Falta el ID de la moneda' });
        }
        const connection = await (0, database_1.conexionBD)();
        const [lista_precioRows] = await connection.execute('SELECT * FROM lista_precio WHERE lista_precio_id = ?', [lista_precio_id]);
        if (lista_precioRows.length === 0) {
            return res.status(404).json({ message: 'Moneda no encontrado' });
        }
        if (descripcion !== lista_precioRows[0].descripcion) {
            const [existingDescripcionRows] = await connection.execute('SELECT descripcion FROM lista_precio WHERE descripcion = ? AND lista_precio_id <> ?', [descripcion, lista_precio_id]);
            if (existingDescripcionRows.length > 0) {
                return res.status(400).json({ message: 'La descripción ya está en uso' });
            }
        }
        await connection.execute('UPDATE lista_precio SET descripcion = ?, moneda_id = ? WHERE lista_precio_id = ?', [descripcion, moneda_id, lista_precio_id]);
        const [updatedListaPrecioRows] = await connection.execute('SELECT * FROM lista_precio WHERE lista_precio_id = ?', [lista_precio_id]);
        const listaPrecioActualizado = {
            lista_precio_id: updatedListaPrecioRows[0].lista_precio_id,
            descripcion: updatedListaPrecioRows[0].descripcion,
            moneda_id: updatedListaPrecioRows[0].moneda,
        };
        res.status(200).json({ message: 'Lista de precio actualizado con éxito', articulo: listaPrecioActualizado });
    }
    catch (error) {
        console.error('Error al actualizar lista de precio:', error);
        res.status(500).json({ message: 'Error al actualizar lista de precio', error: error });
    }
};
exports.updateRegister = updateRegister;
const deleteRegister = async (req, res) => {
    try {
        const lista_precio_id = req.params.id;
        if (!lista_precio_id) {
            return res.status(400).json({ message: 'Falta el ID de la lista de precio' });
        }
        const connection = await (0, database_1.conexionBD)();
        const [deleteResult] = await connection.execute('DELETE FROM lista_precio WHERE lista_precio_id = ?', [lista_precio_id]);
        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Lista de precio no encontrado' });
        }
        const listaPrecioEliminado = {
            lista_precio_id: deleteResult.insertId,
            descripcion: '',
            moneda_id: 0,
        };
        res.status(200).json({ message: 'Lista de preico eliminado con éxito', lista_precio: listaPrecioEliminado });
    }
    catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'No se puede eliminar la lista de precio debido a que esta relacionado a otros registros' });
        }
        console.error('Error al eliminar lista de precio:', error);
        res.status(500).json({ message: 'Error al eliminar lista de precio', error: error });
    }
};
exports.deleteRegister = deleteRegister;
