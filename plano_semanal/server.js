const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // altere para seu usuário do MySQL
    password: 'root', // altere para sua senha do MySQL
    database: 'plano_semanal'
});

// Conexão ao banco de dados
db.connect(err => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL!');
});

// Endpoint para obter atividades
app.get('/atividades', (req, res) => {
    db.query('SELECT * FROM plano_atividades', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Endpoint para adicionar uma atividade
app.post('/atividades', (req, res) => {
    const { dia_semana, hora_inicio, hora_fim, tipo_atividade_id, valencia_id } = req.body;
    const sql = 'INSERT INTO plano_atividades (dia_semana, hora_inicio, hora_fim, tipo_atividade_id, valencia_id) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [dia_semana, hora_inicio, hora_fim, tipo_atividade_id, valencia_id], (err, results) => {
        if (err) throw err;
        res.json({ id: results.insertId });
    });
});

// Endpoint para obter tipos de atividades
app.get('/tipos-atividade', (req, res) => {
    db.query('SELECT * FROM tipo_atividades', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Endpoint para obter valências
app.get('/valencias', (req, res) => {
    db.query('SELECT * FROM valencias', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Inicializa o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
