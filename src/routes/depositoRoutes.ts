import express from 'express';
import * as depositoController from '../controllers/depositoController';
import { authenticate } from '../middlewares/authMiddleware'; 

const router = express.Router();

// Ruta para obtener todos los registros de depositos (protegida por autenticación)
router.get('/depositos', authenticate, depositoController.getAllRegister);

// Ruta para obtener un registro de depositos por ID (protegida por autenticación)
router.get('/depositos/:id', authenticate, depositoController.getOneRegister);

// Ruta para insertar un nuevo registro de depositos (protegida por autenticación)
router.post('/depositos', authenticate, depositoController.insertRegister);

// Ruta para actualizar un registro de depositos por ID (protegida por autenticación)
router.put('/depositos/:id', authenticate, depositoController.updateRegister);

// Ruta para eliminar un registro de depositos por ID (protegida por autenticación)
router.delete('/depositos/:id', authenticate, depositoController.deleteRegister);

export default router;
