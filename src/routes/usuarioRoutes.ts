import express from 'express';
import * as usuarioController from '../controllers/usuarioController';
import { authenticate } from '../middlewares/authMiddleware'; // Importa el middleware de autenticación

const router = express.Router();

// Ruta para obtener todos los registros de usuarios (protegida por autenticación)
router.get('/usuarios', authenticate, usuarioController.getAllRegister);

// Ruta para obtener un registro de usuario por ID (protegida por autenticación)
router.get('/usuarios/:id', authenticate, usuarioController.getOneRegister);

// Ruta para insertar un nuevo registro de usuario (protegida por autenticación)
router.post('/usuarios', authenticate, usuarioController.insertRegister);

// Ruta para actualizar un registro de usuario por ID (protegida por autenticación)
router.put('/usuarios/:id', authenticate, usuarioController.updateRegister);

// Ruta para eliminar un registro de usuario por ID (protegida por autenticación)
router.delete('/usuarios/:id', authenticate, usuarioController.deleteRegister);

// Ruta para actualizar el estado de usuario por ID (protegida por autenticación)
router.put('/usuarios/estado/:id', authenticate, usuarioController.updateEstado);

export default router;
