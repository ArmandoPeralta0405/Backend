import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define una interfaz que extiende el tipo Request para incluir la propiedad 'user'
interface AuthenticatedRequest extends Request {
    user?: any; // Cambia 'any' por el tipo correcto de usuario si lo tienes definido
}

const secretKey = '@cvbd2023'; // Cambia esto por una clave secreta segura

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Token no válido' });
    }
};
