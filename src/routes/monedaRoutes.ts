import express from 'express';
import * as monedaController from '../controllers/monedaController';
import { authenticate } from '../middlewares/authMiddleware'; 

const router = express.Router();

// Ruta para obtener todos los registros de monedas (protegida por autenticación)
router.get('/monedas', authenticate, monedaController.getAllRegister);

// Ruta para obtener un registro de monedas por ID (protegida por autenticación)
router.get('/monedas/:id', authenticate, monedaController.getOneRegister);

// Ruta para insertar un nuevo registro de monedas (protegida por autenticación)
router.post('/monedas', authenticate, monedaController.insertRegister); 

// Ruta para actualizar un registro de monedas por ID (protegida por autenticación)
router.put('/monedas/:id', authenticate, monedaController.updateRegister);

// Ruta para eliminar un registro de monedas por ID (protegida por autenticación)
router.delete('/monedas/:id', authenticate, monedaController.deleteRegister);

export default router;
