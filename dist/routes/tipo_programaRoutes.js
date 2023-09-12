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
const tipoProgramaController = __importStar(require("../controllers/tipo_programaController"));
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Importa el middleware de autenticación
const router = express_1.default.Router();
// Ruta para obtener todos los registros de tipo_programa (protegida por autenticación)
router.get('/tipo_programas', authMiddleware_1.authenticate, tipoProgramaController.getAllRegister);
// Ruta para obtener un registro de tipo_programa por ID (protegida por autenticación)
router.get('/tipo_programas/:id', authMiddleware_1.authenticate, tipoProgramaController.getOneRegister);
// Ruta para insertar un nuevo registro de tipo_programa (protegida por autenticación)
router.post('/tipo_programas', authMiddleware_1.authenticate, tipoProgramaController.insertRegister);
// Ruta para actualizar un registro de tipo_programa por ID (protegida por autenticación)
router.put('/tipo_programas/:id', authMiddleware_1.authenticate, tipoProgramaController.updateRegister);
// Ruta para eliminar un registro de tipo_programa por ID (protegida por autenticación)
router.delete('/tipo_programas/:id', authMiddleware_1.authenticate, tipoProgramaController.deleteRegister);
exports.default = router;
