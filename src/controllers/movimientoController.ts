import { Request, Response } from 'express';
import { conexionBD } from '../database';
import { MovimientoModel } from '../models/movimientoModel';

// METODOS DEL CONTROLADOR
export const getAllRegister = async (req: Request, res: Response) => {
    try {
        // Establece la conexión a la base de datos utilizando la función de conexión
        const connection = await conexionBD();

        // Ejecuta una consulta para obtener todos los registros
        const [rows]: any = await connection.execute('SELECT * FROM movimiento');

        // Convierte los resultados a objetos
        const movimientos: MovimientoModel[] = [];

        for (const row of rows) {
            movimientos.push({
                movimiento_id: row.movimiento_id,
                fecha_hora_apertura: row.fecha_hora_apertura,
                observacion_apertura: row.observacion_apertura,
                caja_id: row.caja_id,
                usuario_id: row.usuario_id,
                moneda_id: row.moneda_id,
                monto_apertura: row.monto_apertura,
                estado: row.estado,
                fecha_hora_cierre: row.fecha_hora_cierre,
                monto_cierre: row.monto_cierre,
                observacion_cierre: row.observacion_cierre
            });
        }

        // Envía la respuesta con los datos de los registros  
        res.status(200).json(movimientos);
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

        // Ejecuta una consulta para obtener un movimiento por ID
        const [rows]: any = await connection.execute('SELECT * FROM movimiento WHERE movimiento_id = ?', [ID]);

        // Verifica si se encontró un movimiento con el ID proporcionado
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Movimiento no encontrado' });
        }

        // Convierte el resultado a un objeto
        const movimiento: MovimientoModel = {
            movimiento_id: rows[0].movimiento_id,
            fecha_hora_apertura: rows[0].fecha_hora_apertura,
            observacion_apertura: rows[0].observacion_apertura,
            caja_id: rows[0].caja_id,
            usuario_id: rows[0].usuario_id,
            moneda_id: rows[0].moneda_id,
            monto_apertura: rows[0].monto_apertura,
            estado: rows[0].estado,
            fecha_hora_cierre: rows[0].fecha_hora_cierre,
            monto_cierre: rows[0].monto_cierre,
            observacion_cierre: rows[0].observacion_cierre,
        };

        // Envía la respuesta con el movimiento encontrado
        res.status(200).json(movimiento);
    } catch (error) {
        console.error('Error al obtener un movimiento:', error);
        res.status(500).json({ message: 'Error al obtener un movimiento', error: error });
    }
};

export const insertRegister = async (req: Request, res: Response) => {
    try {
        const { observacion_apertura, caja_id, usuario_id, moneda_id, monto_apertura } = req.body;
        const missingFields = [];

        // Verifica que todos los campos necesarios estén definidos en el cuerpo de la solicitud
        if (!caja_id) missingFields.push('caja_id');
        if (!usuario_id) missingFields.push('usuario_id');
        if (!moneda_id) missingFields.push('moneda_id');

        // Modificamos la validación para que monto_apertura no sea negativo
        if (monto_apertura === undefined) {
            missingFields.push('monto_apertura');
        } else if (monto_apertura < 0) {
            return res.status(400).json({ message: 'El monto de apertura no puede ser negativo' });
        }

        if (missingFields.length > 0) {
            return res.status(400).json({ message: 'Faltan campos obligatorios', missingFields });
        }

        const connection = await conexionBD();

        // Reemplazamos los valores undefined por null
        const safeObservacionApertura = observacion_apertura || null;
        const safeMontoApertura = monto_apertura !== undefined ? monto_apertura : null;

        // Ejecuta una consulta para insertar un nuevo movimiento
        await connection.execute(
            'INSERT INTO movimiento (observacion_apertura, caja_id, usuario_id, moneda_id, monto_apertura) VALUES (?, ?, ?, ?, ?)',
            [safeObservacionApertura, caja_id, usuario_id, moneda_id, safeMontoApertura]
        );

        res.status(201).json({ message: 'Movimiento registrado con éxito' });
    } catch (error) {
        console.error('Error al registrar movimiento:', error);
        res.status(500).json({ message: 'Error al registrar movimiento', error: error });
    }
};

