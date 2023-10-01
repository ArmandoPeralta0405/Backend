import { Request, Response } from 'express';
import { conexionBD } from '../database';
import { TipoDocumentoModel } from '../models/tipo_documentoModel'; 

// METODOS DEL CONTROLADOR
export const getAllRegister = async (req: Request, res: Response) => {
    try {
        
        const connection = await conexionBD();

       
        const [rows]: any = await connection.execute('SELECT * FROM tipo_documento');

       
        const tipos_documentos: TipoDocumentoModel[] = [];

        for (const row of rows) {
            tipos_documentos.push({
                tipo_documento_id: row.tipo_documento_id,
                descripcion: row.descripcion,
            });
        }

        res.status(200).json(tipos_documentos);
    } catch (error) {
        console.error('Error al obtener tipos de documentos:', error);
        res.status(500).json({ message: 'Error al obtener tipos de documentos', error: error });
    }
};

export const getOneRegister = async (req: Request, res: Response) => {
    const ID = req.params.id; 

    try {
        
        const connection = await conexionBD();

        
        const [rows]: any = await connection.execute('SELECT * FROM tipo_documento WHERE tipo_documento_id = ?', [ID]);


        if (rows.length === 0) {
            return res.status(404).json({ message: 'tipo_documento no encontrado' });
        }

        const tipo_documento: TipoDocumentoModel = {
            tipo_documento_id: rows[0].tipo_documento_id,
            descripcion: rows[0].descripcion,
        };

        res.status(200).json(tipo_documento);
    } catch (error) {
        console.error('Error al obtener un tipo de documento:', error);
        res.status(500).json({ message: 'Error al obtener un tipo de documento', error: error });
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
        const [descripcionRows]: any = await connection.execute('SELECT descripcion FROM tipo_documento WHERE descripcion = ?', [descripcion]);

        if (descripcionRows.length > 0) {
            return res.status(400).json({ message: 'La descripción ya está en uso' });
        }

        await connection.execute(
            'INSERT INTO tipo_documento (descripcion) VALUES (?)',
            [descripcion]
        );

        res.status(201).json({ message: 'Tipo documento registrado con éxito' });
    } catch (error) {
        console.error('Error al registrar Tipo_documento:', error);
        res.status(500).json({ message: 'Error al registrar Tipo_documento', error: error });
    }
};

export const updateRegister = async (req: Request, res: Response) => {
    try {
        const { descripcion } = req.body;
        const tipo_documento_id = req.params.id; 

        if (!tipo_documento_id) {
            return res.status(400).json({ message: 'Falta el ID del tipo_documento' });
        }

        const connection = await conexionBD();

        const [tipo_documentoRows]: any = await connection.execute('SELECT * FROM tipo_documento WHERE tipo_documento_id = ?', [tipo_documento_id]);

        if (tipo_documentoRows.length === 0) {
            return res.status(404).json({ message: 'Tipo documento no encontrado' });
        }

        if (descripcion !== tipo_documentoRows[0].descripcion) {
            const [existingDescripcionRows]: any = await connection.execute('SELECT descripcion FROM tipo_documento WHERE descripcion = ? AND tipo_documento_id <> ?', [descripcion, tipo_documento_id]);
            if (existingDescripcionRows.length > 0) {
                return res.status(400).json({ message: 'La descripción ya está en uso' });
            }
        }

        await connection.execute(
            'UPDATE tipo_documento SET descripcion = ? WHERE tipo_documento_id = ?',
            [descripcion, tipo_documento_id]
        );

        const [updatedtipo_documentoRows]: any = await connection.execute('SELECT * FROM tipo_documento WHERE tipo_documento_id = ?', [tipo_documento_id]);

        const tipo_documentoActualizado: TipoDocumentoModel = {
            tipo_documento_id: updatedtipo_documentoRows[0].tipo_documento_id,
            descripcion: updatedtipo_documentoRows[0].descripcion,
        };

        res.status(200).json({ message: 'tipo documento actualizado con éxito', tipo_documento: tipo_documentoActualizado });
    } catch (error) {
        console.error('Error al actualizar tipo de documento:', error);
        res.status(500).json({ message: 'Error al actualizar tipo de documento', error: error });
    }
};

export const deleteRegister = async (req: Request, res: Response) => {
    try {
        const tipo_documento_id = req.params.id; 

        if (!tipo_documento_id) {
            return res.status(400).json({ message: 'Falta el ID del tipo_documento' });
        }

        const connection = await conexionBD();

        const [deleteResult]: any = await connection.execute('DELETE FROM tipo_documento WHERE tipo_documento_id = ?', [tipo_documento_id]);

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Tipo documento no encontrado' });
        }

        const tipo_documentoEliminado: TipoDocumentoModel = {
            tipo_documento_id: deleteResult.insertId, 
            descripcion: '', 
        };

        res.status(200).json({ message: 'Tipo de documento eliminado con éxito', tipo_documento: tipo_documentoEliminado });
    } catch (error: any) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'No se puede eliminar el Tipo de documento debido a que esta relacionado a otros registros' });
        }

        console.error('Error al eliminar tipo_documento:', error);
        res.status(500).json({ message: 'Error al eliminar Tipo de documento', error: error });
    }
};
