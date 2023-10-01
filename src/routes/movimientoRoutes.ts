import express from 'express';
import * as MovimientoController from '../controllers/movimientoController'; // Importa el controlador de movimiento
import { authenticate } from '../middlewares/authMiddleware'; // Importa el middleware de autenticación

const router = express.Router();

// Ruta para obtener todos los registros de movimientos (protegida por autenticación)
router.get('/movimientos', authenticate, MovimientoController.getAllRegister);

// Ruta para obtener un registro de movimiento por ID (protegida por autenticación)
router.get('/movimientos/:id', authenticate, MovimientoController.getOneRegister);

// Ruta para insertar un nuevo registro de movimiento (protegida por autenticación)
router.post('/movimientos', authenticate, MovimientoController.insertRegister);

// Ruta para actualizar un registro de movimiento por ID (protegida por autenticación)
router.put('/movimientos/:id', authenticate, MovimientoController.updateRegister);

// Ruta para eliminar un registro de movimiento por ID (protegida por autenticación)
router.delete('/movimientos/:id', authenticate, MovimientoController.deleteRegister);

// Ruta para actualizar el estado de movimiento por ID (protegida por autenticación)
router.put('/movimientos/estado/:id', authenticate, MovimientoController.updateEstado);

export default router;
