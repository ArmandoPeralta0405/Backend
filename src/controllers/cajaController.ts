import { Request, Response } from 'express';
import { conexionBD } from '../database';
import { CajaModel, CajaModelVista } from '../models/cajaModel';

// METODOS DEL CONTROLADOR
export const getAllRegister = async (req: Request, res: Response) => {
    try {
        // Establece la conexión a la base de datos utilizando la función de conexión
        const connection = await conexionBD();

        // Ejecuta una consulta para obtener todos los registros
        const [rows]: any = await connection.execute('SELECT * FROM caja_view');

        // Convierte los resultados a objetos CajaModel
        const cajas: CajaModelVista[] = [];

        for (const row of rows) {
            cajas.push({
                caja_id: row.caja_id,
                descripcion: row.descripcion,
                moneda_id: row.moneda_id,
                descripcion_moneda: row.descripcion_moneda,
                estado: row.estado
            });
        }

        // Envía la respuesta con los datos de los registros  
        res.status(200).json(cajas);
    } catch (error) {
        console.error('Error al obtener registros:', error);
        res.status(500).json({ message: 'Error al obtener registros', error: error });
    }
};

export const getOneRegister = async (req: Request, res: Response) => {
    const ID = req.params.id; // Obtiene el ID del parámetro de la solicitud

    try {
        // Establece la conexión a la base de datos utilizando la función de conexión
        const connection = await conexionBD();

        // Ejecuta una consulta para obtener un caja por ID
        const [rows]: any = await connection.execute('SELECT * FROM caja WHERE caja_id = ?', [ID]);

        // Verifica si se encontró un caja con el ID proporcionado
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Caja no encontrado' });
        }

        // Convierte el resultado a un objeto CajaModel
        const caja: CajaModel = {
            caja_id: rows[0].caja_id,
            descripcion: rows[0].descripcion,
            moneda_id: rows[0].moneda_id,
            estado: rows[0].estado
        };

        // Envía la respuesta con el caja encontrado
        res.status(200).json(caja);
    } catch (error) {
        console.error('Error al obtener una caja:', error);
        res.status(500).json({ message: 'Error al obtener una caja', error: error });
    }
};

export const insertRegister = async (req: Request, res: Response) => {
    try {
        const { descripcion, moneda_id, estado } = req.body;
        const missingFields = [];

        // Verifica que todos los campos necesarios estén definidos en el cuerpo de la solicitud
        if (!descripcion) missingFields.push('descripcion');
        if (!moneda_id) missingFields.push('moneda_id');
        if (typeof estado !== 'boolean') missingFields.push('estado');

        if (missingFields.length > 0) {
            return res.status(400).json({ message: 'Faltan campos obligatorios', missingFields });
        }

        // Verifica si ya existe un caja con la misma abreviación
        const connection = await conexionBD();
        const [descripcionRows]: any = await connection.execute('SELECT descripcion FROM caja WHERE descripcion = ?', [descripcion]);

        if (descripcionRows.length > 0) {
            return res.status(400).json({ message: 'La descripcion ya está en uso' });
        }

        // Ejecuta una consulta para insertar un nuevo caja
        await connection.execute(
            'INSERT INTO caja (descripcion, moneda_id, estado) VALUES (?, ?, ?)',
            [descripcion, moneda_id, estado]
        );

        res.status(201).json({ message: 'Caja registrado con éxito' });
    } catch (error) {
        console.error('Error al registrar caja:', error);
        res.status(500).json({ message: 'Error al registrar caja', error: error });
    }
};

