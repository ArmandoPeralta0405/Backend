// src/models/lista_precioModel.ts
export interface ListaPrecioModel {
    lista_precio_id: number;
    descripcion: string;
    moneda_id: number;
}

export interface ListaPrecioModelVista {
    lista_precio_id: number;
    descripcion: string;
    moneda_id: number;
    moneda_descripcion: string;
}


