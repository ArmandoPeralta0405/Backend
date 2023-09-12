import { Request, Response } from 'express';
import { conexionBD } from '../database';
import { DepositoModel } from '../models/depositoModel'; 

// METODOS DEL CONTROLADOR
export const getAllRegister = async (req: Request, res: Response) => {
    try {
        
        const connection = await conexionBD();

       
        const [rows]: any = await connection.execute('SELECT * FROM deposito');

       
        const depositos: DepositoModel[] = [];

        for (const row of rows) {
            depositos.push({
                deposito_id: row.deposito_id,
                descripcion: row.descripcion,
            });
        }

        res.status(200).json(depositos);
    } catch (error) {
        console.error('Error al obtener depositos:', error);
        res.status(500).json({ message: 'Error al obtener depositos', error: error });
    }
};

export const getOneRegister = async (req: Request, res: Response) => {
    const ID = req.params.id; 

    try {
        
        const connection = await conexionBD();

        
        const [rows]: any = await connection.execute('SELECT * FROM deposito WHERE deposito_id = ?', [ID]);


        if (rows.length === 0) {
            return res.status(404).json({ message: 'Deposito no encontrado' });
        }

        const deposito: DepositoModel = {
            deposito_id: rows[0].deposito_id,
            descripcion: rows[0].descripcion,
        };

        res.status(200).json(deposito);
    } catch (error) {
        console.error('Error al obtener un deposito:', error);
        res.status(500).json({ message: 'Error al obtener un deposito', error: error });
    }
};

export const insertRegister = async (req: Request, res: Response) => {
    try {
        const { descripcion } = req.body;
        const missingFields = [];

        if (!descripcion) missingFields.push('descripcion');

        if (missingFields.length > 0) {
            return res.status(400).json({ message: 'Faltan campos obligatorios', missingFields });
        }

        const connection = await conexionBD();
        const [descripcionRows]: any = await connection.execute('SELECT descripcion FROM deposito WHERE descripcion = ?', [descripcion]);

        if (descripcionRows.length > 0) {
            return res.status(400).json({ message: 'La descripción ya está en uso' });
        }

        await connection.execute(
            'INSERT INTO deposito (descripcion) VALUES (?)',
            [descripcion]
        );

        res.status(201).json({ message: 'Deposito registrado con éxito' });
    } catch (error) {
        console.error('Error al registrar deposito:', error);
        res.status(500).json({ message: 'Error al registrar deposito', error: error });
    }
};

export const updateRegister = async (req: Request, res: Response) => {
    try {
        const { descripcion } = req.body;
        const deposito_id = req.params.id; 

        if (!deposito_id) {
            return res.status(400).json({ message: 'Falta el ID del deposito' });
        }

        const connection = await conexionBD();

        const [depositoRows]: any = await connection.execute('SELECT * FROM deposito WHERE deposito_id = ?', [deposito_id]);

        if (depositoRows.length === 0) {
            return res.status(404).json({ message: 'Deposito no encontrado' });
        }

        if (descripcion !== depositoRows[0].descripcion) {
            const [existingDescripcionRows]: any = await connection.execute('SELECT descripcion FROM deposito WHERE descripcion = ? AND deposito_id <> ?', [descripcion, deposito_id]);
            if (existingDescripcionRows.length > 0) {
                return res.status(400).json({ message: 'La descripción ya está en uso' });
            }
        }

        await connection.execute(
            'UPDATE deposito SET descripcion = ? WHERE deposito_id = ?',
            [descripcion, deposito_id]
        );

        const [updatedDepositoRows]: any = await connection.execute('SELECT * FROM deposito WHERE deposito_id = ?', [deposito_id]);

        const depositoActualizado: DepositoModel = {
            deposito_id: updatedDepositoRows[0].deposito_id,
            descripcion: updatedDepositoRows[0].descripcion,
        };

        res.status(200).json({ message: 'Deposito actualizado con éxito', deposito: depositoActualizado });
    } catch (error) {
        console.error('Error al actualizar deposito:', error);
        res.status(500).json({ message: 'Error al actualizar deposito', error: error });
    }
};

export const deleteRegister = async (req: Request, res: Response) => {
    try {
        const deposito_id = req.params.id; 

        if (!deposito_id) {
            return res.status(400).json({ message: 'Falta el ID del deposito' });
        }

        const connection = await conexionBD();

        const [deleteResult]: any = await connection.execute('DELETE FROM deposito WHERE deposito_id = ?', [deposito_id]);

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Deposito no encontrado' });
        }

        const depositoEliminado: DepositoModel = {
            deposito_id: deleteResult.insertId, 
            descripcion: '', 
        };

        res.status(200).json({ message: 'Deposito eliminado con éxito', deposito: depositoEliminado });
    } catch (error: any) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'No se puede eliminar el deposito debido a que esta relacionado a otros registros' });
        }

        console.error('Error al eliminar deposito:', error);
        res.status(500).json({ message: 'Error al eliminar deposito', error: error });
    }
};
