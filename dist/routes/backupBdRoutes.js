"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const backup_1 = require("../backup");
const router = express_1.default.Router();
// Ruta para hacer una copia de la base de datos del sistema
router.get('/generar_copia_bd', async (req, res) => {
    try {
        // Ejecuta la función de copia de seguridad
        await (0, backup_1.realizarCopiaDeSeguridad)();
        // Envía una respuesta exitosa
        res.status(200).json({ message: 'Copia de seguridad realizada con éxito' });
    }
    catch (error) {
        console.error('Error al realizar la copia de seguridad:', error);
        res.status(500).json({ message: 'Error al realizar la copia de seguridad' });
    }
});
exports.default = router;
