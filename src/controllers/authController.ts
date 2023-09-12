import { Request, Response } from 'express';
import { UsuarioModel } from '../models/usuarioModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { conexionBD } from '../database';

const secretKey = '@cvbd2023'; // Debe coincidir con la clave secreta del middleware

export const login = async (req: Request, res: Response) => {
    const { email, clave } = req.body;
    // Compara la contraseña proporcionada con la contraseña almacenada
    let isMatch: boolean; // Declaración de la variable isMatch

    try {
        // Consulta la base de datos para encontrar el usuario por su correo electrónico
        const connection = await conexionBD();
        const [userRows]: any = await connection.execute('SELECT * FROM usuario WHERE email = ?', [email]);

        if (userRows.length === 0) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Verifica que el estado del usuario sea true
        if (userRows[0].estado == false) {
            return res.status(400).json({ message: 'El usuario está inactivo' });
        }

        // Obtiene el usuario encontrado
        const user: UsuarioModel = {
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
            isMatch = await bcrypt.compare(clave, user.clave);

            if (!isMatch) {
                return res.status(400).json({ message: 'Credenciales inválidas' });
            }
        } else {
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

        jwt.sign(payload, secretKey, { expiresIn: '4h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (error) {
        console.error('Error de inicio de sesión:', error);
        res.status(500).json({ message: 'Error de inicio de sesión', error });
    }
};
