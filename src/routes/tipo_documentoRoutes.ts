import express from 'express';
import * as tipo_documentoController from '../controllers/tipo_documentoController';
import { authenticate } from '../middlewares/authMiddleware'; 

const router = express.Router();

// Ruta para obtener todos los registros de tipos_documentos (protegida por autenticación)
router.get('/tipos_documentos', authenticate, tipo_documentoController.getAllRegister);

// Ruta para obtener un registro de tipos_documentos por ID (protegida por autenticación)
router.get('/tipos_documentos/:id', authenticate, tipo_documentoController.getOneRegister);

// Ruta para insertar un nuevo registro de tipos_documentos (protegida por autenticación)
router.post('/tipos_documentos', authenticate, tipo_documentoController.insertRegister);

// Ruta para actualizar un registro de tipos_documentos por ID (protegida por autenticación)
router.put('/tipos_documentos/:id', authenticate, tipo_documentoController.updateRegister);

// Ruta para eliminar un registro de tipos_documentos por ID (protegida por autenticación)
router.delete('/tipos_documentos/:id', authenticate, tipo_documentoController.deleteRegister);

export default router;
