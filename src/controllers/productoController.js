const db = require('../../db'); // Asegúrate de que tu conexión a la base de datos esté configurada

// Controlador para guardar un producto
async function guardarProducto(req, res) {
    console.log(req.body); // Imprimir el cuerpo de la solicitud para depuración

    // Desestructurar los campos del cuerpo de la solicitud
    const { nombre, descripcion, precio, cantidad_stock, } = req.body;

    try {
        // Verificar si el producto ya existe por nombre
        const checkQuery = 'SELECT * FROM productos WHERE nombre = $1';
        const checkResult = await db.query(checkQuery, [nombre]);

        // Si el producto ya existe, responder con un error
        if (checkResult.rows.length > 0) {
            return res.status(400).json({ error: 'El producto ya está registrado' });
        }

        // Insertar el nuevo producto en la tabla 'productos'
        const query = `
            INSERT INTO productos (nombre, descripcion, precio, cantidad_stock)
            VALUES ($1, $2, $3, $4)
            RETURNING *`;
        const values = [nombre, descripcion, precio, cantidad_stock, ];

        const result = await db.query(query, values);

        // Enviar el producto creado como respuesta
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al guardar el producto:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Obtener todos los productos
async function obtenerProductos(req, res) {
    try {
        const query = 'SELECT * FROM productos';
        const result = await db.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener los productos:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Obtener un producto por ID
async function obtenerProductoPorId(req, res) {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM productos WHERE id = $1';
        const result = await db.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el producto:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Actualizar un producto
async function actualizarProducto(req, res) {
    const { id } = req.params;
    const { nombre, descripcion, precio, cantidad_stock } = req.body;

    try {
        // Verificar si el producto existe
        const checkQuery = 'SELECT * FROM productos WHERE id = $1';
        const checkResult = await db.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Actualizar el producto
        const query = `
            UPDATE productos
            SET nombre = $1, descripcion = $2, precio = $3, cantidad_stock = $4, fechaedicion = CURRENT_TIMESTAMP
            WHERE id = $6
            RETURNING *`;
        const values = [nombre, descripcion, precio, cantidad_stock, id];

        const result = await db.query(query, values);

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar el producto:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Eliminar un producto
async function eliminarProducto(req, res) {
    const { id } = req.params;

    try {
        // Verificar si el producto existe
        const checkQuery = 'SELECT * FROM productos WHERE id = $1';
        const checkResult = await db.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Eliminar el producto
        const deleteQuery = 'DELETE FROM productos WHERE id = $1 RETURNING *';
        const result = await db.query(deleteQuery, [id]);

        res.status(200).json({ message: 'Producto eliminado con éxito', producto: result.rows[0] });
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Consultar el stock de un producto
async function consultarStock(req, res) {
    const { id } = req.params;

    try {
        // Verificar si el inventario existe para el producto
        const query = 'SELECT cantidad_stock FROM productos WHERE id = $1';
        const result = await db.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({ stock: result.rows[0].cantidad_stock });
    } catch (error) {
        console.error('Error al consultar el stock:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = {
    guardarProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto,
    consultarStock
};
