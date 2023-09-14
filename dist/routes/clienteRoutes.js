"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clienteController = __importStar(require("../controllers/clienteController")); // Importa el controlador de modulo
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Importa el middleware de autenticación
const router = express_1.default.Router();
// Ruta para obtener todos los registros de clientes (protegida por autenticación)
router.get('/clientes', authMiddleware_1.authenticate, clienteController.getAllRegister);
// Ruta para obtener un registro de clientes por ID (protegida por autenticación)
router.get('/clientes/:id', authMiddleware_1.authenticate, clienteController.getOneRegister);
// Ruta para insertar un nuevo registro de clientes (protegida por autenticación)
router.post('/clientes', authMiddleware_1.authenticate, clienteController.insertRegister);
// Ruta para actualizar un registro de clientes por ID (protegida por autenticación)
router.put('/clientes/:id', authMiddleware_1.authenticate, clienteController.updateRegister);
// Ruta para eliminar un registro de clientes por ID (protegida por autenticación)
router.delete('/clientes/:id', authMiddleware_1.authenticate, clienteController.deleteRegister);
// Ruta para actualizar el estado de modulo por ID (protegida por autenticación)
router.put('/clientes/estado/:id', authMiddleware_1.authenticate, clienteController.updateEstado);
exports.default = router;
