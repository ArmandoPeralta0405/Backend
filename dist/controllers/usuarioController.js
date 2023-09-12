"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEstado = exports.deleteRegister = exports.updateRegister = exports.insertRegister = exports.getOneRegister = exports.getAllRegister = void 0;
const database_1 = require("../database");
const bcrypt_1 = __importDefault(require("bcrypt")); // Importa la librería de cifrado de contraseñas
//METODOS DEL CONTROLADOR
const getAllRegister = async (req, res) => {
    try {
        // Establece la conexión a la base de datos utilizando la función de conexión
        const connection = await (0, database_1.conexionBD)();
        // Ejecuta una consulta para obtener todos los usuarios
        const [rows] = await connection.execute('SELECT * FROM usuario');
        // Convierte los resultados a objetos UsuarioModel
        const usuarios = [];
        for (const row of rows) {
            usuarios.push({
                usuario_id: row.usuario_id,
                alias: row.alias,
                clave: row.clave,
                nombre: row.nombre,
                apellido: row.apellido,
                email: row.email,
                cedula_identidad: row.cedula_identidad,
                fecha_registro: row.fecha_registro,
                fecha_actualizacion: row.fecha_actualizacion,
                estado: row.estado
            });
        }
        // Envía la respuesta con los datos de los usuarios  
        res.status(200).json(usuarios);
    }
    catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios', error: error });
    }
};
exports.getAllRegister = getAllRegister;
const getOneRegister = async (req, res) => {
    const ID = req.params.id; // Obtiene el ID del parámetro de la solicitud
    try {
        // Establece la conexión a la base de datos utilizando la función de conexión
        const connection = await (0, database_1.conexionBD)();
        // Ejecuta una consulta para obtener un usuario por ID
        const [rows] = await connection.execute('SELECT * FROM usuario WHERE usuario_id = ?', [ID]);
        // Verifica si se encontró un usuario con el ID proporcionado
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Convierte el resultado a un objeto UsuarioModel
        const usuario = {
            usuario_id: rows[0].usuario_id,
            alias: rows[0].alias,
            clave: rows[0].clave,
            nombre: rows[0].nombre,
            apellido: rows[0].apellido,
            email: rows[0].email,
            cedula_identidad: rows[0].cedula_identidad,
            fecha_registro: rows[0].fecha_registro,
            fecha_actualizacion: rows[0].fecha_actualizacion,
            estado: rows[0].estado
        };
        // Envía la respuesta con el usuario encontrado
        res.status(200).json(usuario);
    }
    catch (error) {
        console.error('Error al obtener un usuario:', error);
        res.status(500).json({ message: 'Error al obtener un usuario', error: error });
    }
};
exports.getOneRegister = getOneRegister;
const insertRegister = async (req, res) => {
    try {
        var { alias, clave, nombre, apellido, email, cedula_identidad } = req.body;
        const missingFields = [];
        //POR DEFECTO, LA PRIMERA VEZ QUE CREAMOS EL USUARIO, LE ASIGNAREMOS COMO CONTRASEÑA EL ALIAS
        clave = alias;
        // Verifica que todos los campos necesarios estén definidos en el cuerpo de la solicitud
        if (!alias)
            missingFields.push('alias');
        if (!clave)
            missingFields.push('clave');
        if (!nombre)
            missingFields.push('nombre');
        if (!apellido)
            missingFields.push('apellido');
        if (!email)
            missingFields.push('email');
        if (missingFields.length > 0) {
            return res.status(400).json({ message: 'Faltan campos obligatorios', missingFields });
        }
        // Verifica si ya existe un usuario con el mismo correo electrónico
        const connection = await (0, database_1.conexionBD)();
        const [emailRows] = await connection.execute('SELECT email FROM usuario WHERE email = ?', [email]);
        if (emailRows.length > 0) {
            return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
        }
        // Cifra la contraseña antes de almacenarla
        const hashedPassword = await bcrypt_1.default.hash(clave, 10);
        // Crea un objeto UsuarioModel con los datos proporcionados
        const nuevoUsuario = {
            usuario_id: 0,
            alias,
            clave: hashedPassword,
            nombre,
            apellido,
            email,
            cedula_identidad,
            fecha_registro: new Date(),
            fecha_actualizacion: new Date(),
            estado: true,
        };
        // Ejecuta una consulta para insertar un nuevo usuario
        await connection.execute('INSERT INTO usuario (alias, clave, nombre, apellido, email, cedula_identidad, fecha_registro, fecha_actualizacion, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            nuevoUsuario.alias,
            nuevoUsuario.clave,
            nuevoUsuario.nombre,
            nuevoUsuario.apellido,
            nuevoUsuario.email,
            nuevoUsuario.cedula_identidad,
            nuevoUsuario.fecha_registro,
            nuevoUsuario.fecha_actualizacion,
            nuevoUsuario.estado,
        ]);
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    }
    catch (error) {
        //console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error al registrar usuario', error: error });
    }
};
exports.insertRegister = insertRegister;
const updateRegister = async (req, res) => {
    try {
        const { alias, nombre, apellido, email, cedula_identidad } = req.body;
        const usuario_id = req.params.id; // Recupera el usuario_id de los parámetros de la ruta
        // Verifica que el ID del usuario y al menos uno de los campos obligatorios estén presentes
        if (!usuario_id) {
            return res.status(400).json({ message: 'Falta el ID del usuario' });
        }
        const connection = await (0, database_1.conexionBD)();
        // Verifica si el usuario con el ID proporcionado existe en la base de datos
        const [userRows] = await connection.execute('SELECT * FROM usuario WHERE usuario_id = ?', [usuario_id]);
        if (userRows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Verifica si el email en la solicitud es igual al email actual en la base de datos
        if (email !== userRows[0].email) {
            // Si no son iguales, verifica si el nuevo email ya existe en la base de datos
            const [existingEmailRows] = await connection.execute('SELECT email FROM usuario WHERE email = ? AND usuario_id <> ?', [email, usuario_id]);
            if (existingEmailRows.length > 0) {
                return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
            }
        }
        // Actualiza los campos especificados en la solicitud
        const updateFields = [];
        const values = [];
        if (alias) {
            updateFields.push('alias = ?');
            values.push(alias);
        }
        if (nombre) {
            updateFields.push('nombre = ?');
            values.push(nombre);
        }
        if (apellido) {
            updateFields.push('apellido = ?');
            values.push(apellido);
        }
        if (email) {
            updateFields.push('email = ?');
            values.push(email);
        }
        if (cedula_identidad) {
            updateFields.push('cedula_identidad = ?');
            values.push(cedula_identidad);
        }
        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
        }
        values.push(usuario_id);
        // Ejecuta la consulta para actualizar el usuario
        await connection.execute(`UPDATE usuario SET ${updateFields.join(', ')} WHERE usuario_id = ?`, values);
        // Obtén el usuario actualizado desde la base de datos
        const [updatedUserRows] = await connection.execute('SELECT * FROM usuario WHERE usuario_id = ?', [usuario_id]);
        // Crea un objeto UsuarioModel con los datos actualizados
        const usuarioActualizado = {
            usuario_id: updatedUserRows[0].usuario_id,
            alias: updatedUserRows[0].alias,
            nombre: updatedUserRows[0].nombre,
            apellido: updatedUserRows[0].apellido,
            email: updatedUserRows[0].email,
            cedula_identidad: updatedUserRows[0].cedula_identidad,
            fecha_registro: updatedUserRows[0].fecha_registro,
            fecha_actualizacion: updatedUserRows[0].fecha_actualizacion,
            estado: updatedUserRows[0].estado,
        };
        res.status(200).json({ message: 'Usuario actualizado con éxito', usuario: usuarioActualizado });
    }
    catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ message: 'Error al actualizar usuario', error: error });
    }
};
exports.updateRegister = updateRegister;
const deleteRegister = async (req, res) => {
    try {
        const usuario_id = req.params.id; // Recupera el usuario_id de los parámetros de la URL
        if (!usuario_id) {
            return res.status(400).json({ message: 'Falta el ID del usuario' });
        }
        const connection = await (0, database_1.conexionBD)();
        // Verifica si el usuario con el ID proporcionado existe en la base de datos
        const [userRows] = await connection.execute('SELECT * FROM usuario WHERE usuario_id = ?', [usuario_id]);
        if (userRows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Intenta eliminar el usuario de la base de datos
        try {
            // Ejecuta la consulta para eliminar el usuario
            const [deleteResult] = await connection.execute('DELETE FROM usuario WHERE usuario_id = ?', [usuario_id]);
            // Verifica si se eliminó correctamente
            if (deleteResult.affectedRows === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            // Crea un objeto UsuarioModel con los datos del usuario eliminado
            const usuarioEliminado = {
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
            res.status(200).json({ message: 'Usuario eliminado con éxito', usuario: usuarioEliminado });
        }
        catch (error) {
            // Verifica si el error se debe a una restricción de llave foránea
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(400).json({ message: 'No se puede eliminar el usuario debido a que está relacionado a otros registros' });
            }
            console.error('Error al eliminar usuario:', error);
            res.status(500).json({ message: 'Error al eliminar usuario', error: error });
        }
    }
    catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error al eliminar usuario', error: error });
    }
};
exports.deleteRegister = deleteRegister;
const updateEstado = async (req, res) => {
    try {
        const usuario_id = req.params.id; // Recupera el usuario_id de los parámetros de la ruta
        const nuevoEstado = req.body.estado; // Recupera el nuevo estado del cuerpo de la solicitud
        // Verifica que el ID del usuario y el nuevo estado estén presentes
        if (!usuario_id || nuevoEstado === undefined) {
            return res.status(400).json({ message: 'Falta el ID del usuario o el nuevo estado' });
        }
        const connection = await (0, database_1.conexionBD)();
        // Verifica si el usuario con el ID proporcionado existe en la base de datos
        const [userRows] = await connection.execute('SELECT * FROM usuario WHERE usuario_id = ?', [usuario_id]);
        if (userRows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Actualiza el campo de estado en la base de datos
        await connection.execute('UPDATE usuario SET estado = ? WHERE usuario_id = ?', [nuevoEstado, usuario_id]);
        // Actualiza el estado en el objeto UsuarioModel
        const usuarioActualizado = {
            ...userRows[0],
            estado: nuevoEstado, // Actualiza el estado
        };
        res.status(200).json({ message: 'Estado del usuario actualizado con éxito', usuario: usuarioActualizado });
    }
    catch (error) {
        console.error('Error al actualizar estado del usuario:', error);
        res.status(500).json({ message: 'Error al actualizar estado del usuario', error: error });
    }
};
exports.updateEstado = updateEstado;
