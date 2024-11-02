// En router.js
const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController.js');


//producto
router.post('/Guardaproducto', productoController.guardarProducto);
router.get('/productos', productoController.obtenerProductos);
router.get('/productos/:id', productoController.obtenerProductoPorId);
router.put('/productos/:id', productoController.actualizarProducto);
router.delete('/productos/:id', productoController.eliminarProducto);
router.get('/productos/:id/stock', productoController.consultarStock);


module.exports = router;
