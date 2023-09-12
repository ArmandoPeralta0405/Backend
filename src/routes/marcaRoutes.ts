import express from 'express';
import * as marcaController from '../controllers/marcaController';
import { authenticate } from '../middlewares/authMiddleware'; 

const router = express.Router();

// Ruta para obtener todos los registros de marcas (protegida por autenticación)
router.get('/marcas', authenticate, marcaController.getAllRegister);

// Ruta para obtener un registro de marcas por ID (protegida por autenticación)
router.get('/marcas/:id', authenticate, marcaController.getOneRegister);

// Ruta para insertar un nuevo registro de marcas (protegida por autenticación)
router.post('/marcas', authenticate, marcaController.insertRegister);

// Ruta para actualizar un registro de marcas por ID (protegida por autenticación)
router.put('/marcas/:id', authenticate, marcaController.updateRegister);

// Ruta para eliminar un registro de marcas por ID (protegida por autenticación)
router.delete('/marcas/:id', authenticate, marcaController.deleteRegister);

export default router;