export const updateRegister = async (req: Request, res: Response) => {
    try {
        const { descripcion, moneda_id, estado } = req.body;
        const caja_id = req.params.id; // Recupera el caja_id de los parámetros de la ruta

        // Verifica que el ID del caja y al menos un campo obligatorio estén presentes
        if (!caja_id || (descripcion === undefined && moneda_id === undefined && estado === undefined)) {
            return res.status(400).json({ message: 'Falta el ID del caja o al menos un campo obligatorio' });
        }

        const connection = await conexionBD();

        // Verifica si el caja con el ID proporcionado existe en la base de datos
        const [cajaRows]: any = await connection.execute('SELECT * FROM caja WHERE caja_id = ?', [caja_id]);

        if (cajaRows.length === 0) {
            return res.status(404).json({ message: 'Caja no encontrado' });
        }

        // Verifica si la descripcion en la solicitud es igual a la abreviación actual en la base de datos
        if (descripcion !== undefined && descripcion !== cajaRows[0].descripcion) {
            // Si no son iguales, verifica si la nueva descripcion ya existe en la base de datos
            const [existingDescripcionRows]: any = await connection.execute('SELECT descripcion FROM caja WHERE descripcion = ? AND caja_id <> ?', [descripcion, caja_id]);
            if (existingDescripcionRows.length > 0) {
                return res.status(400).json({ message: 'La descripcion ya está en uso' });
            }
        }

        // Construye la consulta SQL y los parámetros dinámicamente
        const sqlParams: any[] = [];
        let sqlQuery = 'UPDATE caja SET';

        if (descripcion !== undefined) {
            sqlQuery += ' descripcion = ?,';
            sqlParams.push(descripcion);
        }

        if (moneda_id !== undefined) {
            sqlQuery += ' moneda_id = ?,';
            sqlParams.push(moneda_id);
        }

        if (estado !== undefined) {
            sqlQuery += ' estado = ?,';
            sqlParams.push(estado);
        }

        // Elimina la última coma de la consulta SQL
        sqlQuery = sqlQuery.slice(0, -1);

        // Agrega el WHERE para el caja_id
        sqlQuery += ' WHERE caja_id = ?';
        sqlParams.push(caja_id);

        // Ejecuta la consulta SQL de actualización con parámetros dinámicos
        await connection.execute(sqlQuery, sqlParams);

        // Obtén el caja actualizado desde la base de datos
        const [updatedCajaRows]: any = await connection.execute('SELECT * FROM caja WHERE caja_id = ?', [caja_id]);

        // Crea un objeto CajaModel con los datos actualizados
        const cajaActualizado: CajaModel = {
            caja_id: updatedCajaRows[0].caja_id,
            descripcion: updatedCajaRows[0].descripcion,
            moneda_id: updatedCajaRows[0].moneda_id,
            estado: updatedCajaRows[0].estado
        };

        res.status(200).json({ message: 'Caja actualizado con éxito', caja: cajaActualizado });
    } catch (error) {
        console.error('Error al actualizar caja:', error);
        res.status(500).json({ message: 'Error al actualizar caja', error: error });
    }
};


export const deleteRegister = async (req: Request, res: Response) => {
    try {
        const caja_id = req.params.id; // Recupera el caja_id de los parámetros de la URL

        if (!caja_id) {
            return res.status(400).json({ message: 'Falta el ID del caja' });
        }

        const connection = await conexionBD();

        // Ejecuta la consulta para eliminar el caja
        const [deleteResult]: any = await connection.execute('DELETE FROM caja WHERE caja_id = ?', [caja_id]);

        // Verifica si se eliminó correctamente
        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Caja no encontrado' });
        }

        // Crea un objeto CajaModel con los datos del caja eliminado
        const cajaEliminado: CajaModel = {
            caja_id: deleteResult.insertId, // Puedes usar el insertId como ID del caja eliminado
            descripcion: '', // Puedes dejar la descripción en blanco o definir un valor apropiado
            moneda_id: 0, // Puedes dejar la abreviación en blanco o definir un valor apropiado
            estado: false // Puedes definir el estado como false u otro valor apropiado
        };

        res.status(200).json({ message: 'Caja eliminado con éxito', caja: cajaEliminado });
    } catch (error: any) {
        // Verifica si el error se debe a una restricción de llave foránea
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'No se puede eliminar el caja debido a que está relacionado a otros registros' });
        }

        console.error('Error al eliminar caja:', error);
        res.status(500).json({ message: 'Error al eliminar caja', error: error });
    }
};

export const updateEstado = async (req: Request, res: Response) => {
    try {
        const caja_id = req.params.id; // Recupera el caja_id de los parámetros de la ruta
        const nuevoEstado = req.body.estado; // Recupera el nuevo estado del cuerpo de la solicitud

        // Verifica que el ID del caja y el nuevo estado estén presentes
        if (!caja_id || nuevoEstado === undefined) {
            return res.status(400).json({ message: 'Falta el ID del caja o el nuevo estado' });
        }

        const connection = await conexionBD();

        // Verifica si el caja con el ID proporcionado existe en la base de datos
        const [cajaRows]: any = await connection.execute('SELECT * FROM caja WHERE caja_id = ?', [caja_id]);

        if (cajaRows.length === 0) {
            return res.status(404).json({ message: 'Caja no encontrado' });
        }

        // Actualiza el campo de estado en la base de datos
        await connection.execute('UPDATE caja SET estado = ? WHERE caja_id = ?', [nuevoEstado,  caja_id]);

        // Actualiza el estado en el objeto CajaModel
        const cajaActualizado: CajaModel = {
            ...cajaRows[0], // Mantén los demás datos igual que antes
            estado: nuevoEstado, // Actualiza el estado
        };

        res.status(200).json({ message: 'Estado del caja actualizado con éxito', caja: cajaActualizado });
    } catch (error) {
        console.error('Error al actualizar estado del caja:', error);
        res.status(500).json({ message: 'Error al actualizar estado del caja', error: error });
    }
};
