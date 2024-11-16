// routes/carritoRoutes.js
const express = require('express');
const carritoController = require('../controllers/carritoController');
const authMiddleware = require('../middleware/auth.js'); // Importar el middleware de autenticación
const router = express.Router();

router.post('/agregar', authMiddleware, carritoController.agregarProductoAlCarrito);
router.get('/', authMiddleware, carritoController.verCarrito);
router.delete('/eliminar/:id', authMiddleware, carritoController.eliminarProductoDelCarrito);
router.post('/comprar', authMiddleware, carritoController.completarVenta);

module.exports = router;
