const db = require('../../db'); // Asegúrate de que tu conexión a la base de datos esté configurada

// Controlador para guardar una venta
async function guardarVenta(req, res) {
    console.log(req.body); // Imprimir el cuerpo de la solicitud para depuración

    // Desestructurar los campos del cuerpo de la solicitud
    const { id_usuario, total} = req.body;

    try {
        // Definir la consulta de inserción
        const query = `
            INSERT INTO ventas (id_usuario, total)
            VALUES ($1, $2)
            RETURNING *`; // RETURNING * devuelve los datos insertados
        const values = [id_usuario, total]; // Valores a insertar

        // Ejecutar la consulta de inserción
        const result = await db.query(query, values);

        // Enviar la venta creada como respuesta
        res.status(201).json(result.rows[0]); // Enviar la fila recién insertada
    } catch (error) {
        console.error('Error al guardar la venta:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


// Obtener todas las ventas
async function obtenerVentas(req, res) {
    try {
        const query = 'SELECT * FROM ventas';
        const result = await db.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener las ventas:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Obtener una venta por ID
async function obtenerVentaPorId(req, res) {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM ventas WHERE id = $1';
        const result = await db.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener la venta:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Actualizar una venta
async function actualizarVenta(req, res) {
    const { id } = req.params;
    const { id_usuario, total, editadopor } = req.body;

    try {
        // Verificar si la venta existe
        const checkQuery = 'SELECT * FROM ventas WHERE id = $1';
        const checkResult = await db.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        // Actualizar la venta
        const query = `
            UPDATE ventas
            SET id_usuario = $1, total = $2, fechaedicion = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING *`;
        const values = [id_usuario, total, editadopor, id];

        const result = await db.query(query, values);

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar la venta:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Eliminar una venta
async function eliminarVenta(req, res) {
    const { id } = req.params;

    try {
        // Verificar si la venta existe
        const checkQuery = 'SELECT * FROM ventas WHERE id = $1';
        const checkResult = await db.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        // Eliminar la venta
        const deleteQuery = 'DELETE FROM ventas WHERE id = $1 RETURNING *';
        const result = await db.query(deleteQuery, [id]);

        res.status(200).json({ message: 'Venta eliminada con éxito', venta: result.rows[0] });
    } catch (error) {
        console.error('Error al eliminar la venta:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = {
    guardarVenta,
    obtenerVentas,
    obtenerVentaPorId,
    actualizarVenta,
    eliminarVenta
};
