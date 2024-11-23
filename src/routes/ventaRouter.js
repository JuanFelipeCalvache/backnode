// backend/ventaRouter.js
const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventasController');

// Enlazar la ruta con el controlador
router.post('/venta', ventaController.registrarVenta );

module.exports = router;
