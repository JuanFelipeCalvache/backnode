const db = require('../../db'); // Asegúrate de que tu conexión a la base de datos esté configurada

// Guardar los detalles de la venta
async function guardarVenta(req, res) {
    console.log(req.body); // Para depurar y ver qué datos llegan en el cuerpo de la solicitud

    const { id_usuario, total,productos } = req.body;

    try {
        // Iniciar una transacción para asegurar que tanto la venta como los detalles se guarden correctamente
        await db.query('BEGIN'); // Comienza la transacción

        // Primero insertamos la venta en la tabla 'ventas'
        const queryVenta = `
            INSERT INTO ventas (id_usuario, total)
            VALUES ($1, $2)
            RETURNING id`; // Obtener el ID de la venta recién creada
        const valuesVenta = [id_usuario, total];

        const resultVenta = await db.query(queryVenta, valuesVenta);

        // Obtenemos el ID de la venta recién creada
        const idVenta = resultVenta.rows[0].id;

        // Luego insertamos los detalles de la venta en la tabla 'detalles_venta'
        const queryDetalle = `
            INSERT INTO detalles_venta (id_venta, id_producto, cantidad, precio_unitario, total)
            VALUES ($1, $2, $3, $4, $5)`;

        for (let producto of productos) {
            // Verificar si el producto tiene los campos necesarios
            const { id_producto, cantidad, precio_unitario } = producto;

            if (cantidad == null || isNaN(cantidad) || cantidad <= 0) {
                console.error('Cantidad inválida para el producto', producto);
                continue; // Si la cantidad no es válida, saltar este producto
            }

            const totalProducto = cantidad * precio_unitario;

            const valuesDetalle = [idVenta, id_producto, cantidad, precio_unitario, totalProducto];

            // Insertamos cada detalle de venta
            await db.query(queryDetalle, valuesDetalle);
        }

        // Si todo fue exitoso, confirmamos la transacción
        await db.query('COMMIT'); // Confirmar transacción

        // Respondemos con la venta y sus detalles
        res.status(201).json({
            mensaje: 'Venta y detalles guardados correctamente',
            venta: {
                id: idVenta,
                id_usuario,
                total
            },
            detalles: productos
        });

    } catch (error) {
        // En caso de error, revertimos la transacción
        await db.query('ROLLBACK'); // Revertir transacción
        console.error('Error al guardar la venta:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


// Obtener los detalles de una venta por ID de venta
async function obtenerDetallesVenta(req, res) {
    const { id_venta } = req.params;

    try {
        // Consultar los detalles de la venta usando el ID de venta
        const query = `
            SELECT * 
            FROM detalles_venta
            WHERE id_venta = $1`;
        const result = await db.query(query, [id_venta]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No se encontraron detalles para esta venta' });
        }

        // Enviar los detalles encontrados como respuesta
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener los detalles de la venta:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = {
    guardarVenta,
    obtenerDetallesVenta
};
