import express from 'express';
import * as listaPrecioController from '../controllers/lista_precioController'; // Importa el controlador
import { authenticate } from '../middlewares/authMiddleware'; // Importa el middleware de autenticación

const router = express.Router();

// Ruta para obtener todos los registros de listas_precios (protegida por autenticación)
router.get('/listas_precios', authenticate, listaPrecioController.getAllRegister);

// Ruta para obtener un registro de listas_precios por ID (protegida por autenticación)
router.get('/listas_precios/:id', authenticate, listaPrecioController.getOneRegister);

// Ruta para insertar un nuevo registro de listas_precios (protegida por autenticación)
router.post('/listas_precios', authenticate, listaPrecioController.insertRegister);

// Ruta para actualizar un registro de listas_precios por ID (protegida por autenticación)
router.put('/listas_precios/:id', authenticate, listaPrecioController.updateRegister);

// Ruta para eliminar un registro de listas_precios por ID (protegida por autenticación)
router.delete('/listas_precios/:id', authenticate, listaPrecioController.deleteRegister);

export default router;
