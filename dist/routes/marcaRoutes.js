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
const marcaController = __importStar(require("../controllers/marcaController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// Ruta para obtener todos los registros de marcas (protegida por autenticación)
router.get('/marcas', authMiddleware_1.authenticate, marcaController.getAllRegister);
// Ruta para obtener un registro de marcas por ID (protegida por autenticación)
router.get('/marcas/:id', authMiddleware_1.authenticate, marcaController.getOneRegister);
// Ruta para insertar un nuevo registro de marcas (protegida por autenticación)
router.post('/marcas', authMiddleware_1.authenticate, marcaController.insertRegister);
// Ruta para actualizar un registro de marcas por ID (protegida por autenticación)
router.put('/marcas/:id', authMiddleware_1.authenticate, marcaController.updateRegister);
// Ruta para eliminar un registro de marcas por ID (protegida por autenticación)
router.delete('/marcas/:id', authMiddleware_1.authenticate, marcaController.deleteRegister);
exports.default = router;
