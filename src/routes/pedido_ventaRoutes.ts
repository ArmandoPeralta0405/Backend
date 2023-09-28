import express from 'express';
import * as pedidoVentaController from '../controllers/pedido_ventaController'; // Importa el controlador de modulo
import { authenticate } from '../middlewares/authMiddleware'; // Importa el middleware de autenticación

const router = express.Router();

// Ruta para obtener todos los registros de pedidos de ventas (protegida por autenticación)
router.get('/pedidos_ventas', authenticate, pedidoVentaController.getAllRegister);

// Ruta para obtener un registro de pedidos de ventas por ID (protegida por autenticación)
router.get('/pedidos_ventas/:id', authenticate, pedidoVentaController.getOneRegister);

// Ruta para obtener un registro de pedidos de ventas por ID (protegida por autenticación)
router.get('/pedidos_ventas_view/:id', authenticate, pedidoVentaController.getOneRegisterView);

// Ruta para insertar un nuevo registro de pedidos de ventas (protegida por autenticación)
router.post('/pedidos_ventas', authenticate, pedidoVentaController.insertRegister);

// Ruta para eliminar un registro de pedidos de ventas por ID (protegida por autenticación)
router.delete('/pedidos_ventas/:id', authenticate, pedidoVentaController.deleteRegister);

// Ruta para actualizar el estado de pedidos de ventas por ID (protegida por autenticación)
router.put('/pedidos_ventas/estado/:id', authenticate, pedidoVentaController.updateEstado);

// Ruta para obtener el numero de pedido disponible (protegida por autenticación)
router.get('/numero_disponible_pedido', authenticate, pedidoVentaController.NumeroPedidoDisponible);

// Ruta para obtener el comprobante de pedidos de ventas por ID (protegida por autenticación)
router.get('/pedidos_ventas_comprobantes/:id', authenticate, pedidoVentaController.getImpresionPedidoVenta);


export default router;
