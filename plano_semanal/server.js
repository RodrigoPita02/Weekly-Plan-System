// server.js
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração da conexão MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',   // Substitua pelo seu usuário
    password: 'root', // Substitua pela sua senha
    database: 'plano_semanal'
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados MySQL');
    }
});

// Rota para buscar tipos de atividades
app.get('/api/tipo-atividades', (req, res) => {
    db.query('SELECT id, descricao FROM tipo_atividades', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Rota para buscar valências
app.get('/api/valencias', (req, res) => {
    db.query('SELECT id, descricao FROM valencias', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
