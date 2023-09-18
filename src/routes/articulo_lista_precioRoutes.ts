import express from 'express';
import * as articuloListaPrecioController from '../controllers/articulo_lista_precioController'; // Importa el controlador
import { authenticate } from '../middlewares/authMiddleware'; // Importa el middleware de autenticación

const router = express.Router();

//Recuperar todas las listas de precios del articulo (Con autentizacion)
router.get('/articulos_listas_precios/:id', authenticate, articuloListaPrecioController.obtenerListasPreciosPorArticulo);

// Ruta para actualizar o insertar precio (Con autentizacion)
router.post('/articulos_listas_precios/insertar_editar', authenticate, articuloListaPrecioController.insertarModificarListaPrecio);

// Ruta para obtener precios de articulos (Con autentizacion)
router.post('/obtener_precio', authenticate, articuloListaPrecioController.obtenerPrecioPorArticuloYLista);

export default router;
