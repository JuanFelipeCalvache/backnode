const db = require('../../db'); // Asegúrate de que tu conexión a la base de datos esté configurada

// Obtener todo el historial de stock
async function obtenerHistorialStock(req, res) {
    try {
        const query = 'SELECT * FROM historial_stock';
        const result = await db.query(query);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener el historial de stock:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Obtener el historial de un producto específico
async function obtenerHistorialPorProducto(req, res) {
    const { id_producto } = req.params;

    try {
        const query = 'SELECT * FROM historial_stock WHERE id_producto = $1';
        const result = await db.query(query, [id_producto]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No se encontraron movimientos para este producto' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener el historial del producto:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Registrar un nuevo movimiento de stock
async function registrarMovimientoStock(req, res) {
    const { id_producto, cantidad, tipo_movimiento, descripcion } = req.body;

    // Verificar que tipo_movimiento sea "entrada" o "salida"
    if (!['entrada', 'salida'].includes(tipo_movimiento)) {
        return res.status(400).json({ error: 'Tipo de movimiento debe ser "entrada" o "salida"' });
    }

    try {
        const query = `
            INSERT INTO historial_stock (id_producto, cantidad, tipo_movimiento, descripcion)
            VALUES ($1, $2, $3, $4)
            RETURNING *`; // RETURNING * devuelve los datos insertados
        const values = [id_producto, cantidad, tipo_movimiento, descripcion];

        const result = await db.query(query, values);

        res.status(201).json(result.rows[0]); // Devolvemos el movimiento de stock creado
    } catch (error) {
        console.error('Error al registrar el movimiento de stock:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = {
    obtenerHistorialStock,
    obtenerHistorialPorProducto,
    registrarMovimientoStock
};
