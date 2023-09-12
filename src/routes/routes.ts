import express from 'express';
//Esta importacion es netamente solo para hacer una copia de la base de datos del sistema
import backupBdRoutes from '../routes/backupBdRoutes';

import authRoutes from '../routes/authRoutes';
import usuarioRoutes from '../routes/usuarioRoutes';
import rolRoutes from '../routes/rolRoutes';
import moduloRoutes from '../routes/moduloRoutes';
import tipoProgramaRoutes from '../routes/tipo_programaRoutes';
import depositoRoutes from '../routes/depositoRoutes';
import impuestoRoutes from '../routes/impuestoRoutes';
import marcaRoutes from '../routes/marcaRoutes';
import unidadMedidaRoutes from '../routes/unidad_medidaRoutes';
import articuloRoutes from '../routes/articuloRoutes';
import monedaRoutes from '../routes/monedaRoutes';
import listaPrecioRoutes from '../routes/lista_precioRoutes';
import articuloListaPrecioRoutes from '../routes/articulo_lista_precioRoutes';
import clienteRoutes from '../routes/clienteRoutes';



const router = express.Router();

//router.use(backupBdRoutes);

router.use(authRoutes);
router.use(usuarioRoutes);
router.use(rolRoutes);
router.use(moduloRoutes);
router.use(tipoProgramaRoutes);
router.use(depositoRoutes);
router.use(impuestoRoutes);
router.use(marcaRoutes);
router.use(unidadMedidaRoutes);
router.use(articuloRoutes);
router.use(monedaRoutes);
router.use(listaPrecioRoutes);
router.use(articuloListaPrecioRoutes);
router.use(clienteRoutes);



export default router;