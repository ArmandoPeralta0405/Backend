import { Request, Response } from 'express';
import { conexionBD } from '../database';
import { TimbradoModel, TimbradoModelVista } from '../models/timbradoModel';

// METODOS DEL CONTROLADOR
export const getAllRegister = async (req: Request, res: Response) => {
    try {
        // Establece la conexión a la base de datos utilizando la función de conexión
        const connection = await conexionBD();

        // Ejecuta una consulta para obtener todos los registros
        const [rows]: any = await connection.execute('SELECT * FROM timbrado_view');

        // Convierte los resultados a objetos TimbradoModel
        const timbrados: TimbradoModelVista[] = [];

        for (const row of rows) {
            timbrados.push({
                timbrado_id: row.timbrado_id,
                numero: row.numero,
                establecimiento: row.establecimiento,
                punto_emision: row.punto_emision,
                numero_inicial: row.numero_inicial,
                numero_final: row.numero_final,
                fecha_inicial: row.fecha_inicial,
                fecha_final: row.fecha_final,
                estado: row.estado,
                tipo_documento_id: row.tipo_documento_id,
                descripcion_tipo_documento: row.descripcion_tipo_documento
            });
        }

        // Envía la respuesta con los datos de los registros  
        res.status(200).json(timbrados);
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

        // Ejecuta una consulta para obtener un timbrado por ID
        const [rows]: any = await connection.execute('SELECT * FROM timbrado WHERE timbrado_id = ?', [ID]);

        // Verifica si se encontró un timbrado con el ID proporcionado
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Timbrado no encontrado' });
        }

        // Convierte el resultado a un objeto TimbradoModel
        const timbrado: TimbradoModel = {
            timbrado_id: rows[0].timbrado_id,
            numero: rows[0].numero,
            establecimiento: rows[0].establecimiento,
            punto_emision: rows[0].punto_emision,
            numero_inicial: rows[0].numero_inicial,
            numero_final: rows[0].numero_final,
            fecha_inicial: rows[0].fecha_inicial,
            fecha_final: rows[0].fecha_final,
            estado: rows[0].estado,
            tipo_documento_id: rows[0].tipo_documento_id
        };

        // Envía la respuesta con el timbrado encontrado
        res.status(200).json(timbrado);
    } catch (error) {
        console.error('Error al obtener una timbrado:', error);
        res.status(500).json({ message: 'Error al obtener una timbrado', error: error });
    }
};

export const insertRegister = async (req: Request, res: Response) => {
    try {
        const { numero, establecimiento, punto_emision, numero_inicial, numero_final, fecha_inicial, fecha_final, estado, tipo_documento_id } = req.body;
        const missingFields = [];

        // Verifica que todos los campos necesarios estén definidos en el cuerpo de la solicitud
        if (!numero) missingFields.push('numero');
        if (!establecimiento) missingFields.push('establecimiento');
        if (!punto_emision) missingFields.push('punto_emision');
        if (!numero_inicial) missingFields.push('numero_inicial');
        if (!numero_final) missingFields.push('numero_final');
        if (!fecha_inicial) missingFields.push('fecha_inicial');
        if (!fecha_final) missingFields.push('fecha_final');

        if (typeof estado !== 'boolean') missingFields.push('estado');

        if (!tipo_documento_id) missingFields.push('tipo_documento_id');

        if (missingFields.length > 0) {
            return res.status(400).json({ message: 'Faltan campos obligatorios', missingFields });
        }

        const connection = await conexionBD();

        // Ejecuta una consulta para insertar un nuevo timbrado
        await connection.execute(
            'INSERT INTO timbrado (numero, establecimiento, punto_emision, numero_inicial, numero_final, fecha_inicial, fecha_final, estado, tipo_documento_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [numero, establecimiento, punto_emision, numero_inicial, numero_final, fecha_inicial, fecha_final, estado, tipo_documento_id]
        );

        res.status(201).json({ message: 'Timbrado registrado con éxito' });
    } catch (error) {
        console.error('Error al registrar timbrado:', error);
        res.status(500).json({ message: 'Error al registrar timbrado', error: error });
    }
};

