// src/models/articulo_lista_precioModel.ts
export interface ArticuloListaPrecioModel {
    articulo_id: number;
    lista_precio_id: number;
    precio: number;
}

export interface ArticuloListaPrecioModelVista {
    articulo_id: number;
    descripcion_articulo: string;
    lista_precio_id: number;
    descripcion_lista_precio: string;
    moneda_id: number;
    descripcion_moneda: string;
    precio:number;
}