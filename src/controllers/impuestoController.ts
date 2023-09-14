import { Request, Response } from 'express';
import { conexionBD } from '../database';
import { ImpuestoModel } from '../models/impuestoModel'; 

// METODOS DEL CONTROLADOR
export const getAllRegister = async (req: Request, res: Response) => {
    try {
        
        const connection = await conexionBD();

       
        const [rows]: any = await connection.execute('SELECT * FROM impuesto');

       
        const impuestos: ImpuestoModel[] = [];

        for (const row of rows) {
            impuestos.push({
                impuesto_id: row.impuesto_id,
                descripcion: row.descripcion,
                valor: row.valor,
                porcentaje: row.porcentaje
            });
        }

        res.status(200).json(impuestos);
    } catch (error) {
        console.error('Error al obtener impuestos:', error);
        res.status(500).json({ message: 'Error al obtener impuestos', error: error });
    }
};

export const getOneRegister = async (req: Request, res: Response) => {
    const ID = req.params.id; 

    try {
        
        const connection = await conexionBD();

        
        const [rows]: any = await connection.execute('SELECT * FROM impuesto WHERE impuesto_id = ?', [ID]);


        if (rows.length === 0) {
            return res.status(404).json({ message: 'Impuesto no encontrado' });
        }

        const impuesto: ImpuestoModel = {
            impuesto_id: rows[0].impuesto_id,
            descripcion: rows[0].descripcion,
            valor: rows[0].valor,
            porcentaje: rows[0].porcentaje
        };

        res.status(200).json(impuesto);
    } catch (error) {
        console.error('Error al obtener un impuesto:', error);
        res.status(500).json({ message: 'Error al obtener un impuesto', error: error });
    }
};

export const insertRegister = async (req: Request, res: Response) => {
    try {
        const { descripcion, valor, porcentaje } = req.body;
        const missingFields = [];

        if (!descripcion) missingFields.push('descripcion');

        if (valor === undefined || valor === null) {
            missingFields.push('valor');
        }
        if (porcentaje === undefined || porcentaje === null) {
            missingFields.push('porcentaje');
        }

        if (missingFields.length > 0) {
            return res.status(400).json({ message: 'Faltan campos obligatorios', missingFields });
        }

        const connection = await conexionBD();
        const [descripcionRows]: any = await connection.execute('SELECT descripcion FROM impuesto WHERE descripcion = ?', [descripcion]);

        if (descripcionRows.length > 0) {
            return res.status(400).json({ message: 'La descripción ya está en uso' });
        }

        await connection.execute(
            'INSERT INTO impuesto (descripcion, valor, porcentaje) VALUES (?, ?, ?)',
            [descripcion, valor, porcentaje]
        );

        res.status(201).json({ message: 'impuesto registrado con éxito' });
    } catch (error) {
        console.error('Error al registrar impuesto:', error);
        res.status(500).json({ message: 'Error al registrar impuesto', error: error });
    }
};

export const updateRegister = async (req: Request, res: Response) => {
    try {
        const { descripcion, valor, porcentaje } = req.body;
        const impuesto_id = req.params.id; 

        if (!impuesto_id) {
            return res.status(400).json({ message: 'Falta el ID del impuesto' });
        }

        const connection = await conexionBD();

        const [impuestoRows]: any = await connection.execute('SELECT * FROM impuesto WHERE impuesto_id = ?', [impuesto_id]);

        if (impuestoRows.length === 0) {
            return res.status(404).json({ message: 'impuesto no encontrado' });
        }

        if (descripcion !== impuestoRows[0].descripcion) {
            const [existingDescripcionRows]: any = await connection.execute('SELECT descripcion FROM impuesto WHERE descripcion = ? AND impuesto_id <> ?', [descripcion, impuesto_id]);
            if (existingDescripcionRows.length > 0) {
                return res.status(400).json({ message: 'La descripción ya está en uso' });
            }
        }

        await connection.execute(
            'UPDATE impuesto SET descripcion = ?, valor = ?, porcentaje = ? WHERE impuesto_id = ?',
            [descripcion, valor, porcentaje, impuesto_id]
        );

        const [updatedimpuestoRows]: any = await connection.execute('SELECT * FROM impuesto WHERE impuesto_id = ?', [impuesto_id]);

        const impuestoActualizado: ImpuestoModel = {
            impuesto_id: updatedimpuestoRows[0].impuesto_id,
            descripcion: updatedimpuestoRows[0].descripcion,
            valor: updatedimpuestoRows[0].valor,
            porcentaje: updatedimpuestoRows[0].porcentaje
        };

        res.status(200).json({ message: 'impuesto actualizado con éxito', impuesto: impuestoActualizado });
    } catch (error) {
        console.error('Error al actualizar impuesto:', error);
        res.status(500).json({ message: 'Error al actualizar impuesto', error: error });
    }
};

export const deleteRegister = async (req: Request, res: Response) => {
    try {
        const impuesto_id = req.params.id; 

        if (!impuesto_id) {
            return res.status(400).json({ message: 'Falta el ID del impuesto' });
        }

        const connection = await conexionBD();

        const [deleteResult]: any = await connection.execute('DELETE FROM impuesto WHERE impuesto_id = ?', [impuesto_id]);

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: 'impuesto no encontrado' });
        }

        const impuestoEliminado: ImpuestoModel = {
            impuesto_id: deleteResult.insertId, 
            descripcion: '', 
            valor:0,
            porcentaje:0
        };

        res.status(200).json({ message: 'impuesto eliminado con éxito', impuesto: impuestoEliminado });
    } catch (error: any) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'No se puede eliminar el impuesto debido a que esta relacionado a otros registros' });
        }

        console.error('Error al eliminar impuesto:', error);
        res.status(500).json({ message: 'Error al eliminar impuesto', error: error });
    }
};
