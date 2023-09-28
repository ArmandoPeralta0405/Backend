// src/models/cajaModel.ts
export interface CajaModel {
    caja_id: number;
    descripcion: string;
    moneda_id: number;
    estado: boolean;
}

export interface CajaModelVista {
    caja_id: number;
    descripcion: string;
    moneda_id: number;
    descripcion_moneda: string;
    estado: boolean;
}

