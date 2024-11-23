const db = require('../../../db');
const bcrypt = require('bcryptjs');
const config = require('../../config');

// Controlador para guardar un usuario en la tabla usuarios
async function guardarUsuario(req, res) {
  console.log(req.body); // Imprimir el cuerpo de la solicitud para depuración

  
  const { nombre, correo, password, cedula, telefono, creadoPor, editadoPor, aceptaterminos, rol } = req.body;
  
  
  try {

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);


    // Verificar si el correo ya existe
    const checkQuery = 'SELECT * FROM usuarios WHERE correo = $1';
    const checkResult = await db.query(checkQuery, [correo]);

    

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    


    // Insertar el nuevo usuario
    const query = `INSERT INTO usuarios 
      (nombre, correo, password, cedula, telefono, creadoPor, editadoPor, aceptaterminos, rol) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *`;
    const values = [nombre, correo, hashedPassword, cedula, telefono, creadoPor, editadoPor, aceptaterminos, rol];
    
    const result = await db.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al guardar el usuario:', error.message, error.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


// Controlador para iniciar sesión (Login)
// Controlador para iniciar sesión (Login)
const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan credenciales' });
    }

    // Consulta SQL para encontrar el usuario por email
    const query = 'SELECT * FROM usuarios WHERE correo = $1';
    const result = await db.query(query, [email]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuario = result.rows[0];

    // Verificar la contraseña
    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Si la contraseña es válida, devolver los datos del usuario
    return res.json({
      nombre: usuario.nombre,
      email: usuario.correo,
      id: usuario.id,
    });
  } catch (error) {
    console.error("Error durante el inicio de sesión:", error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};





// Controlador para obtener todos los usuarios de la tabla usuarios
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

async function deleteUser(req, res) {
  const { id } = req.params; // Suponiendo que el ID del usuario se pasa como parámetro en la URL

  try {
    // Verificar si el usuario existe
    const checkQuery = 'SELECT * FROM usuarios WHERE id = $1';
    const checkResult = await db.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Eliminar el usuario
    const deleteQuery = 'DELETE FROM usuarios WHERE id = $1 RETURNING *';
    const deleteResult = await db.query(deleteQuery, [id]);

    if (deleteResult.rows.length === 0) {
      return res.status(500).json({ error: 'Error al eliminar el usuario' });
    }

    // Responder con el usuario eliminado (o un mensaje confirmando la eliminación)
    res.status(200).json({ message: 'Usuario eliminado exitosamente', usuario: deleteResult.rows[0] });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  guardarUsuario,
  obtenerUsuarios,
  loginUsuario,
  deleteUser
};
