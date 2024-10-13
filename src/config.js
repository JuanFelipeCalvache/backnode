//variables del sistema

module.exports = {
    //asignar puerto 
    app: {
        port: process.env.PORT || 4000,
    },
    jwtSecret: process.env.JWT_SECRET || 'tu_secreto_aqui'
}