import express from 'express';
import * as pedidoVentaDetalleController from '../controllers/pedido_venta_detalleController'; // Importa el controlador de modulo
import { authenticate } from '../middlewares/authMiddleware'; // Importa el middleware de autenticación

const router = express.Router();

// Ruta para obtener todos los registros de pedidos de ventas detalles (protegida por autenticación)
router.get('/pedidos_ventas_detalles', authenticate, pedidoVentaDetalleController.getAllRegister);

// Ruta para obtener un registro de pedidos de ventas detalles por ID (protegida por autenticación)
router.get('/pedidos_ventas_detalles/:id', authenticate, pedidoVentaDetalleController.getOneRegister);

// Ruta para obtener un registro de pedidos de ventas detalles por ID (protegida por autenticación)
router.get('/pedidos_ventas_detalles_view/:id', authenticate, pedidoVentaDetalleController.getOneRegisterView);


export default router;