export const updateRegister = async (req: Request, res: Response) => {
    try {
        const { estado, monto_cierre, observacion_cierre } = req.body;
        const movimiento_id = req.params.id; // Recupera el movimiento_id de los parámetros de la ruta

        // Verifica que el ID del movimiento y al menos un campo obligatorio estén presentes
        if (!movimiento_id) {
            return res.status(400).json({ message: 'Falta el ID del movimiento' });
        }

        const connection = await conexionBD();

        // Verifica si el movimiento con el ID proporcionado existe en la base de datos
        const [movimientoRows]: any = await connection.execute('SELECT * FROM movimiento WHERE movimiento_id = ?', [movimiento_id]);

        if (movimientoRows.length === 0) {
            return res.status(404).json({ message: 'Movimiento no encontrado' });
        }

        // Genera la fecha y hora de cierre automáticamente
        const fecha_hora_cierre = new Date(); // Esto generará la fecha y hora actual

        // Construye la consulta SQL y los parámetros dinámicamente
        const sqlParams: any[] = [];
        let sqlQuery = 'UPDATE movimiento SET';

        if (estado !== undefined) {
            sqlQuery += ' estado = ?,';
            sqlParams.push(estado);
        }

        // Ahora, usamos la fecha_hora_cierre generada automáticamente
        sqlQuery += ' fecha_hora_cierre = ?,';
        sqlParams.push(fecha_hora_cierre);

        if (monto_cierre !== undefined) {
            sqlQuery += ' monto_cierre = ?,';
            sqlParams.push(monto_cierre);
        }

        if (observacion_cierre !== undefined) {
            sqlQuery += ' observacion_cierre = ?,';
            sqlParams.push(observacion_cierre);
        }

        // Elimina la última coma de la consulta SQL
        sqlQuery = sqlQuery.slice(0, -1);

        // Agrega el WHERE para el movimiento_id
        sqlQuery += ' WHERE movimiento_id = ?';
        sqlParams.push(movimiento_id);

        // Ejecuta la consulta SQL de actualización con parámetros dinámicos
        await connection.execute(sqlQuery, sqlParams);

        // Obtén el movimiento actualizado desde la base de datos
        const [updateMovimientoRows]: any = await connection.execute('SELECT * FROM movimiento WHERE movimiento_id = ?', [movimiento_id]);

        // Crea un objeto MovimientoModel con los datos actualizados
        const movimientoActualizado: MovimientoModel = {
            ...updateMovimientoRows[0],
            estado: updateMovimientoRows[0].estado,
            fecha_hora_cierre: updateMovimientoRows[0].fecha_hora_cierre,
            monto_cierre: updateMovimientoRows[0].monto_cierre,
            observacion_cierre: updateMovimientoRows[0].observacion_cierre
        };

        res.status(200).json({ message: 'Movimiento actualizado con éxito', movimiento: movimientoActualizado });
    } catch (error) {
        console.error('Error al actualizar movimiento:', error);
        res.status(500).json({ message: 'Error al actualizar movimiento', error: error });
    }
};

export const deleteRegister = async (req: Request, res: Response) => {
    try {
        const movimiento_id = req.params.id; // Recupera el movimiento_id de los parámetros de la URL

        if (!movimiento_id) {
            return res.status(400).json({ message: 'Falta el ID del movimiento' });
        }

        const connection = await conexionBD();

        // Ejecuta la consulta para eliminar el movimiento
        const [deleteResult]: any = await connection.execute('DELETE FROM movimiento WHERE movimiento_id = ?', [movimiento_id]);

        // Verifica si se eliminó correctamente
        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Caja no encontrado' });
        }

        // Crea un objeto MovimientoModel con los datos del movimiento eliminado
        const movimientoEliminado: MovimientoModel = {
            movimiento_id: deleteResult.insertId,
            fecha_hora_apertura: new Date,
            observacion_apertura: '',
            caja_id: 0,
            usuario_id: 0,
            moneda_id: 0,
            monto_apertura: 0,
            estado: true,
            fecha_hora_cierre: new Date,
            monto_cierre: 0,
            observacion_cierre: ''
        };

        res.status(200).json({ message: 'Movimiento eliminado con éxito', movimiento: movimientoEliminado });
    } catch (error: any) {
        // Verifica si el error se debe a una restricción de llave foránea
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'No se puede eliminar el movimiento debido a que está relacionado a otros registros' });
        }

        console.error('Error al eliminar movimiento:', error);
        res.status(500).json({ message: 'Error al eliminar movimiento', error: error });
    }
};

export const updateEstado = async (req: Request, res: Response) => {
    try {
        const movimiento_id = req.params.id; // Recupera el movimiento_id de los parámetros de la ruta
        const nuevoEstado = req.body.estado; // Recupera el nuevo estado del cuerpo de la solicitud

        // Verifica que el ID del movimiento y el nuevo estado estén presentes
        if (!movimiento_id || nuevoEstado === undefined) {
            return res.status(400).json({ message: 'Falta el ID del movimiento o el nuevo estado' });
        }

        const connection = await conexionBD();

        // Verifica si el movimiento con el ID proporcionado existe en la base de datos
        const [movimientoRows]: any = await connection.execute('SELECT * FROM movimiento WHERE movimiento_id = ?', [movimiento_id]);

        if (movimientoRows.length === 0) {
            return res.status(404).json({ message: 'Movimiento no encontrado' });
        }

        // Actualiza el campo de estado en la base de datos
        await connection.execute('UPDATE movimiento SET estado = ? WHERE movimiento_id = ?', [nuevoEstado, movimiento_id]);

        // Actualiza el estado en el objeto MovimientoModel
        const movimientoActualizado: MovimientoModel = {
            ...movimientoRows[0], // Mantén los demás datos igual que antes
            estado: nuevoEstado, // Actualiza el estado
        };

        res.status(200).json({ message: 'Estado del movimiento actualizado con éxito', movimiento: movimientoActualizado });
    } catch (error) {
        console.error('Error al actualizar estado del movimiento:', error);
        res.status(500).json({ message: 'Error al actualizar estado del movimiento', error: error });
    }
};
