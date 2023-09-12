import { Request, Response } from 'express';
import { conexionBD } from '../database';
import { MarcaModel } from '../models/marcaModel'; 

// METODOS DEL CONTROLADOR
export const getAllRegister = async (req: Request, res: Response) => {
    try {
        
        const connection = await conexionBD();

       
        const [rows]: any = await connection.execute('SELECT * FROM marca');

       
        const marcas: MarcaModel[] = [];

        for (const row of rows) {
            marcas.push({
                marca_id: row.marca_id,
                descripcion: row.descripcion,
            });
        }

        res.status(200).json(marcas);
    } catch (error) {
        console.error('Error al obtener marcas:', error);
        res.status(500).json({ message: 'Error al obtener marcas', error: error });
    }
};

export const getOneRegister = async (req: Request, res: Response) => {
    const ID = req.params.id; 

    try {
        
        const connection = await conexionBD();

        
        const [rows]: any = await connection.execute('SELECT * FROM marca WHERE marca_id = ?', [ID]);


        if (rows.length === 0) {
            return res.status(404).json({ message: 'marca no encontrado' });
        }

        const marca: MarcaModel = {
            marca_id: rows[0].marca_id,
            descripcion: rows[0].descripcion,
        };

        res.status(200).json(marca);
    } catch (error) {
        console.error('Error al obtener un marca:', error);
        res.status(500).json({ message: 'Error al obtener un marca', error: error });
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
        const [descripcionRows]: any = await connection.execute('SELECT descripcion FROM marca WHERE descripcion = ?', [descripcion]);

        if (descripcionRows.length > 0) {
            return res.status(400).json({ message: 'La descripción ya está en uso' });
        }

        await connection.execute(
            'INSERT INTO marca (descripcion) VALUES (?)',
            [descripcion]
        );

        res.status(201).json({ message: 'marca registrado con éxito' });
    } catch (error) {
        console.error('Error al registrar marca:', error);
        res.status(500).json({ message: 'Error al registrar marca', error: error });
    }
};

export const updateRegister = async (req: Request, res: Response) => {
    try {
        const { descripcion } = req.body;
        const marca_id = req.params.id; 

        if (!marca_id) {
            return res.status(400).json({ message: 'Falta el ID del marca' });
        }

        const connection = await conexionBD();

        const [marcaRows]: any = await connection.execute('SELECT * FROM marca WHERE marca_id = ?', [marca_id]);

        if (marcaRows.length === 0) {
            return res.status(404).json({ message: 'marca no encontrado' });
        }

        if (descripcion !== marcaRows[0].descripcion) {
            const [existingDescripcionRows]: any = await connection.execute('SELECT descripcion FROM marca WHERE descripcion = ? AND marca_id <> ?', [descripcion, marca_id]);
            if (existingDescripcionRows.length > 0) {
                return res.status(400).json({ message: 'La descripción ya está en uso' });
            }
        }

        await connection.execute(
            'UPDATE marca SET descripcion = ? WHERE marca_id = ?',
            [descripcion, marca_id]
        );

        const [updatedmarcaRows]: any = await connection.execute('SELECT * FROM marca WHERE marca_id = ?', [marca_id]);

        const marcaActualizado: MarcaModel = {
            marca_id: updatedmarcaRows[0].marca_id,
            descripcion: updatedmarcaRows[0].descripcion,
        };

        res.status(200).json({ message: 'marca actualizado con éxito', marca: marcaActualizado });
    } catch (error) {
        console.error('Error al actualizar marca:', error);
        res.status(500).json({ message: 'Error al actualizar marca', error: error });
    }
};

export const deleteRegister = async (req: Request, res: Response) => {
    try {
        const marca_id = req.params.id; 

        if (!marca_id) {
            return res.status(400).json({ message: 'Falta el ID del marca' });
        }

        const connection = await conexionBD();

        const [deleteResult]: any = await connection.execute('DELETE FROM marca WHERE marca_id = ?', [marca_id]);

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: 'marca no encontrado' });
        }

        const marcaEliminado: MarcaModel = {
            marca_id: deleteResult.insertId, 
            descripcion: '', 
        };

        res.status(200).json({ message: 'marca eliminado con éxito', marca: marcaEliminado });
    } catch (error: any) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'No se puede eliminar el marca debido a que esta relacionado a otros registros' });
        }

        console.error('Error al eliminar marca:', error);
        res.status(500).json({ message: 'Error al eliminar marca', error: error });
    }
};
