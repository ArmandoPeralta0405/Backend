// src/models/articuloModel.ts
export interface ArticuloModel {
    articulo_id: number;
    descripcion: string;
    codigo_alfanumerico: string;
    marca_id: number;
    impuesto_id: number;
    unidad_medida_id: number;
    estado: boolean;
}

export interface ArticuloModelVista {
    articulo_id: number;
    descripcion: string;
    codigo_alfanumerico: string;
    marca_id: number;
    marca_descripcion: string;
    impuesto_id: number;
    impuesto_descripcion: string;
    unidad_medida_id: number;
    unidad_medida_descripcion: string;
    estado: boolean;
}


