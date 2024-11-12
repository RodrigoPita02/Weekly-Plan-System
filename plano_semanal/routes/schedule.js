// routes/schedule.js
const express = require('express');
const router = express.Router();
const db = require('../bd');

// Função auxiliar para extrair a data e formatar para ISO sem timezone
function formatDateToISO(date, time) {
  try {
    // Extrai a data no formato YYYY-MM-DD caso ela já venha em ISO completo
    const dateString = date instanceof Date ? date.toISOString().slice(0, 10) : date.slice(0, 10);
    const dateTimeString = `${dateString}T${time}`;
    const dateObj = new Date(dateTimeString);
    const isoString = dateObj.toISOString().slice(0, 19); // Mantém apenas YYYY-MM-DDTHH:MM:SS

    console.log(`Data formatada para ISO: ${isoString}`);
    return isoString;
  } catch (error) {
    console.error(`Erro ao formatar a data ${date} e hora ${time} para ISO`, error);
    return null;
  }
}

// Rota para obter todas as atividades agendadas
router.get('/atividades', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.id, p.data, p.hora_inicio, p.hora_fim, 
             t.descricao AS tipo_atividade, v.descricao AS valencia, v.cor AS cor
      FROM plano_atividades p
      JOIN tipo_atividades t ON p.tipo_atividade_id = t.id
      JOIN valencias v ON p.valencia_id = v.id
    `);

    const eventos = rows.map((atividade) => {
      const startDate = formatDateToISO(atividade.data, atividade.hora_inicio);
      const endDate = formatDateToISO(atividade.data, atividade.hora_fim);

      if (!startDate || !endDate) {
        console.error('Erro ao formatar datas:', { atividade });
      }

      return {
        id: atividade.id,
        title: `${atividade.tipo_atividade} (${atividade.valencia})`,
        start: startDate,
        end: endDate,
        color: atividade.cor
      };
    });

    console.log('Eventos enviados ao calendário:', eventos);
    res.json(eventos);
  } catch (error) {
    console.error('Erro ao buscar atividades:', error);
    res.status(500).send('Erro ao buscar atividades');
  }
});

// Rota para adicionar uma nova atividade
router.post('/atividades', async (req, res) => {
  const { data, hora_inicio, hora_fim, tipo_atividade_id, valencia_id } = req.body;

  try {
    await db.query(`
      INSERT INTO plano_atividades (data, hora_inicio, hora_fim, tipo_atividade_id, valencia_id) 
      VALUES (?, ?, ?, ?, ?)
    `, [data, hora_inicio, hora_fim, tipo_atividade_id, valencia_id]);

    res.status(201).send('Atividade adicionada com sucesso');
  } catch (error) {
    console.error('Erro ao adicionar atividade:', error);  // Log do erro
    res.status(500).send('Erro ao adicionar atividade');
  }
});

// Rota para obter tipos de atividades
router.get('/tipo_atividades', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, descricao FROM tipo_atividades');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar tipos de atividades:', error);
    res.status(500).send('Erro ao buscar tipos de atividades');
  }
});

// Rota para obter valências
router.get('/valencias', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, descricao FROM valencias');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar valências:', error);
    res.status(500).send('Erro ao buscar valências');
  }
});

// Rota para atualizar uma atividade
router.put('/atividades/:id', async (req, res) => {
  const { id } = req.params;
  const { data, hora_inicio, hora_fim, tipo_atividade_id, valencia_id } = req.body;

  try {
    const [result] = await db.query(`
      UPDATE plano_atividades 
      SET data = ?, hora_inicio = ?, hora_fim = ?, tipo_atividade_id = ?, valencia_id = ? 
      WHERE id = ?
    `, [data, hora_inicio, hora_fim, tipo_atividade_id, valencia_id, id]);

    if (result.affectedRows === 0) {
      return res.status(404).send('Atividade não encontrada');
    }

    res.send('Atividade atualizada com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar atividade:', error);  // Log do erro
    res.status(500).send('Erro ao atualizar atividade');
  }
});

// Rota para excluir uma atividade
router.delete('/atividades/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(`DELETE FROM plano_atividades WHERE id = ?`, [id]);
    res.send('Atividade excluída com sucesso');
  } catch (error) {
    console.error('Erro ao excluir atividade:', error);  // Log do erro
    res.status(500).send('Erro ao excluir atividade');
  }
});

module.exports = router;
