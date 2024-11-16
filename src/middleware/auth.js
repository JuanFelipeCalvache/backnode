// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization'); // Espera el token en el encabezado 'Authorization'
    
    if (!token) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    try {
        // Decodificar el token usando la clave secreta
        const decoded = jwt.verify(token, 'tu-clave-secreta'); // Usa tu clave secreta aquí
        req.user = decoded.user; // El 'user' será el payload del JWT
        next(); // Llamar al siguiente middleware o controlador
    } catch (error) {
        res.status(401).json({ error: 'Token no válido' });
    }
};
