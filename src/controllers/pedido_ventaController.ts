import { Request, Response } from 'express';
import { conexionBD } from '../database';
import { PedidoVentaModel, PedidoVentaModelVista } from '../models/pedido_ventaModel'; 

// METODOS DEL CONTROLADOR
export const getAllRegister = async (req: Request, res: Response) => {
    try {
        
        const connection = await conexionBD();

       
        const [rows]: any = await connection.execute('SELECT * FROM pedido_venta_view');

       
        const pedidos_ventas: PedidoVentaModelVista[] = [];

        for (const row of rows) {
            pedidos_ventas.push({
                pedido_venta_id: row.pedido_venta_id,
                fecha_hora: row.fecha_hora,
                moneda_id: row.moneda_id,
                descripcion_moneda: row.descripcion_moneda,
                lista_precio_id: row.lista_precio_id,
                descripcion_lista_precio: row.descripcion_lista_precio,
                usuario_id: row.usuario_id,
                descripcion_usuario: row.descripcion_usuario,
                numero_pedido: row.numero_pedido,
                observacion: row.observacion,
                estado: row.estado
            });
        }

        res.status(200).json(pedidos_ventas);
    } catch (error) {
        console.error('Error al obtener los pedidos de ventas:', error);
        res.status(500).json({ message: 'Error al obtener los pedidos de ventas', error: error });
    }
};

export const getOneRegister = async (req: Request, res: Response) => {
    const ID = req.params.id; 

    try {
        
        const connection = await conexionBD();

        
        const [rows]: any = await connection.execute('SELECT * FROM pedido_venta WHERE pedido_venta_id = ?', [ID]);


        if (rows.length === 0) {
            return res.status(404).json({ message: 'Pedido de Venta no encontrado' });
        }

        const pedido_venta: PedidoVentaModel = {
            pedido_venta_id: rows[0].pedido_venta_id,
            fecha_hora: rows[0].fecha_hora,
            moneda_id: rows[0].moneda_id,
            lista_precio_id: rows[0].lista_precio_id,
            numero_pedido: rows[0].numero_pedido,
            observacion: rows[0].observacion,
            usuario_id: rows[0].usuario_id,
            estado: rows[0].estado
        };

        res.status(200).json(pedido_venta);
    } catch (error) {
        console.error('Error al obtener un pedido de venta:', error);
        res.status(500).json({ message: 'Error al obtener un pedido de venta', error: error });
    }
};

export const getOneRegisterView = async (req: Request, res: Response) => {
    const ID = req.params.id; 

    try {
        
        const connection = await conexionBD();

        
        const [rows]: any = await connection.execute('SELECT * FROM pedido_venta_view WHERE pedido_venta_id = ?', [ID]);


        if (rows.length === 0) {
            return res.status(404).json({ message: 'Pedido de venta no encontrado' });
        }

        const pedido_venta: PedidoVentaModelVista = {
            pedido_venta_id: rows[0].pedido_venta_id,
            fecha_hora: rows[0].fecha_hora,
            moneda_id: rows[0].moneda_id,
            descripcion_moneda: rows[0].descripcion_moneda,
            lista_precio_id: rows[0].lista_precio_id,
            descripcion_lista_precio: rows[0].descripcion_lista_precio,
            usuario_id: rows[0].usuario_id,
            descripcion_usuario: rows[0].descripcion_usuario,
            numero_pedido: rows[0].numero_pedido,
            observacion: rows[0].observacion,
            estado: rows[0].estado
        };

        res.status(200).json(pedido_venta);
    } catch (error) {
        console.error('Error al obtener un pedido de venta:', error);
        res.status(500).json({ message: 'Error al obtener un pedido de venta', error: error });
    }
};

