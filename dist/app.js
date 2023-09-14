"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // Importa cors
const routes_1 = __importDefault(require("./routes/routes"));
const app = (0, express_1.default)();
const ipAddress = 'localhost'; // Cambia a tu dirección IP local
const ipAddressLocal = 'localhost'; // Cambia a tu dirección IP local
// Middleware para parsear JSON en las solicitudes
app.use(express_1.default.json());
// Configura CORS para permitir solicitudes desde el dominio de tu aplicación Angular
const corsOptions = {
    origin: 'http://' + ipAddress + ':4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use((0, cors_1.default)()); // Usa cors con las opciones configuradas
app.use('/api', routes_1.default);
// Configura otros middleware y configuraciones según tus necesidades
// Inicia el servidor
const defaultPort = 3000; // Puerto predeterminado
const envPort = process.env.PORT ? parseInt(process.env.PORT, 10) : undefined; // Intenta obtener el puerto de las variables de entorno
// Usa el puerto de las variables de entorno si está definido, de lo contrario, usa el puerto predeterminado
const PORT = envPort || defaultPort;
//En la red misma
app.listen(PORT, ipAddress, () => {
    console.log(`Servidor escuchando en http://${ipAddress}:${PORT}`);
});
//En la maquina
/*
app.listen(PORT, ipAddressLocal, () => {
  console.log(`Servidor escuchando en http://${ipAddressLocal}:${PORT}`);
});
*/
