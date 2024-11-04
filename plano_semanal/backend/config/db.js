const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // seu usuário do MySQL
    password: 'root', // sua senha do MySQL
    database: 'plano_semanal'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL!');
});

module.exports = connection;
