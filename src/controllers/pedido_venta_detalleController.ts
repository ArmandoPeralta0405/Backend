import { Request, Response } from 'express';
import { conexionBD } from '../database';
import { PedidoVentaDetalleModel, PedidoVentaDetalleModelVista } from '../models/pedido_venta_detalleModel';

// METODOS DEL CONTROLADOR
export const getAllRegister = async (req: Request, res: Response) => {
    try {

        const connection = await conexionBD();


        const [rows]: any = await connection.execute('SELECT * FROM pedido_venta_detalle_view');


        const pedidos_ventas: PedidoVentaDetalleModelVista[] = [];

        for (const row of rows) {
            pedidos_ventas.push({
                pedido_venta_id: row.pedido_venta_id,
                item_numero: row.item_numero,
                articulo_id: row.articulo_id,
                descripcion_articulo: row.descripcion_articulo,
                cantidad: row.cantidad,
                precio: row.precio,
                monto_neto: row.monto_neto,
                monto_iva: row.monto_iva,
                monto_sub_total: row.monto_sub_total,
                porcentaje_iva: row.porcentaje_iva,
                numero_pedido: row.numero_pedido,
                referencia: row.referencia
            });
        }

        res.status(200).json(pedidos_ventas);
    } catch (error) {
        console.error('Error al obtener los detalles de pedidos de ventas:', error);
        res.status(500).json({ message: 'Error al obtener los detalles de pedidos de ventas', error: error });
    }
};

export const getOneRegister = async (req: Request, res: Response) => {
    const ID = req.params.id;

    try {

        const connection = await conexionBD();


        const [rows]: any = await connection.execute('SELECT * FROM pedido_venta_detalle WHERE pedido_venta_id = ?', [ID]);


        if (rows.length === 0) {
            return res.status(404).json({ message: 'Detalle de Pedido de Venta no encontrado' });
        }

        const detalles_pedidos_ventas: PedidoVentaDetalleModel[] = [];

        for (const row of rows) {
            detalles_pedidos_ventas.push({
                pedido_venta_id: row.pedido_venta_id,
                item_numero: row.item_numero,
                articulo_id: row.articulo_id,
                cantidad: row.cantidad,
                precio: row.precio,
                monto_neto: row.monto_neto,
                monto_iva: row.monto_iva,
                porcentaje_iva: row.porcentaje_iva,
                referencia: row.referencia
            });
        }

        res.status(200).json(detalles_pedidos_ventas);
    } catch (error) {
        console.error('Error al obtener el detalle de pedido de venta:', error);
        res.status(500).json({ message: 'Error al obtener el detalle de pedido de venta', error: error });
    }
};

export const getOneRegisterView = async (req: Request, res: Response) => {
    const ID = req.params.id;

    try {

        const connection = await conexionBD();


        const [rows]: any = await connection.execute('SELECT * FROM pedido_venta_detalle_view WHERE pedido_venta_id = ?', [ID]);


        if (rows.length === 0) {
            return res.status(404).json({ message: 'Detalle de Pedido de venta no encontrado' });
        }

        const detalles_pedidos_ventas: PedidoVentaDetalleModelVista[] = [];

        for (const row of rows) {
            detalles_pedidos_ventas.push({
                pedido_venta_id: row.pedido_venta_id,
                item_numero: row.item_numero,
                articulo_id: row.articulo_id,
                descripcion_articulo: row.descripcion_articulo,
                cantidad: row.cantidad,
                precio: row.precio,
                monto_neto: row.monto_neto,
                monto_iva: row.monto_iva,
                monto_sub_total: row.monto_sub_total,
                porcentaje_iva: row.porcentaje_iva,
                numero_pedido: row.numero_pedido,
                referencia: row.referencia
            });
        }

        res.status(200).json(detalles_pedidos_ventas);
    } catch (error) {
        console.error('Error al obtener los detalles del pedido de venta:', error);
        res.status(500).json({ message: 'Error al obtener los detalles del pedido de venta', error: error });
    }
};

