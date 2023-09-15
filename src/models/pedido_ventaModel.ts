// src/models/pedido_ventaModel.ts
export interface PedidoVentaModel {
    pedido_venta_id: number;
    fecha_hora: Date;
    moneda_id: number;
    lista_precio_id: number;
    numero_pedido: number;
    observacion: string;
    usuario_id: number;
    estado: number;
}

export interface PedidoVentaModelVista {
    pedido_venta_id: number;
    fecha_hora: Date;
    moneda_id: number;
    descripcion_moneda: string;
    lista_precio_id: number;
    descripcion_lista_precio: string;
    numero_pedido: string;
    observacion: string;
    usuario_id: number;
    descripcion_usuario: string;
    estado: string;
}


