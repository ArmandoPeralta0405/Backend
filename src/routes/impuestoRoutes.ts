import express from 'express';
import * as impuestoController from '../controllers/impuestoController';
import { authenticate } from '../middlewares/authMiddleware'; 

const router = express.Router();

// Ruta para obtener todos los registros de impuestos (protegida por autenticación)
router.get('/impuestos', authenticate, impuestoController.getAllRegister);

// Ruta para obtener un registro de impuestos por ID (protegida por autenticación)
router.get('/impuestos/:id', authenticate, impuestoController.getOneRegister);

// Ruta para insertar un nuevo registro de impuestos (protegida por autenticación)
router.post('/impuestos', authenticate, impuestoController.insertRegister);

// Ruta para actualizar un registro de impuestos por ID (protegida por autenticación)
router.put('/impuestos/:id', authenticate, impuestoController.updateRegister);

// Ruta para eliminar un registro de impuestos por ID (protegida por autenticación)
router.delete('/impuestos/:id', authenticate, impuestoController.deleteRegister);

export default router;
