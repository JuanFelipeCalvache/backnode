const db = require('../../db');
const auth = require('../middleware/auth.js'); // Ajusta la ruta si es necesario


// Agregar un producto al carrito
async function agregarProductoAlCarrito(req, res) {
    const { producto_id, cantidad } = req.body;
    const usuario_id = req.user.id; // Obtén el ID del usuario autenticado

    try {
        // Verificar que el producto exista y que haya suficiente stock
        const producto = await db.query('SELECT * FROM productos WHERE id = $1', [producto_id]);
        if (producto.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        if (producto.rows[0].cantidad_stock < cantidad) {
            return res.status(400).json({ error: 'Stock insuficiente para la cantidad solicitada' });
        }

        // Insertar o actualizar el producto en el carrito
        const query = `
            INSERT INTO carrito (producto_id, cantidad, usuario_id)
            VALUES ($1, $2, $3)
            ON CONFLICT (producto_id, usuario_id)
            DO UPDATE SET cantidad = carrito.cantidad + EXCLUDED.cantidad
            RETURNING *;
        `;
        const result = await db.query(query, [producto_id, cantidad, usuario_id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Ver el carrito del usuario actual
async function verCarrito(req, res) {
    const usuario_id = req.user.id;

    try {
        const query = `
            SELECT c.id, p.nombre, p.precio, c.cantidad, (p.precio * c.cantidad) AS total
            FROM carrito c
            JOIN productos p ON c.producto_id = p.id
            WHERE c.usuario_id = $1;
        `;
        const result = await db.query(query, [usuario_id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Eliminar un producto del carrito
async function eliminarProductoDelCarrito(req, res) {
    const { id } = req.params;
    const usuario_id = req.user.id;

    try {
        const query = 'DELETE FROM carrito WHERE id = $1 AND usuario_id = $2 RETURNING *';
        const result = await db.query(query, [id, usuario_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto en carrito no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado del carrito' });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Completar la venta y actualizar el stock
async function completarVenta(req, res) {
    const usuario_id = req.user.id;

    try {
        // Verificar que todos los productos del carrito tengan suficiente stock
        const carrito = await db.query(`
            SELECT c.id, c.producto_id, c.cantidad, p.cantidad_stock
            FROM carrito c
            JOIN productos p ON c.producto_id = p.id
            WHERE c.usuario_id = $1;
        `, [usuario_id]);

        // Validación de stock
        for (let item of carrito.rows) {
            if (item.cantidad > item.cantidad_stock) {
                return res.status(400).json({ error: `Stock insuficiente para el producto con ID ${item.producto_id}` });
            }
        }

        // Actualizar stock de cada producto
        for (let item of carrito.rows) {
            await db.query(`
                UPDATE productos
                SET cantidad_stock = cantidad_stock - $1
                WHERE id = $2;
            `, [item.cantidad, item.producto_id]);
        }

        // Limpiar el carrito después de la compra
        await db.query('DELETE FROM carrito WHERE usuario_id = $1', [usuario_id]);

        res.status(200).json({ message: 'Venta completada y stock actualizado' });
    } catch (error) {
        console.error('Error al completar la venta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = {
    agregarProductoAlCarrito,
    verCarrito,
    eliminarProductoDelCarrito,
    completarVenta
};
