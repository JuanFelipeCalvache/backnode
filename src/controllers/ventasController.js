// backend/controllers/ventaController.js
const db = require('../../db');  // Asumiendo que tienes esta conexión configurada

const registrarVenta = async (req, res) => {
    //return res.send();
    const { cliente_id, productos } = req.body;

    if (!cliente_id) {
        return res.status(400).json({ error: 'El cliente_id es requerido' });
    }

    if (!productos || productos.length === 0) {
        return res.status(400).json({ error: 'No se han enviado productos para la venta' });
    }

    try {
        let totalVenta = 0;
        productos.forEach(producto => {
            totalVenta += producto.cantidad * producto.precio;
        });

        // Mostrar los datos antes de la consulta
        console.log('Datos para la venta:', cliente_id, totalVenta);

        // Registrar venta en la base de datos
        const resultVenta = await db.query(
            'INSERT INTO ventas (cliente_id, total) VALUES ($1, $2) RETURNING id',
            [cliente_id, totalVenta]
        );

        // Mostrar el resultado de la venta
        console.log('Resultado de la venta:', resultVenta);

        const ventaId = resultVenta.rows[0].id;

        // Registrar los productos en detalle_ventas
        for (let producto of productos) {
            const subtotal = producto.cantidad * producto.precio;
            await db.query(
                'INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5)',
                [ventaId, producto.id, producto.cantidad, producto.precio, subtotal]
            );
        }

        res.status(201).json({ mensaje: 'Venta registrada con éxito', ventaId });

    } catch (error) {
        console.error('Error completo al registrar la venta:', error);
        
    }
};


module.exports = {
    registrarVenta
};
