import express from 'express';
import * as clienteController from '../controllers/clienteController'; // Importa el controlador de modulo
import { authenticate } from '../middlewares/authMiddleware'; // Importa el middleware de autenticación

const router = express.Router();

// Ruta para obtener todos los registros de clientes (protegida por autenticación)
router.get('/clientes', authenticate, clienteController.getAllRegister);

// Ruta para obtener un registro de clientes por ID (protegida por autenticación)
router.get('/clientes/:id', authenticate, clienteController.getOneRegister);

// Ruta para insertar un nuevo registro de clientes (protegida por autenticación)
router.post('/clientes', authenticate, clienteController.insertRegister);

// Ruta para actualizar un registro de clientes por ID (protegida por autenticación)
router.put('/clientes/:id', authenticate, clienteController.updateRegister);

// Ruta para eliminar un registro de clientes por ID (protegida por autenticación)
router.delete('/clientes/:id', authenticate, clienteController.deleteRegister);

// Ruta para actualizar el estado de modulo por ID (protegida por autenticación)
router.put('/clientes/estado/:id', authenticate, clienteController.updateEstado);

export default router;
