const express = require('express'); // Importa o framework Express, que é uma biblioteca que facilita criar servidores HTTP. 
const app = express(); // Cria o servidor(app), onde vamos criar rotas.
const db = require('./db'); // Procura um arquivo db.js que está na mesma pasta de index.js
const cors = require('cors');

app.use(cors()); // Libera a comunicação entre portas diferentes do backend e frontend
app.use(express.json()); // Transforma as requisições json(post, put) em objeto javascript. 

// rotas
const authorsRoutes = require('./routes/authors');
app.use('/authors', authorsRoutes);

const booksRoutes = require('./routes/books');
app.use('/books', booksRoutes);


app.get('/', (req, res) => { // Cria uma rota GET na URL base /, acessando o site do localhost, a API responde "API Funcionando".
    res.send('API Funcionando');
});

app.listen(3000, () => { // Inicia o servidor na porta 3000. A função dentro do () é chamada quando o servidor inicia com sucesso e é mostrada no terminal.
    console.log('Servidor rodando na porta 3000')
});


