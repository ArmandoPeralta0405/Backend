// src/models/usuarioModel.ts
export interface UsuarioModel {
    usuario_id: number;
    alias: string;
    clave?: string;
    nombre: string;
    apellido: string;
    email: string;
    cedula_identidad: string | null;
    fecha_registro: Date;
    fecha_actualizacion: Date;
    estado: boolean;
  }
  