import { Request, Response } from 'express';
import { conexionBD } from '../database';
import { MonedaModel } from '../models/monedaModel'; // Importa el modelo de unidad_medida

// METODOS DEL CONTROLADOR
export const getAllRegister = async (req: Request, res: Response) => {
    try {
        // Establece la conexión a la base de datos utilizando la función de conexión
        const connection = await conexionBD();

        // Ejecuta una consulta para obtener todos los módulos
        const [rows]: any = await connection.execute('SELECT * FROM moneda');

        // Convierte los resultados a objetos 
        const monedas: MonedaModel[] = [];

        for (const row of rows) {
            monedas.push({
                moneda_id: row.moneda_id,
                descripcion: row.descripcion,
                abreviacion: row.abreviacion,
                decimal: row.decimal
            });
        }

        // Envía la respuesta con los datos
        res.status(200).json(monedas);
    } catch (error) {
        console.error('Error al obtener monedas:', error);
        res.status(500).json({ message: 'Error al obtener monedas', error: error });
    }
};

export const getOneRegister = async (req: Request, res: Response) => {
    const ID = req.params.id; // Obtiene el ID del parámetro de la solicitud

    try {
        // Establece la conexión a la base de datos utilizando la función de conexión
        const connection = await conexionBD();

        // Ejecuta una consulta para obtener por ID
        const [rows]: any = await connection.execute('SELECT * FROM moneda WHERE moneda_id = ?', [ID]);

        // Verifica si se encontró con el ID proporcionado
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Moneda no encontrado' });
        }

        // Convierte el resultado a un objeto
        const moneda: MonedaModel = {
            moneda_id: rows[0].moneda_id,
            descripcion: rows[0].descripcion,
            abreviacion: rows[0].abreviacion,
            decimal: rows[0].decimal
        };

        // Envía la respuesta con lo encontrado
        res.status(200).json(moneda);
    } catch (error) {
        console.error('Error al obtener la moneda:', error);
        res.status(500).json({ message: 'Error al obtener la moneda', error: error });
    }
};

export const insertRegister = async (req: Request, res: Response) => {
    try {
        const { descripcion, abreviacion, decimal } = req.body;
        const missingFields = [];

        // Verifica que todos los campos necesarios estén definidos en el cuerpo de la solicitud
        if (!descripcion) missingFields.push('descripcion');
        if (!abreviacion) missingFields.push('abreviacion');
        if (!decimal) missingFields.push('decimal');

        if (missingFields.length > 0) {
            return res.status(400).json({ message: 'Faltan campos obligatorios', missingFields });
        }

        // Verifica si ya existe registro con la misma abreviación
        const connection = await conexionBD();
        const [abreviacionRows]: any = await connection.execute('SELECT abreviacion FROM moneda WHERE abreviacion = ?', [abreviacion]);

        if (abreviacionRows.length > 0) {
            return res.status(400).json({ message: 'La abreviación ya está en uso' });
        }

        // Ejecuta una consulta para insertar
        await connection.execute(
            'INSERT INTO moneda (descripcion, abreviacion, `decimal`) VALUES (?, ?, ?)',
            [descripcion, abreviacion, decimal]
        );

        res.status(201).json({ message: 'Moneda registrado con éxito' });
    } catch (error) {
        console.error('Error al registrar Moneda:', error);
        res.status(500).json({ message: 'Error al registrar Moneda', error: error });
    }
};

