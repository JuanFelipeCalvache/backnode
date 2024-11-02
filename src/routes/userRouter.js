//const config = require('./config');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController/userController.js');


// Rutas
router.post('/usuarios', userController.guardarUsuario);
router.get('/usuarios', userController.obtenerUsuarios);
router.post('/loginUser', userController.loginUsuario);
router.delete('/usuarios/:id', userController.deleteUser); // Eliminar usuario por ID


module.exports = router;