export const insertRegister = async (req: Request, res: Response) => {
    try {
        const { moneda_id, lista_precio_id, numero_pedido, observacion, usuario_id, estado, detalles } = req.body;
        const missingFields = [];

        if (!moneda_id) missingFields.push('moneda_id');
        if (!lista_precio_id) missingFields.push('lista_precio_id');
        if (!numero_pedido) missingFields.push('numero_pedido');
        if (!usuario_id) missingFields.push('usuario_id');
        if (!detalles || detalles.length === 0) missingFields.push('detalles');

        if (missingFields.length > 0) {
            return res.status(400).json({ message: 'Faltan campos obligatorios', missingFields });
        }

        const connection = await conexionBD();

        // Iniciar la transacción
        await connection.beginTransaction();

        try {
            // Verificar si el número de pedido ya existe
            const [resultadoRows]: any = await connection.execute('SELECT numero_pedido FROM pedido_venta WHERE numero_pedido = ?', [numero_pedido]);

            if (resultadoRows.length > 0) {
                // Si el número de pedido ya existe, hacer un rollback de la transacción y devolver un error
                await connection.rollback();
                return res.status(400).json({ message: 'El número de pedido ya está en uso' });
            }

            // Insertar el pedido de venta
            const [pedidoVentaResult]: any = await connection.execute(
                'INSERT INTO pedido_venta (moneda_id, lista_precio_id, numero_pedido, observacion, usuario_id) VALUES (?, ?, ?, ?, ?)',
                [moneda_id, lista_precio_id, numero_pedido, observacion, usuario_id]
            );

            const pedidoVentaId = pedidoVentaResult.insertId;

            // Insertar los detalles del pedido de venta con cálculos de montos
            for (const detalle of detalles) {
                // Obtener el impuesto_id del artículo
                const [impuestoRows]: any = await connection.execute('SELECT impuesto_id FROM articulo WHERE articulo_id = ?', [detalle.articulo_id]);
                const impuesto_id = impuestoRows[0].impuesto_id;

                // Obtener el valor y porcentaje del impuesto
                const [impuestoInfo]: any = await connection.execute('SELECT valor, porcentaje FROM impuesto WHERE impuesto_id = ?', [impuesto_id]);
                const { valor, porcentaje } = impuestoInfo[0];

                // Calcular el monto_neto
                let monto_neto = detalle.cantidad * detalle.precio;

                if (valor > 0) {
                    const impuestoCalculado = (detalle.cantidad * detalle.precio) / valor;
                    monto_neto -= impuestoCalculado;
                }

                // Redondear el monto_neto según el campo decimal de la moneda
                const [monedaInfo]: any = await connection.execute('SELECT `decimal` FROM moneda WHERE moneda_id = ?', [moneda_id]);
                const decimal = monedaInfo[0].decimal;
                monto_neto = Number(monto_neto.toFixed(decimal));

                // Calcular el monto_iva
                let monto_iva = detalle.cantidad * detalle.precio - monto_neto;
                monto_iva = Number(monto_iva.toFixed(decimal));

                await connection.execute(
                    'INSERT INTO pedido_venta_detalle (pedido_venta_id, item_numero, articulo_id, cantidad, precio, monto_neto, monto_iva, porcentaje_iva) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [pedidoVentaId, detalle.item_numero, detalle.articulo_id, detalle.cantidad, detalle.precio, monto_neto, monto_iva, porcentaje]
                );
            }

            // Hacer commit de la transacción
            await connection.commit();

            res.status(201).json({ message: 'Pedido de venta registrado con éxito' });
        } catch (error) {
            // En caso de error, hacer rollback de la transacción y devolver un error
            await connection.rollback();
            console.error('Error al registrar pedido de venta:', error);
            res.status(500).json({ message: 'Error al registrar pedido de venta', error: error });
        }
    } catch (error) {
        console.error('Error al registrar pedido de venta:', error);
        res.status(500).json({ message: 'Error al registrar pedido de venta', error: error });
    }
};

export const deleteRegister = async (req: Request, res: Response) => {
    try {
        const pedido_venta_id = req.params.id; 

        if (!pedido_venta_id) {
            return res.status(400).json({ message: 'Falta el ID del pedido de venta' });
        }

        const connection = await conexionBD();

        const [deleteResult]: any = await connection.execute('DELETE FROM pedido_venta WHERE pedido_venta_id = ?', [pedido_venta_id]);

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Pedido de venta no encontrado' });
        }

        const pedidoVentaEliminado: PedidoVentaModel = {
            ...deleteResult[0],
            pedido_venta_id: deleteResult.insertId,
        };

        res.status(200).json({ message: 'Pedido de venta eliminado con éxito', articulo: pedidoVentaEliminado });
    } catch (error: any) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'No se puede eliminar el pedido de venta debido a que esta relacionado a otros registros' });
        }

        console.error('Error al eliminar pedido de venta:', error);
        res.status(500).json({ message: 'Error al eliminar pedido de venta', error: error });
    }
};

export const updateEstado = async (req: Request, res: Response) => {
    try {
        const pedido_venta_id = req.params.id; 
        const nuevoEstado = req.body.estado; 

        if (!pedido_venta_id || nuevoEstado === undefined) {
            return res.status(400).json({ message: 'Falta el ID del pedido de venta o el nuevo estado' });
        }

        const connection = await conexionBD();

        const [pedidoVentaRows]: any = await connection.execute('SELECT * FROM pedido_venta WHERE pedido_venta_id = ?', [pedido_venta_id]);

        if (pedidoVentaRows.length === 0) {
            return res.status(404).json({ message: 'Pedido de venta no encontrado' });
        }

        await connection.execute('UPDATE pedido_venta SET estado = ? WHERE pedido_venta_id = ?', [nuevoEstado, pedido_venta_id]);

        const pedidoVentaActualizado: PedidoVentaModel = {
            ...pedidoVentaRows[0], 
            estado: nuevoEstado, 
        };

        res.status(200).json({ message: 'Estado del pedido de venta actualizado con éxito', articulo: pedidoVentaActualizado });
    } catch (error) {
        console.error('Error al actualizar estado del pedido de venta:', error);
        res.status(500).json({ message: 'Error al actualizar estado del pedido de venta', error: error });
    }
};

export const NumeroPedidoDisponible = async (req: Request, res: Response) => {

    try {
        const connection = await conexionBD();
        
        // Llamar al procedimiento almacenado P_Obtener_numero_pedido
        const [result]: any = await connection.query('CALL P_Obtener_numero_pedido()');
        
        // Obtener el resultado del procedimiento almacenado
        const numeroPedidoDisponible = result[0][0].NumeroPedido;

        res.status(200).json(numeroPedidoDisponible);
    } catch (error) {
        console.error('Error al obtener el número de pedido disponible:', error);
        res.status(500).json({ message: 'Error al obtener el número de pedido disponible', error: error });
    }
};
