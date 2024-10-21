// En app.js

const express = require('express');
const config = require('./config');
const cors = require('cors');
const userController = require('./controllers/userController/userController');
const productoController = require('./controllers/productoController');
const detalleVenta = require('./controllers/detalleVentaController')
const venta= require('./controllers/ventaController');
const informes = require('./controllers/informeController');
const stock = require('./controllers/stockController');

const app = express();

/// Configuración
app.set('port', config.app.port);

app.use(cors());
// Middleware para permitir el análisis de cuerpo JSON
app.use(express.json());

// Rutas
app.post('/usuarios', userController.guardarUsuario);
app.get('/usuarios', userController.obtenerUsuarios);
app.post('/loginUser', userController.loginUsuario);
app.delete('/usuarios/:id', userController.deleteUser); // Eliminar usuario por ID


//producto
// Ruta para guardar un producto
app.post('/Guardaproducto', productoController.guardarProducto);
// Ruta para obtener todos los productos
app.get('/productos', productoController.obtenerProductos);
// Ruta para obtener un producto por ID
app.get('/productos/:id', productoController.obtenerProductoPorId);
// Ruta para actualizar un producto
app.put('/productos/:id', productoController.actualizarProducto);
// Ruta para eliminar un producto
app.delete('/productos/:id', productoController.eliminarProducto);
// Ruta para consultar el stock de un producto
app.get('/productos/:id/stock', productoController.consultarStock);

//ventas
// Ruta para guardar una venta
app.post('/hacerventa', venta.guardarVenta);
// Ruta para obtener todas las ventas
app.get('/ventas', venta.obtenerVentas);
// Ruta para obtener una venta por ID
app.get('/ventas/:id', venta.obtenerVentaPorId);
// Ruta para actualizar una venta
app.put('/ventas/:id', venta.actualizarVenta);
// Ruta para eliminar una venta
app.delete('/ventas/:id', venta.eliminarVenta);

//detalle Venta
// Ruta para guardar un detalle de venta
app.post('/detalles_venta', detalleVenta.guardarVenta);
// Ruta para obtener los detalles de una venta por ID de venta
app.get('/detalles_venta/:id_venta', detalleVenta.obtenerDetallesVenta);


//informes
// Ruta para obtener todos los informes
app.get('/informes', informes.obtenerInformes);
// Ruta para obtener un informe específico por id_informe
app.get('/informes/:id_informe', informes.obtenerInformePorId);
// Ruta para crear un nuevo informe
app.post('/informes', informes.crearInforme);

//stock
// Ruta para obtener todo el historial de stock
app.get('/historial-stock', stock.obtenerHistorialStock);
// Ruta para obtener el historial de un producto específico
app.get('/historial-stock/:id_producto', stock.obtenerHistorialPorProducto);
// Ruta para registrar un nuevo movimiento de stock
app.post('/historial-stock', stock.registrarMovimientoStock);


module.exports = app;
