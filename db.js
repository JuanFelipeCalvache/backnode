const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sistemaInventarioBD',
  password: '123456789',
  port: 5432, 
});
//123456789 contraseña vieja
module.exports = {
  query: (text, params) => pool.query(text, params),
};