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
const usuarioController = __importStar(require("../controllers/usuarioController"));
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Importa el middleware de autenticación
const router = express_1.default.Router();
// Ruta para obtener todos los registros de usuarios (protegida por autenticación)
router.get('/usuarios', authMiddleware_1.authenticate, usuarioController.getAllRegister);
// Ruta para obtener un registro de usuario por ID (protegida por autenticación)
router.get('/usuarios/:id', authMiddleware_1.authenticate, usuarioController.getOneRegister);
// Ruta para insertar un nuevo registro de usuario (protegida por autenticación)
router.post('/usuarios', authMiddleware_1.authenticate, usuarioController.insertRegister);
// Ruta para actualizar un registro de usuario por ID (protegida por autenticación)
router.put('/usuarios/:id', authMiddleware_1.authenticate, usuarioController.updateRegister);
// Ruta para eliminar un registro de usuario por ID (protegida por autenticación)
router.delete('/usuarios/:id', authMiddleware_1.authenticate, usuarioController.deleteRegister);
// Ruta para actualizar el estado de usuario por ID (protegida por autenticación)
router.put('/usuarios/estado/:id', authMiddleware_1.authenticate, usuarioController.updateEstado);
exports.default = router;
