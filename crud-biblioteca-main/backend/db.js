const mysql = require('mysql2'); // Importa a biblioteca mysql2

const connection = mysql.createConnection({ // Cria a conexão com o host, user, password, database e port
    host: 'localhost',
    user: 'root',
    password: 'Scfcamor@123',
    database: 'biblioteca_db',
    port: 3306

});

connection.connect((err) => { // Testa se a conexão funciona
    if (err) {
        console.error('Erro ao conectar ao MySQL', err);
        return;
    }
    console.log('Conectado ao MySQL!');
});

module.exports = connection; // Permite usar a conexão em outros arquivos (como authors.js, books.js, etc).

