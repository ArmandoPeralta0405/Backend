import express from 'express';
import * as rolController from '../controllers/rolController';
import { authenticate } from '../middlewares/authMiddleware'; // Importa el middleware de autenticación

const router = express.Router();

// Ruta para obtener todos los registros de roles (protegida por autenticación)
router.get('/roles', authenticate, rolController.getAllRegister);

// Ruta para obtener un registro de rol por ID (protegida por autenticación)
router.get('/roles/:id', authenticate, rolController.getOneRegister);

// Ruta para insertar un nuevo registro de rol (protegida por autenticación)
router.post('/roles', authenticate, rolController.insertRegister);

// Ruta para actualizar un registro de rol por ID (protegida por autenticación)
router.put('/roles/:id', authenticate, rolController.updateRegister);

// Ruta para eliminar un registro de rol por ID (protegida por autenticación)
router.delete('/roles/:id', authenticate, rolController.deleteRegister);

export default router;
