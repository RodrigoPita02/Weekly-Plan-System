// routes/schedule.js
const express = require('express');
const router = express.Router();
const db = require('../bd');

// Rota para obter todas as atividades agendadas
router.get('/atividades', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.id, p.dia_semana, p.hora_inicio, p.hora_fim, 
             t.descricao AS tipo_atividade, v.descricao AS valencia
      FROM plano_atividades p
      JOIN tipo_atividades t ON p.tipo_atividade_id = t.id
      JOIN valencias v ON p.valencia_id = v.id
    `);

    const eventos = rows.map((atividade) => {
      const diasSemana = {
        'Segunda': '2024-11-04', // Exemplo de mapeamento estático (para simplificar)
        'Terça': '2024-11-05',
        'Quarta': '2024-11-06',
        'Quinta': '2024-11-07',
        'Sexta': '2024-11-08'
      };

      const startDate = `${diasSemana[atividade.dia_semana]}T${atividade.hora_inicio}`;
      const endDate = `${diasSemana[atividade.dia_semana]}T${atividade.hora_fim}`;

      return {
        id: atividade.id,
        title: `${atividade.tipo_atividade} (${atividade.valencia})`,
        start: startDate,
        end: endDate
      };
    });
    res.json(eventos);
  } catch (error) {
    res.status(500).send('Erro ao buscar atividades');
  }
});

// Rota para adicionar uma nova atividade
router.post('/atividades', async (req, res) => {
  const { dia_semana, hora_inicio, hora_fim, tipo_atividade_id, valencia_id } = req.body;

  try {
    await db.query(`
      INSERT INTO plano_atividades (dia_semana, hora_inicio, hora_fim, tipo_atividade_id, valencia_id) 
      VALUES (?, ?, ?, ?, ?)
    `, [dia_semana, hora_inicio, hora_fim, tipo_atividade_id, valencia_id]);
    res.status(201).send('Atividade adicionada com sucesso');
  } catch (error) {
    res.status(500).send('Erro ao adicionar atividade');
  }
});

// Rota para obter tipos de atividades
router.get('/tipo_atividades', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, descricao FROM tipo_atividades');
    res.json(rows);
  } catch (error) {
    res.status(500).send('Erro ao buscar tipos de atividades');
  }
});

// Rota para obter valências
router.get('/valencias', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, descricao FROM valencias');
    res.json(rows);
  } catch (error) {
    res.status(500).send('Erro ao buscar valências');
  }
});


module.exports = router;
