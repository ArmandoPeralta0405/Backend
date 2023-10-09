// src/models/timbradoModel.ts
export interface TimbradoModel {
    timbrado_id: number;
    numero: number;
    establecimiento: number;
    punto_emision: number;
    numero_inicial: number;
    numero_final: number;
    fecha_inicial?: Date;
    fecha_final?: Date;
    estado: boolean;
    tipo_documento_id: number;
}

export interface TimbradoModelVista {
    timbrado_id: number;
    numero: string;
    establecimiento: string;
    punto_emision: string;
    numero_inicial: string;
    numero_final: string;
    fecha_inicial?: Date;
    fecha_final?: Date;
    estado: boolean;
    tipo_documento_id: number;
    descripcion_tipo_documento: string;
}
