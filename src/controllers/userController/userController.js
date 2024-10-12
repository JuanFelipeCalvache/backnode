// userController.js

const db = require('../../../db');

// Controlador para guardar un usuario en la tabla user
async function guardarUsuario(req, res) {
  const { nombre, correo, password, cedula, telefono, creadoPor, editadoPor } = req.body;
  try {
    // Verificar si el correo ya existe
    const checkQuery = 'SELECT * FROM usuarios WHERE correo = $1';
    const checkResult = await db.query(checkQuery, [correo]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Insertar el nuevo usuario
    const query = 'INSERT INTO usuarios (nombre, correo, password, cedula, telefono, creadoPor, editadoPor) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [nombre, correo, password, cedula, telefono, creadoPor, editadoPor];
    const result = await db.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al guardar el usuario:', error.message, error.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// Controlador para obtener todos los usuarios de la tabla user
async function obtenerUsuarios(req, res) {
  try {
    const query = 'SELECT * FROM usuarios';
    const result = await db.query(query);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  guardarUsuario,
  obtenerUsuarios,
};
