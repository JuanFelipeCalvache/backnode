const db = require('../../db'); // Asegúrate de que tu conexión a la base de datos esté configurada

// Obtener todos los informes
async function obtenerInformes(req, res) {
    try {
        const query = 'SELECT * FROM informes';
        const result = await db.query(query);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener los informes:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Obtener un informe específico por id_informe
async function obtenerInformePorId(req, res) {
    const { id_informe } = req.params;

    try {
        const query = 'SELECT * FROM informes WHERE id_informe = $1';
        const result = await db.query(query, [id_informe]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Informe no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el informe:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Crear un nuevo informe
async function crearInforme(req, res) {
    const { tipo_informe, descripcion_informe } = req.body;

    try {
        const query = `
            INSERT INTO informes (tipo_informe, descripcion_informe)
            VALUES ($1, $2)
            RETURNING *`; // RETURNING * devuelve los datos insertados
        const values = [tipo_informe, descripcion_informe]; // Valores a insertar

        const result = await db.query(query, values);

        res.status(201).json(result.rows[0]); // Devolvemos el informe creado
    } catch (error) {
        console.error('Error al crear el informe:', error.message, error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = {
    obtenerInformes,
    obtenerInformePorId,
    crearInforme
};
