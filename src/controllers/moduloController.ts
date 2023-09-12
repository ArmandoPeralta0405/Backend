import { Request, Response } from 'express';
import { conexionBD } from '../database';
import { ModuloModel } from '../models/moduloModel'; // Importa el modelo de Modulo

// METODOS DEL CONTROLADOR
export const getAllRegister = async (req: Request, res: Response) => {
    try {
        // Establece la conexión a la base de datos utilizando la función de conexión
        const connection = await conexionBD();

        // Ejecuta una consulta para obtener todos los módulos
        const [rows]: any = await connection.execute('SELECT * FROM modulo');

        // Convierte los resultados a objetos ModuloModel
        const modulos: ModuloModel[] = [];

        for (const row of rows) {
            modulos.push({
                modulo_id: row.modulo_id,
                descripcion: row.descripcion,
                abreviacion: row.abreviacion,
                estado: row.estado
            });
        }

        // Envía la respuesta con los datos de los módulos  
        res.status(200).json(modulos);
    } catch (error) {
        console.error('Error al obtener módulos:', error);
        res.status(500).json({ message: 'Error al obtener módulos', error: error });
    }
};

export const getOneRegister = async (req: Request, res: Response) => {
    const ID = req.params.id; // Obtiene el ID del parámetro de la solicitud

    try {
        // Establece la conexión a la base de datos utilizando la función de conexión
        const connection = await conexionBD();

        // Ejecuta una consulta para obtener un módulo por ID
        const [rows]: any = await connection.execute('SELECT * FROM modulo WHERE modulo_id = ?', [ID]);

        // Verifica si se encontró un módulo con el ID proporcionado
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Módulo no encontrado' });
        }

        // Convierte el resultado a un objeto ModuloModel
        const modulo: ModuloModel = {
            modulo_id: rows[0].modulo_id,
            descripcion: rows[0].descripcion,
            abreviacion: rows[0].abreviacion,
            estado: rows[0].estado
        };

        // Envía la respuesta con el módulo encontrado
        res.status(200).json(modulo);
    } catch (error) {
        console.error('Error al obtener un módulo:', error);
        res.status(500).json({ message: 'Error al obtener un módulo', error: error });
    }
};

export const insertRegister = async (req: Request, res: Response) => {
    try {
        const { descripcion, abreviacion, estado } = req.body;
        const missingFields = [];

        // Verifica que todos los campos necesarios estén definidos en el cuerpo de la solicitud
        if (!descripcion) missingFields.push('descripcion');
        if (!abreviacion) missingFields.push('abreviacion');
        if (typeof estado !== 'boolean') missingFields.push('estado');

        if (missingFields.length > 0) {
            return res.status(400).json({ message: 'Faltan campos obligatorios', missingFields });
        }

        // Verifica si ya existe un módulo con la misma abreviación
        const connection = await conexionBD();
        const [abreviacionRows]: any = await connection.execute('SELECT abreviacion FROM modulo WHERE abreviacion = ?', [abreviacion]);

        if (abreviacionRows.length > 0) {
            return res.status(400).json({ message: 'La abreviación ya está en uso' });
        }

        // Ejecuta una consulta para insertar un nuevo módulo
        await connection.execute(
            'INSERT INTO modulo (descripcion, abreviacion, estado) VALUES (?, ?, ?)',
            [descripcion, abreviacion, estado]
        );

        res.status(201).json({ message: 'Módulo registrado con éxito' });
    } catch (error) {
        console.error('Error al registrar módulo:', error);
        res.status(500).json({ message: 'Error al registrar módulo', error: error });
    }
};

