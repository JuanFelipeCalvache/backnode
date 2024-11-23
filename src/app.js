// En app.js

const express = require('express');
const config = require('./config');
const cors = require('cors');
const productoroute = require('./routes/productoRoute')
const userroute = require('./routes/userRouter')
const carritoRoute = require('./routes/carritoRouter')
const ventaRoute = require('./routes/ventaRouter');



const app = express();

/// Configuración
app.set('port', config.app.port);


app.use(cors({
    origin: 'http://localhost:8081',  // Permitir solo este origen
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    credentials: true // Si necesitas enviar cookies o autenticación
}));


// Middleware para permitir el análisis de cuerpo JSON
app.use(express.json());

app.options('*', cors());


app.use('/api/user', userroute);
app.use('/api/producto', productoroute);
app.use('/api/carrito', carritoRoute);
app.use('/api/venta', ventaRoute);







module.exports = app;
