// src/app.ts
import express from 'express';
import cors from 'cors'; // Importa cors
import router from "./routes/routes";

const app = express();

//const ipAddress = '192.168.0.111'; // Direccion IP TRABAJO
const ipAddress = '192.168.100.7'; // Direccion IP CASA
const ipAddressLocal = 'localhost'; // Cambia a tu dirección IP local

// Middleware para parsear JSON en las solicitudes
app.use(express.json());
// Configura CORS para permitir solicitudes desde el dominio de tu aplicación Angular
const corsOptions = {
  origin: '*', // Reemplaza con tu dirección IP local y el puerto de tu aplicación Angular
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions)); // Usa cors con las opciones configuradas

app.use('/api', router);

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