export const updateRegister = async (req: Request, res: Response) => {
    try {
        const { descripcion, abreviacion, estado } = req.body;
        const modulo_id = req.params.id; // Recupera el modulo_id de los parámetros de la ruta

        // Verifica que el ID del módulo y al menos un campo obligatorio estén presentes
        if (!modulo_id || (descripcion === undefined && abreviacion === undefined && estado === undefined)) {
            return res.status(400).json({ message: 'Falta el ID del módulo o al menos un campo obligatorio' });
        }

        const connection = await conexionBD();

        // Verifica si el módulo con el ID proporcionado existe en la base de datos
        const [moduloRows]: any = await connection.execute('SELECT * FROM modulo WHERE modulo_id = ?', [modulo_id]);

        if (moduloRows.length === 0) {
            return res.status(404).json({ message: 'Módulo no encontrado' });
        }

        // Verifica si la abreviación en la solicitud es igual a la abreviación actual en la base de datos
        if (abreviacion !== undefined && abreviacion !== moduloRows[0].abreviacion) {
            // Si no son iguales, verifica si la nueva abreviación ya existe en la base de datos
            const [existingAbreviacionRows]: any = await connection.execute('SELECT abreviacion FROM modulo WHERE abreviacion = ? AND modulo_id <> ?', [abreviacion, modulo_id]);
            if (existingAbreviacionRows.length > 0) {
                return res.status(400).json({ message: 'La abreviación ya está en uso' });
            }
        }

        // Construye la consulta SQL y los parámetros dinámicamente
        const sqlParams: any[] = [];
        let sqlQuery = 'UPDATE modulo SET';

        if (descripcion !== undefined) {
            sqlQuery += ' descripcion = ?,';
            sqlParams.push(descripcion);
        }

        if (abreviacion !== undefined) {
            sqlQuery += ' abreviacion = ?,';
            sqlParams.push(abreviacion);
        }

        if (estado !== undefined) {
            sqlQuery += ' estado = ?,';
            sqlParams.push(estado);
        }

        // Elimina la última coma de la consulta SQL
        sqlQuery = sqlQuery.slice(0, -1);

        // Agrega el WHERE para el modulo_id
        sqlQuery += ' WHERE modulo_id = ?';
        sqlParams.push(modulo_id);

        // Ejecuta la consulta SQL de actualización con parámetros dinámicos
        await connection.execute(sqlQuery, sqlParams);

        // Obtén el módulo actualizado desde la base de datos
        const [updatedModuloRows]: any = await connection.execute('SELECT * FROM modulo WHERE modulo_id = ?', [modulo_id]);

        // Crea un objeto ModuloModel con los datos actualizados
        const moduloActualizado: ModuloModel = {
            modulo_id: updatedModuloRows[0].modulo_id,
            descripcion: updatedModuloRows[0].descripcion,
            abreviacion: updatedModuloRows[0].abreviacion,
            estado: updatedModuloRows[0].estado
        };

        res.status(200).json({ message: 'Módulo actualizado con éxito', modulo: moduloActualizado });
    } catch (error) {
        console.error('Error al actualizar módulo:', error);
        res.status(500).json({ message: 'Error al actualizar módulo', error: error });
    }
};


export const deleteRegister = async (req: Request, res: Response) => {
    try {
        const modulo_id = req.params.id; // Recupera el modulo_id de los parámetros de la URL

        if (!modulo_id) {
            return res.status(400).json({ message: 'Falta el ID del módulo' });
        }

        const connection = await conexionBD();

        // Ejecuta la consulta para eliminar el módulo
        const [deleteResult]: any = await connection.execute('DELETE FROM modulo WHERE modulo_id = ?', [modulo_id]);

        // Verifica si se eliminó correctamente
        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Módulo no encontrado' });
        }

        // Crea un objeto ModuloModel con los datos del módulo eliminado
        const moduloEliminado: ModuloModel = {
            modulo_id: deleteResult.insertId, // Puedes usar el insertId como ID del módulo eliminado
            descripcion: '', // Puedes dejar la descripción en blanco o definir un valor apropiado
            abreviacion: '', // Puedes dejar la abreviación en blanco o definir un valor apropiado
            estado: false // Puedes definir el estado como false u otro valor apropiado
        };

        res.status(200).json({ message: 'Módulo eliminado con éxito', modulo: moduloEliminado });
    } catch (error: any) {
        // Verifica si el error se debe a una restricción de llave foránea
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'No se puede eliminar el módulo debido a que está relacionado a otros registros' });
        }

        console.error('Error al eliminar módulo:', error);
        res.status(500).json({ message: 'Error al eliminar módulo', error: error });
    }
};

export const updateEstado = async (req: Request, res: Response) => {
    try {
        const modulo_id = req.params.id; // Recupera el modulo_id de los parámetros de la ruta
        const nuevoEstado = req.body.estado; // Recupera el nuevo estado del cuerpo de la solicitud

        // Verifica que el ID del modulo y el nuevo estado estén presentes
        if (!modulo_id || nuevoEstado === undefined) {
            return res.status(400).json({ message: 'Falta el ID del modulo o el nuevo estado' });
        }

        const connection = await conexionBD();

        // Verifica si el modulo con el ID proporcionado existe en la base de datos
        const [moduloRows]: any = await connection.execute('SELECT * FROM modulo WHERE modulo_id = ?', [modulo_id]);

        if (moduloRows.length === 0) {
            return res.status(404).json({ message: 'Modulo no encontrado' });
        }

        // Actualiza el campo de estado en la base de datos
        await connection.execute('UPDATE modulo SET estado = ? WHERE modulo_id = ?', [nuevoEstado,  modulo_id]);

        // Actualiza el estado en el objeto ModuloModel
        const moduloActualizado: ModuloModel = {
            ...moduloRows[0], // Mantén los demás datos igual que antes
            estado: nuevoEstado, // Actualiza el estado
        };

        res.status(200).json({ message: 'Estado del modulo actualizado con éxito', modulo: moduloActualizado });
    } catch (error) {
        console.error('Error al actualizar estado del modulo:', error);
        res.status(500).json({ message: 'Error al actualizar estado del modulo', error: error });
    }
};
