const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // substitua pelo seu usuário
    password: 'root', // substitua pela sua senha
    database: 'plano_semanal',
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado ao MySQL!');
});

// Endpoint para obter tipos de atividades
app.get('/api/tipos-atividade', (req, res) => {
    db.query('SELECT * FROM tipo_atividades', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Endpoint para obter valências
app.get('/api/valencias', (req, res) => {
    db.query('SELECT * FROM valencias', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Endpoint para criar nova atividade
app.post('/api/atividades', (req, res) => {
    const { dia_semana, hora_inicio, hora_fim, tipo_atividade_id, valencia_id } = req.body;
    db.query('INSERT INTO plano_atividades (dia_semana, hora_inicio, hora_fim, tipo_atividade_id, valencia_id) VALUES (?, ?, ?, ?, ?)', [dia_semana, hora_inicio, hora_fim, tipo_atividade_id, valencia_id], (err, results) => {
        if (err) throw err;
        res.json({ id: results.insertId, dia_semana, hora_inicio, hora_fim, tipo_atividade_id, valencia_id });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
