// server.js
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Configuração de template engine EJS
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Conexão MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'plano_semanal'
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
  } else {
    console.log('Conectado ao MySQL!');
  }
});

// Rota para carregar o formulário e os dados do plano
app.get('/', (req, res) => {
  const queryAtividades = 'SELECT * FROM tipo_atividades';
  const queryValencias = 'SELECT * FROM valencias';

  db.query(queryAtividades, (err, atividades) => {
    if (err) throw err;
    db.query(queryValencias, (err, valencias) => {
      if (err) throw err;
      res.render('index', { atividades, valencias });
    });
  });
});

// Rota para adicionar novo plano de atividades
app.post('/add-plano', (req, res) => {
  const { dia, inicio, fim, tipo_atividade, valencia } = req.body;
  const query = 'INSERT INTO plano_atividades (dia_semana, hora_inicio, hora_fim, tipo_atividade_id, valencia_id) VALUES (?, ?, ?, ?, ?)';

  db.query(query, [dia, inicio, fim, tipo_atividade, valencia], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Rota para obter os planos de atividades para o calendário
app.get('/plano-semanal', (req, res) => {
  const query = `
    SELECT pa.*, ta.descricao AS tipo_atividade, v.descricao AS valencia
    FROM plano_atividades pa
    JOIN tipo_atividades ta ON pa.tipo_atividade_id = ta.id
    JOIN valencias v ON pa.valencia_id = v.id`;

  db.query(query, (err, planos) => {
    if (err) throw err;
    res.json(planos);
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}/`);
});
