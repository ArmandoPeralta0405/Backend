import express from 'express';
import * as unidadMedidaController from '../controllers/unidad_medidaController';
import { authenticate } from '../middlewares/authMiddleware'; 

const router = express.Router();

// Ruta para obtener todos los registros de unidades_medidas (protegida por autenticación)
router.get('/unidades_medidas', authenticate, unidadMedidaController.getAllRegister);

// Ruta para obtener un registro de unidades_medidas por ID (protegida por autenticación)
router.get('/unidades_medidas/:id', authenticate, unidadMedidaController.getOneRegister);

// Ruta para insertar un nuevo registro de unidades_medidas (protegida por autenticación)
router.post('/unidades_medidas', authenticate, unidadMedidaController.insertRegister);

// Ruta para actualizar un registro de unidades_medidas por ID (protegida por autenticación)
router.put('/unidades_medidas/:id', authenticate, unidadMedidaController.updateRegister);

// Ruta para eliminar un registro de unidades_medidas por ID (protegida por autenticación)
router.delete('/unidades_medidas/:id', authenticate, unidadMedidaController.deleteRegister);

export default router;