export const updateRegister = async (req: Request, res: Response) => {
    try {
        const { numero, establecimiento, punto_emision, numero_inicial, numero_final, fecha_inicial, fecha_final, estado, tipo_documento_id} = req.body;
        const timbrado_id = req.params.id; // Recupera el timbrado_id de los parámetros de la ruta

        // Verifica que el ID del timbrado y al menos un campo obligatorio estén presentes
        if (!timbrado_id) {
            return res.status(400).json({ message: 'Falta el ID del timbrado' });
        }

        const connection = await conexionBD();

        // Verifica si el timbrado con el ID proporcionado existe en la base de datos
        const [timbradoRows]: any = await connection.execute('SELECT * FROM timbrado WHERE timbrado_id = ?', [timbrado_id]);

        if (timbradoRows.length === 0) {
            return res.status(404).json({ message: 'Timbrado no encontrado' });
        }

        // Construye la consulta SQL y los parámetros dinámicamente
        const sqlParams: any[] = [];
        let sqlQuery = 'UPDATE timbrado SET';

        if (numero !== undefined) {
            sqlQuery += ' numero = ?,';
            sqlParams.push(numero);
        }

        if (establecimiento !== undefined) {
            sqlQuery += ' establecimiento = ?,';
            sqlParams.push(establecimiento);
        }

        if (punto_emision !== undefined) {
            sqlQuery += ' punto_emision = ?,';
            sqlParams.push(punto_emision);
        }

        if (numero_inicial !== undefined) {
            sqlQuery += ' numero_inicial = ?,';
            sqlParams.push(numero_inicial);
        }

        if (numero_final !== undefined) {
            sqlQuery += ' numero_final = ?,';
            sqlParams.push(numero_final);
        }

        if (fecha_inicial !== undefined) {
            sqlQuery += ' fecha_inicial = ?,';
            sqlParams.push(fecha_inicial);
        }

        if (fecha_final !== undefined) {
            sqlQuery += ' fecha_final = ?,';
            sqlParams.push(fecha_final);
        }

        if (estado !== undefined) {
            sqlQuery += ' estado = ?,';
            sqlParams.push(estado);
        }

        if (tipo_documento_id !== undefined) {
            sqlQuery += ' tipo_documento_id = ?,';
            sqlParams.push(tipo_documento_id);
        }

        // Elimina la última coma de la consulta SQL
        sqlQuery = sqlQuery.slice(0, -1);

        // Agrega el WHERE para el timbrado_id
        sqlQuery += ' WHERE timbrado_id = ?';
        sqlParams.push(timbrado_id);

        // Ejecuta la consulta SQL de actualización con parámetros dinámicos
        await connection.execute(sqlQuery, sqlParams);

        // Obtén el timbrado actualizado desde la base de datos
        const [updatedTimbradoRows]: any = await connection.execute('SELECT * FROM timbrado WHERE timbrado_id = ?', [timbrado_id]);

        // Crea un objeto TimbradoModel con los datos actualizados
        const timbradoActualizado: TimbradoModel = {
            timbrado_id: updatedTimbradoRows[0].timbrado_id,
            numero: updatedTimbradoRows[0].numero,
            establecimiento: updatedTimbradoRows[0].establecimiento,
            punto_emision: updatedTimbradoRows[0].punto_emision,
            numero_inicial: updatedTimbradoRows[0].numero_inicial,
            numero_final: updatedTimbradoRows[0].numero_final,
            fecha_inicial: updatedTimbradoRows[0].fecha_inicial,
            fecha_final: updatedTimbradoRows[0].fecha_final,
            estado: updatedTimbradoRows[0].estado,
            tipo_documento_id: updatedTimbradoRows.tipo_documento_id
        };

        res.status(200).json({ message: 'Timbrado actualizado con éxito', timbrado: timbradoActualizado });
    } catch (error) {
        console.error('Error al actualizar timbrado:', error);
        res.status(500).json({ message: 'Error al actualizar timbrado', error: error });
    }
};


export const deleteRegister = async (req: Request, res: Response) => {
    try {
        const timbrado_id = req.params.id; // Recupera el timbrado_id de los parámetros de la URL

        if (!timbrado_id) {
            return res.status(400).json({ message: 'Falta el ID del timbrado' });
        }

        const connection = await conexionBD();

        // Ejecuta la consulta para eliminar el timbrado
        const [deleteResult]: any = await connection.execute('DELETE FROM timbrado WHERE timbrado_id = ?', [timbrado_id]);

        // Verifica si se eliminó correctamente
        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Timbrado no encontrado' });
        }

        // Crea un objeto TimbradoModel con los datos del timbrado eliminado
        const timbradoEliminado: TimbradoModel = {
            timbrado_id: deleteResult.insertId, 
            numero: 0, 
            establecimiento: 0, 
            punto_emision: 0, 
            numero_inicial: 0,
            numero_final: 0,
            estado: false,
            tipo_documento_id: 0 
        };

        res.status(200).json({ message: 'Timbrado eliminado con éxito', timbrado: timbradoEliminado });
    } catch (error: any) {
        // Verifica si el error se debe a una restricción de llave foránea
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'No se puede eliminar el timbrado debido a que está relacionado a otros registros' });
        }

        console.error('Error al eliminar timbrado:', error);
        res.status(500).json({ message: 'Error al eliminar timbrado', error: error });
    }
};

export const updateEstado = async (req: Request, res: Response) => {
    try {
        const timbrado_id = req.params.id; // Recupera el timbrado_id de los parámetros de la ruta
        const nuevoEstado = req.body.estado; // Recupera el nuevo estado del cuerpo de la solicitud

        // Verifica que el ID del timbrado y el nuevo estado estén presentes
        if (!timbrado_id || nuevoEstado === undefined) {
            return res.status(400).json({ message: 'Falta el ID del timbrado o el nuevo estado' });
        }

        const connection = await conexionBD();

        // Verifica si el timbrado con el ID proporcionado existe en la base de datos
        const [timbradoRows]: any = await connection.execute('SELECT * FROM timbrado WHERE timbrado_id = ?', [timbrado_id]);

        if (timbradoRows.length === 0) {
            return res.status(404).json({ message: 'Caja no encontrado' });
        }

        // Actualiza el campo de estado en la base de datos
        await connection.execute('UPDATE timbrado SET estado = ? WHERE timbrado_id = ?', [nuevoEstado,  timbrado_id]);

        // Actualiza el estado en el objeto TimbradoModel
        const timbradoActualizado: TimbradoModel = {
            ...timbradoRows[0], // Mantén los demás datos igual que antes
            estado: nuevoEstado, // Actualiza el estado
        };

        res.status(200).json({ message: 'Estado del timbrado actualizado con éxito', timbrado: timbradoActualizado });
    } catch (error) {
        console.error('Error al actualizar estado del timbrado:', error);
        res.status(500).json({ message: 'Error al actualizar estado del timbrado', error: error });
    }
};
