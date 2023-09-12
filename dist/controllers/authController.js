"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../database");
const secretKey = '@cvbd2023'; // Debe coincidir con la clave secreta del middleware
const login = async (req, res) => {
    const { email, clave } = req.body;
    // Compara la contraseña proporcionada con la contraseña almacenada
    let isMatch; // Declaración de la variable isMatch
    try {
        // Consulta la base de datos para encontrar el usuario por su correo electrónico
        const connection = await (0, database_1.conexionBD)();
        const [userRows] = await connection.execute('SELECT * FROM usuario WHERE email = ?', [email]);
        if (userRows.length === 0) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }
        // Verifica que el estado del usuario sea true
        if (userRows[0].estado == false) {
            return res.status(400).json({ message: 'El usuario está inactivo' });
        }
        // Obtiene el usuario encontrado
        const user = {
            usuario_id: userRows[0].usuario_id,
            alias: userRows[0].alias,
            clave: userRows[0].clave,
            nombre: userRows[0].nombre,
            apellido: userRows[0].apellido,
            email: userRows[0].email,
            cedula_identidad: userRows[0].cedula_identidad,
            fecha_registro: userRows[0].fecha_registro,
            fecha_actualizacion: userRows[0].fecha_actualizacion,
            estado: userRows[0].estado,
        };
        // Compara la contraseña proporcionada con la contraseña almacenada
        if (user.clave) {
            isMatch = await bcrypt_1.default.compare(clave, user.clave);
            if (!isMatch) {
                return res.status(400).json({ message: 'Credenciales inválidas' });
            }
        }
        else {
            // Handle the case where user.clave is undefined
            return res.status(400).json({ message: 'No se ha definido una contraseña para este usuario' });
        }
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }
        // Si las credenciales son válidas y el usuario tiene estado true, genera un token JWT
        const payload = {
            user_id: user.usuario_id,
            email: user.email,
            // Otros datos que quieras incluir en el token
        };
        jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: '4h' }, (err, token) => {
            if (err)
                throw err;
            res.json({ token });
        });
    }
    catch (error) {
        console.error('Error de inicio de sesión:', error);
        res.status(500).json({ message: 'Error de inicio de sesión', error });
    }
};
exports.login = login;
