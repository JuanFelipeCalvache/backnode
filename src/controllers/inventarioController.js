const db = require('../../db');

// Guardar un inventario para un producto
const guardarInventario = async (req, res) => {
    const { cantidad, umbralminimo } = req.body;

    if (umbralminimo === undefined || umbralminimo === null) {
        return res.status(400).json({ error: 'El campo umbralMinimo es obligatorio' });
    }

    try {
        const result = await db.query(
            'INSERT INTO Inventario (cantidad, umbralMinimo) VALUES ($1, $2) RETURNING *',
            [cantidad, umbralminimo]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al guardar el inventario' });
    }
};


// Obtener todos los inventarios
async function obtenerInventarios(req, res) {
    try {
        const query = 'SELECT * FROM Inventario';
        const result = await db.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener los inventarios:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Obtener un inventario por ID
async function obtenerInventarioPorId(req, res) {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM Inventario WHERE id = $1';
        const result = await db.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Inventario no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el inventario:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Actualizar el inventario de un producto
async function actualizarInventario(req, res) {
    const { id } = req.params;
    const { cantidad, umbral_minimo } = req.body;

    try {
        // Verificar si el inventario existe
        const checkQuery = 'SELECT * FROM Inventario WHERE id = $1';
        const checkResult = await db.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Inventario no encontrado' });
        }

        // Actualizar el inventario
        const query = `
            UPDATE Inventario
            SET cantidad = $1, umbralMinimo = $2
            WHERE id = $3
            RETURNING *`;
        const values = [cantidad, umbral_minimo, id];

        const result = await db.query(query, values);

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar el inventario:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Eliminar un inventario por ID
async function eliminarInventario(req, res) {
    const { id } = req.params;

    try {
        // Verificar si el inventario existe
        const checkQuery = 'SELECT * FROM Inventario WHERE id = $1';
        const checkResult = await db.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Inventario no encontrado' });
        }

        // Eliminar el inventario
        const deleteQuery = 'DELETE FROM Inventario WHERE id = $1 RETURNING *';
        const result = await db.query(deleteQuery, [id]);

        res.status(200).json({ message: 'Inventario eliminado con éxito', inventario: result.rows[0] });
    } catch (error) {
        console.error('Error al eliminar el inventario:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = {
    guardarInventario,
    obtenerInventarios,
    obtenerInventarioPorId,
    actualizarInventario,
    eliminarInventario
};
