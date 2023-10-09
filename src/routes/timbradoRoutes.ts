import express from 'express';
import * as TimbradoController from '../controllers/timbradoController'; // Importa el controlador de timbrado
import { authenticate } from '../middlewares/authMiddleware'; // Importa el middleware de autenticación

const router = express.Router();

// Ruta para obtener todos los registros de timbrados (protegida por autenticación)
router.get('/timbrados', authenticate, TimbradoController.getAllRegister);

// Ruta para obtener un registro de timbrado por ID (protegida por autenticación)
router.get('/timbrados/:id', authenticate, TimbradoController.getOneRegister);

// Ruta para insertar un nuevo registro de timbrado (protegida por autenticación)
router.post('/timbrados', authenticate, TimbradoController.insertRegister);

// Ruta para actualizar un registro de timbrado por ID (protegida por autenticación)
router.put('/timbrados/:id', authenticate, TimbradoController.updateRegister);

// Ruta para eliminar un registro de timbrado por ID (protegida por autenticación)
router.delete('/timbrados/:id', authenticate, TimbradoController.deleteRegister);

// Ruta para actualizar el estado de timbrado por ID (protegida por autenticación)
router.put('/timbrados/estado/:id', authenticate, TimbradoController.updateEstado);

export default router;
