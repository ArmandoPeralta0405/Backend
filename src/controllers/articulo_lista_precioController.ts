import { Request, Response } from 'express';
import { conexionBD } from '../database';
import { ArticuloListaPrecioModel, ArticuloListaPrecioModelVista } from '../models/articulo_lista_precioModel'; 

export const obtenerListasPreciosPorArticulo = async (req: Request, res: Response) => {
    const ID = req.params.id; 

    try {
        
        const connection = await conexionBD();

        
        const [rows]: any = await connection.execute('SELECT * FROM articulo_lista_precio_view WHERE articulo_id = ?', [ID]);


        if (rows.length === 0) {
            return res.status(404).json({ message: 'Articulo no encontrado' });
        }

        const articulo_lista_precio: ArticuloListaPrecioModelVista[] = [];

        for (const row of rows) {
            articulo_lista_precio.push({
                articulo_id: row.articulo_id,
                descripcion_articulo: row.descripcion_articulo,
                lista_precio_id: row.lista_precio_id,
                descripcion_lista_precio: row.descripcion_lista_precio,
                moneda_id: row.moneda_id,
                descripcion_moneda: row.descripcion_moneda,
                precio: row.precio
            });
        }

        res.status(200).json(articulo_lista_precio);
    } catch (error) {
        console.error('Error al obtener un articulo lista de precio:', error);
        res.status(500).json({ message: 'Error al obtener un articulo lista de precio', error: error });
    }
};

export const insertarModificarListaPrecio = async (req: Request, res: Response) => {
    try {
        const { articulo_id, lista_precio_id, precio }: ArticuloListaPrecioModel = req.body;

        if (!articulo_id || !lista_precio_id || precio === undefined) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        const connection = await conexionBD();

        // Verificar si el registro ya existe
        const [existingRegistro]: any = await connection.execute(
            'SELECT * FROM articulo_lista_precio WHERE articulo_id = ? AND lista_precio_id = ?',
            [articulo_id, lista_precio_id]
        );

        if (existingRegistro.length > 0) {
            // Si existe, actualizar el precio
            await connection.execute(
                'UPDATE articulo_lista_precio SET precio = ? WHERE articulo_id = ? AND lista_precio_id = ?',
                [precio, articulo_id, lista_precio_id]
            );
        } else {
            // Si no existe, insertar un nuevo registro
            await connection.execute(
                'INSERT INTO articulo_lista_precio (articulo_id, lista_precio_id, precio) VALUES (?, ?, ?)',
                [articulo_id, lista_precio_id, precio]
            );
        }

        res.status(200).json({ message: 'Precio actualizado o insertado con éxito' });
    } catch (error) {
        console.error('Error al actualizar o insertar precio:', error);
        res.status(500).json({ message: 'Error al actualizar o insertar precio', error: error });
    }
};

export const obtenerPrecioPorArticuloYLista = async (req: Request, res: Response) => {
  
    const { articulo_id, lista_precio_id } = req.body.filtrosPrecio;

    
    try {
        const connection = await conexionBD();

        // Realiza la consulta SQL para obtener el precio
        const [rows]: any = await connection.execute('SELECT precio FROM articulo_lista_precio_view WHERE articulo_id = ? AND lista_precio_id = ?', [articulo_id, lista_precio_id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Precio no encontrado para el artículo y la lista de precio proporcionados.' });
        }

        const precio = rows[0].precio;

        res.status(200).json({ precio });
    } catch (error) {
        console.error('Error al obtener el precio:', error);
        res.status(500).json({ message: 'Error al obtener el precio', error: error });
    }
};

