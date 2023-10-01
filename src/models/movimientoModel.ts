// src/models/movimientoModel.ts
export interface MovimientoModel {
    movimiento_id: number;
    fecha_hora_apertura?: Date;
    observacion_apertura?: String;
    caja_id: number;
    usuario_id: number;
    moneda_id: number;
    monto_apertura: number;
    estado?: boolean;
    fecha_hora_cierre?: Date;
    monto_cierre?: number;
    observacion_cierre?: String;

}
