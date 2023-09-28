// src/models/pedido_venta_detalleModel.ts
export interface PedidoVentaDetalleModel {
    pedido_venta_id: number;
    item_numero: number;
    articulo_id: number;
    cantidad: number;
    precio: number;
    monto_neto: number;
    monto_iva: number;
    porcentaje_iva: number;
    referencia: string;
}

export interface PedidoVentaDetalleModelVista {
    pedido_venta_id: number;
    item_numero: number;
    articulo_id: number;
    descripcion_articulo: string;
    cantidad: number;
    precio: number;
    monto_neto: number;
    monto_iva: number;
    monto_sub_total: number;
    porcentaje_iva: number;
    numero_pedido: string;
    referencia: string;
}

