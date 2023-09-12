import express from 'express';
import * as tipoProgramaController from '../controllers/tipo_programaController';
import { authenticate } from '../middlewares/authMiddleware'; // Importa el middleware de autenticación

const router = express.Router();

// Ruta para obtener todos los registros de tipo_programa (protegida por autenticación)
router.get('/tipo_programas', authenticate, tipoProgramaController.getAllRegister);

// Ruta para obtener un registro de tipo_programa por ID (protegida por autenticación)
router.get('/tipo_programas/:id', authenticate, tipoProgramaController.getOneRegister);

// Ruta para insertar un nuevo registro de tipo_programa (protegida por autenticación)
router.post('/tipo_programas', authenticate, tipoProgramaController.insertRegister);

// Ruta para actualizar un registro de tipo_programa por ID (protegida por autenticación)
router.put('/tipo_programas/:id', authenticate, tipoProgramaController.updateRegister);

// Ruta para eliminar un registro de tipo_programa por ID (protegida por autenticación)
router.delete('/tipo_programas/:id', authenticate, tipoProgramaController.deleteRegister);

export default router;
