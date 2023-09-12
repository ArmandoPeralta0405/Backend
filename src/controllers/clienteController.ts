import { Request, Response } from 'express';
import { conexionBD } from '../database';
import { ClienteModel } from '../models/clienteModel'; 

// METODOS DEL CONTROLADOR
export const getAllRegister = async (req: Request, res: Response) => {
    try {
        
        const connection = await conexionBD();

       
        const [rows]: any = await connection.execute('SELECT * FROM cliente');

       
        const clientes: ClienteModel[] = [];

        for (const row of rows) {
            clientes.push({
                cliente_id: row.cliente_id,
                nombre: row.nombre,
                apellido: row.apellido,
                cedula: row.cedula,
                telefono: row.telefono,
                direccion: row.direccion,
                estado: row.estado,
            });
        }

        res.status(200).json(clientes);
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ message: 'Error al obtener clientes', error: error });
    }
};

export const getOneRegister = async (req: Request, res: Response) => {
    const ID = req.params.id; 

    try {
        
        const connection = await conexionBD();

        
        const [rows]: any = await connection.execute('SELECT * FROM cliente WHERE cliente_id = ?', [ID]);


        if (rows.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        const cliente: ClienteModel = {
            cliente_id: rows[0].cliente_id,
            nombre: rows[0].nombre,
            apellido: rows[0].apellido,
            cedula: rows[0].cedula,
            telefono: rows[0].telefono,
            direccion: rows[0].direccion,
            estado: rows[0].estado,
        };

        res.status(200).json(cliente);
    } catch (error) {
        console.error('Error al obtener un cliente:', error);
        res.status(500).json({ message: 'Error al obtener un cliente', error: error });
    }
};

export const insertRegister = async (req: Request, res: Response) => {
    try {
        const { nombre, apellido, cedula, telefono, direccion } = req.body;
        const missingFields = [];
        

        if (!nombre) missingFields.push('nombre');
        if (!apellido) missingFields.push('apellido');
        if (!cedula) missingFields.push('cedula');

        if (missingFields.length > 0) {
            return res.status(400).json({ message: 'Faltan campos obligatorios', missingFields });
        }

        const connection = await conexionBD();
        const [cedulaRows]: any = await connection.execute('SELECT cedula FROM cliente WHERE cedula = ?', [cedula]);
        

        if (cedulaRows.length > 0) {
            return res.status(400).json({ message: 'La cedula de identidad ya está en uso' });
        }

        await connection.execute(
            'INSERT INTO cliente (nombre, apellido, cedula, telefono, direccion) VALUES (?, ?, ?, ?, ?)',
            [nombre, apellido, cedula, telefono, direccion]
        );

        res.status(201).json({ message: 'cliente registrado con éxito' });
    } catch (error) {
        console.error('Error al registrar cliente:', error);
        res.status(500).json({ message: 'Error al registrar cliente', error: error });
    }
};

export const updateRegister = async (req: Request, res: Response) => {
    try {
        const { nombre, apellido, cedula, telefono, direccion } = req.body;
        const cliente_id = req.params.id; 

        if (!cliente_id) {
            return res.status(400).json({ message: 'Falta el ID del cliente' });
        }

        const connection = await conexionBD();

        const [clienteRows]: any = await connection.execute('SELECT * FROM cliente WHERE cliente_id = ?', [cliente_id]);

        if (clienteRows.length === 0) {
            return res.status(404).json({ message: 'cliente no encontrado' });
        }

        if (nombre !== clienteRows[0].nombre) {
            const [existingcedulaRows]: any = await connection.execute('SELECT cedula FROM cliente WHERE cedula = ? AND cliente_id <> ?', [cedula, cliente_id]);
            if (existingcedulaRows.length > 0) {
                return res.status(400).json({ message: 'La cedula de identidad ya está en uso' });
            }
        }

        await connection.execute(
            'UPDATE cliente SET nombre = ?, apellido = ?, cedula = ?, telefono = ?, direccion = ? WHERE cliente_id = ?',
            [nombre, apellido, cedula, telefono, direccion, cliente_id]
        );

        const [updatedclienteRows]: any = await connection.execute('SELECT * FROM cliente WHERE cliente_id = ?', [cliente_id]);

        const clienteActualizado: ClienteModel = {
            cliente_id: updatedclienteRows[0].cliente_id,
            nombre: updatedclienteRows[0].nombre,
            apellido: updatedclienteRows[0].apellido,
            cedula: updatedclienteRows[0].cedula,
            telefono: updatedclienteRows[0].telefono,
            direccion: updatedclienteRows[0].direccion,
            estado: updatedclienteRows[0].estado,
        };

        res.status(200).json({ message: 'cliente actualizado con éxito', cliente: clienteActualizado });
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ message: 'Error al actualizar cliente', error: error });
    }
};

export const deleteRegister = async (req: Request, res: Response) => {
    try {
        const cliente_id = req.params.id; 

        if (!cliente_id) {
            return res.status(400).json({ message: 'Falta el ID del cliente' });
        }

        const connection = await conexionBD();

        const [deleteResult]: any = await connection.execute('DELETE FROM cliente WHERE cliente_id = ?', [cliente_id]);

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: 'cliente no encontrado' });
        }

        const clienteEliminado: ClienteModel = {
            cliente_id: deleteResult.insertId, 
            nombre: '', 
            apellido: '',
            cedula: '',
            telefono: '',
            direccion: '',
            estado: true
        };

        res.status(200).json({ message: 'cliente eliminado con éxito', cliente: clienteEliminado });
    } catch (error: any) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'No se puede eliminar el cliente debido a que esta relacionado a otros registros' });
        }

        console.error('Error al eliminar cliente:', error);
        res.status(500).json({ message: 'Error al eliminar cliente', error: error });
    }
};

export const updateEstado = async (req: Request, res: Response) => {
    try {
        const cliente_id = req.params.id; 
        const nuevoEstado = req.body.estado; 

        if (!cliente_id || nuevoEstado === undefined) {
            return res.status(400).json({ message: 'Falta el ID del cliente o el nuevo estado' });
        }

        const connection = await conexionBD();

        const [clienteRows]: any = await connection.execute('SELECT * FROM cliente WHERE cliente_id = ?', [cliente_id]);

        if (clienteRows.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        await connection.execute('UPDATE cliente SET estado = ? WHERE cliente_id = ?', [nuevoEstado, cliente_id]);

        const clienteActualizado: ClienteModel = {
            ...clienteRows[0], 
            estado: nuevoEstado, 
        };

        res.status(200).json({ message: 'Estado del cliente actualizado con éxito', articulo: clienteActualizado });
    } catch (error) {
        console.error('Error al actualizar estado del cliente:', error);
        res.status(500).json({ message: 'Error al actualizar estado del cliente', error: error });
    }
};
