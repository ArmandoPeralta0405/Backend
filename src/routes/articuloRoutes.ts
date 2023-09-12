import express from 'express';
import * as articuloController from '../controllers/articuloController'; // Importa el controlador
import { authenticate } from '../middlewares/authMiddleware'; // Importa el middleware de autenticación

const router = express.Router();

// Ruta para obtener todos los registros de articulo (protegida por autenticación)
router.get('/articulos', authenticate, articuloController.getAllRegister);

// Ruta para obtener un registro de articulo por ID (protegida por autenticación)
router.get('/articulos/:id', authenticate, articuloController.getOneRegister);

// Ruta para obtener un registro de articulo por ID (protegida por autenticación)
router.get('/articulos_view/:id', authenticate, articuloController.getOneRegisterView);

// Ruta para insertar un nuevo registro de articulo (protegida por autenticación)
router.post('/articulos', authenticate, articuloController.insertRegister);

// Ruta para actualizar un registro de articulo por ID (protegida por autenticación)
router.put('/articulos/:id', authenticate, articuloController.updateRegister);

// Ruta para eliminar un registro de articulo por ID (protegida por autenticación)
router.delete('/articulos/:id', authenticate, articuloController.deleteRegister);

// Ruta para actualizar el estado de articulo por ID (protegida por autenticación)
router.put('/articulos/estado/:id', authenticate, articuloController.updateEstado);

export default router;
