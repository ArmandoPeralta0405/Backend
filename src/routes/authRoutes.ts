import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();

router.post('/login', authController.login); // Ruta para el inicio de sesión

export default router; 
