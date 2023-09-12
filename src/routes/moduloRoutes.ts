import express from 'express';
import * as moduloController from '../controllers/moduloController'; // Importa el controlador de modulo
import { authenticate } from '../middlewares/authMiddleware'; // Importa el middleware de autenticación

const router = express.Router();

// Ruta para obtener todos los registros de módulos (protegida por autenticación)
router.get('/modulos', authenticate, moduloController.getAllRegister);

// Ruta para obtener un registro de módulo por ID (protegida por autenticación)
router.get('/modulos/:id', authenticate, moduloController.getOneRegister);

// Ruta para insertar un nuevo registro de módulo (protegida por autenticación)
router.post('/modulos', authenticate, moduloController.insertRegister);

// Ruta para actualizar un registro de módulo por ID (protegida por autenticación)
router.put('/modulos/:id', authenticate, moduloController.updateRegister);

// Ruta para eliminar un registro de módulo por ID (protegida por autenticación)
router.delete('/modulos/:id', authenticate, moduloController.deleteRegister);

// Ruta para actualizar el estado de modulo por ID (protegida por autenticación)
router.put('/modulos/estado/:id', authenticate, moduloController.updateEstado);

export default router;
