import express from 'express';
import { realizarCopiaDeSeguridad } from '../backup';

const router = express.Router();

// Ruta para hacer una copia de la base de datos del sistema
router.get('/generar_copia_bd', async (req, res) => {
    try {
        // Ejecuta la función de copia de seguridad
        await realizarCopiaDeSeguridad();

        // Envía una respuesta exitosa
        res.status(200).json({ message: 'Copia de seguridad realizada con éxito' });
    } catch (error) {
        console.error('Error al realizar la copia de seguridad:', error);
        res.status(500).json({ message: 'Error al realizar la copia de seguridad' });
    }
});

export default router;
