import express from 'express';
import * as CajaController from '../controllers/cajaController'; // Importa el controlador de caja
import { authenticate } from '../middlewares/authMiddleware'; // Importa el middleware de autenticación

const router = express.Router();

// Ruta para obtener todos los registros de cajas (protegida por autenticación)
router.get('/cajas', authenticate, CajaController.getAllRegister);

// Ruta para obtener un registro de caja por ID (protegida por autenticación)
router.get('/cajas/:id', authenticate, CajaController.getOneRegister);

// Ruta para insertar un nuevo registro de caja (protegida por autenticación)
router.post('/cajas', authenticate, CajaController.insertRegister);

// Ruta para actualizar un registro de caja por ID (protegida por autenticación)
router.put('/cajas/:id', authenticate, CajaController.updateRegister);

// Ruta para eliminar un registro de caja por ID (protegida por autenticación)
router.delete('/cajas/:id', authenticate, CajaController.deleteRegister);

// Ruta para actualizar el estado de caja por ID (protegida por autenticación)
router.put('/cajas/estado/:id', authenticate, CajaController.updateEstado);

export default router;