export const updateRegister = async (req: Request, res: Response) => {
    try {
        const { descripcion, abreviacion, decimal } = req.body;
        const moneda_id = req.params.id; // Recupera ID de los parámetros de la ruta

        // Verifica que el ID y al menos un campo obligatorio estén presentes
        if (!moneda_id || (descripcion === undefined && abreviacion === undefined && decimal === undefined)) {
            return res.status(400).json({ message: 'Falta el ID de la moneda o al menos un campo obligatorio' });
        }

        const connection = await conexionBD();

        // Verifica si el módulo con el ID proporcionado existe en la base de datos
        const [monedaRows]: any = await connection.execute('SELECT * FROM moneda WHERE moneda_id = ?', [moneda_id]);

        if (monedaRows.length === 0) {
            return res.status(404).json({ message: 'Moneda no encontrado' });
        }

        // Verifica si la abreviación en la solicitud es igual a la abreviación actual en la base de datos
        if (abreviacion !== undefined && abreviacion !== monedaRows[0].abreviacion) {
            // Si no son iguales, verifica si la nueva abreviación ya existe en la base de datos
            const [existingAbreviacionRows]: any = await connection.execute('SELECT abreviacion FROM moneda WHERE abreviacion = ? AND moneda_id <> ?', [abreviacion, moneda_id]);
            if (existingAbreviacionRows.length > 0) {
                return res.status(400).json({ message: 'La abreviación ya está en uso' });
            }
        }

        // Construye la consulta SQL y los parámetros dinámicamente
        const sqlParams: any[] = [];
        let sqlQuery = 'UPDATE moneda SET';

        if (descripcion !== undefined) {
            sqlQuery += ' descripcion = ?,';
            sqlParams.push(descripcion);
        }

        if (abreviacion !== undefined) {
            sqlQuery += ' abreviacion = ?,';
            sqlParams.push(abreviacion);
        }

        if (decimal !== undefined) {
            sqlQuery += ' `decimal` = ?,';
            sqlParams.push(decimal);
        }

        // Elimina la última coma de la consulta SQL
        sqlQuery = sqlQuery.slice(0, -1);

        // Agrega el WHERE para el moneda_id
        sqlQuery += ' WHERE moneda_id = ?';
        sqlParams.push(moneda_id);

        // Ejecuta la consulta SQL de actualización con parámetros dinámicos
        await connection.execute(sqlQuery, sqlParams);

        // Obtén el módulo actualizado desde la base de datos
        const [updatedmonedaRows]: any = await connection.execute('SELECT * FROM moneda WHERE moneda_id = ?', [moneda_id]);

        // Crea un objeto UnidadMedidaModel con los datos actualizados
        const monedaActualizado: MonedaModel = {
            moneda_id: updatedmonedaRows[0].moneda_id,
            descripcion: updatedmonedaRows[0].descripcion,
            abreviacion: updatedmonedaRows[0].abreviacion,
            decimal: updatedmonedaRows[0].decimal
        };

        res.status(200).json({ message: 'Moneda actualizada con éxito', moneda: monedaActualizado });
    } catch (error) {
        console.error('Error al actualizar moneda:', error);
        res.status(500).json({ message: 'Error al actualizar moneda', error: error });
    }
};


export const deleteRegister = async (req: Request, res: Response) => {
    try {
        const moneda_id = req.params.id; // Recupera el moneda_id de los parámetros de la URL

        if (!moneda_id) {
            return res.status(400).json({ message: 'Falta el ID de la moneda' });
        }

        const connection = await conexionBD();

        // Ejecuta la consulta para eliminar
        const [deleteResult]: any = await connection.execute('DELETE FROM moneda WHERE moneda_id = ?', [moneda_id]);

        // Verifica si se eliminó correctamente
        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Moneda no encontrado' });
        }

        // Crea un objeto MonedaModel
        const monedaEliminado: MonedaModel = {
            moneda_id: deleteResult.insertId, // Puedes usar el insertId como ID del moneda eliminado
            descripcion: '', // Puedes dejar la descripción en blanco o definir un valor apropiado
            abreviacion: '', // Puedes dejar la abreviación en blanco o definir un valor apropiado
            decimal: 0
        };

        res.status(200).json({ message: 'Moneda eliminada con éxito', unidad_medida: monedaEliminado });
    } catch (error: any) {
        // Verifica si el error se debe a una restricción de llave foránea
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'No se puede eliminar la Moneda debido a que está relacionado a otros registros' });
        }

        console.error('Error al eliminar Moneda:', error);
        res.status(500).json({ message: 'Error al eliminar moneda', error: error });
    }
};
