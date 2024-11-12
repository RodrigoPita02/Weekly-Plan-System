// routes/schedule.js
const express = require('express');
const router = express.Router();
const db = require('../bd');

// Função auxiliar para combinar data e hora em formato ISO correto
function formatDateToISO(date, time) {
  try {
    const dateString = new Date(date).toISOString().slice(0, 10); // Extrai YYYY-MM-DD
    return `${dateString}T${time}`; // Concatena com o tempo para ISO-8601 sem timezone
  } catch (error) {
    console.error(`Erro ao formatar a data ${date} e hora ${time} para ISO`, error);
    return null;
  }
}

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

// Rota para obter todas as atividades agendadas
router.get('/atividades', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.id, p.data, p.hora_inicio, p.hora_fim,
             p.tipo_atividade_id, p.valencia_id,  -- Incluímos estes campos para uso no front-end
             p.grupo_repeticao, t.descricao AS tipo_atividade, v.descricao AS valencia, v.cor AS cor
      FROM plano_atividades p
      JOIN tipo_atividades t ON p.tipo_atividade_id = t.id
      JOIN valencias v ON p.valencia_id = v.id
    `);

    const eventos = rows.map((atividade) => {
      const start = formatDateToISO(atividade.data, atividade.hora_inicio);
      const end = formatDateToISO(atividade.data, atividade.hora_fim);

      // Log para confirmar a formatação correta dos eventos antes de enviar ao FullCalendar
      console.log('Evento formatado para FullCalendar:', {
        id: atividade.id,
        title: `${atividade.tipo_atividade} (${atividade.valencia})`,
        start,
        end,
        color: atividade.cor,
        grupo_repeticao: atividade.grupo_repeticao,
        tipo_atividade_id: atividade.tipo_atividade_id,  // Confirmação do novo campo
        valencia_id: atividade.valencia_id  // Confirmação do novo campo
      });

      return {
        id: atividade.id,
        title: `${atividade.tipo_atividade} (${atividade.valencia})`,
        start,
        end,
        color: atividade.cor,
        grupo_repeticao: atividade.grupo_repeticao,
        tipo_atividade_id: atividade.tipo_atividade_id,  // Adicionamos ao retorno
        valencia_id: atividade.valencia_id  // Adicionamos ao retorno
      };
    });

    res.json(eventos);
  } catch (error) {
    console.error('Erro ao buscar atividades:', error);
    res.status(500).send('Erro ao buscar atividades');
  }
});

// Rota para adicionar uma nova atividade
router.post('/atividades', async (req, res) => {
  const { data, hora_inicio, hora_fim, tipo_atividade_id, valencia_id, grupo_repeticao } = req.body;

  try {
    await db.query(`
      INSERT INTO plano_atividades (data, hora_inicio, hora_fim, tipo_atividade_id, valencia_id, grupo_repeticao) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, [data, hora_inicio, hora_fim, tipo_atividade_id, valencia_id, grupo_repeticao]);
    res.status(201).send('Atividade adicionada com sucesso');
  } catch (error) {
    res.status(500).send('Erro ao adicionar atividade');
  }
});

// Atualizar uma atividade e seu grupo

router.put('/atividades/:id', async (req, res) => {
  const { id } = req.params;
  const { data, hora_inicio, hora_fim, tipo_atividade_id, valencia_id, grupo_repeticao } = req.body;

  try {
    // Verifica se a atividade é parte de um grupo repetido
    const query = grupo_repeticao
      ? `UPDATE plano_atividades SET hora_inicio = ?, hora_fim = ?, tipo_atividade_id = ?, valencia_id = ? WHERE grupo_repeticao = ?`
      : `UPDATE plano_atividades SET data = ?, hora_inicio = ?, hora_fim = ?, tipo_atividade_id = ?, valencia_id = ? WHERE id = ?`;

    const params = grupo_repeticao
      ? [hora_inicio, hora_fim, tipo_atividade_id, valencia_id, grupo_repeticao]
      : [data, hora_inicio, hora_fim, tipo_atividade_id, valencia_id, id];

    const [result] = await db.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).send('Atividade não encontrada');
    }

    res.send('Atividade atualizada com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar atividade:', error);
    res.status(500).send('Erro ao atualizar atividade');
  }
});

// Excluir uma atividade e seu grupo
router.delete('/atividades/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(`SELECT grupo_repeticao FROM plano_atividades WHERE id = ?`, [id]);
    const grupoRepeticao = result[0]?.grupo_repeticao;

    const deleteQuery = grupoRepeticao
      ? `DELETE FROM plano_atividades WHERE grupo_repeticao = ?`
      : `DELETE FROM plano_atividades WHERE id = ?`;

    const params = grupoRepeticao ? [grupoRepeticao] : [id];
    await db.query(deleteQuery, params);

    res.send('Atividade excluída com sucesso');
  } catch (error) {
    res.status(500).send('Erro ao excluir atividade');
  }
});

// Rota para excluir todas as atividades de um grupo de repetição
router.delete('/atividades/grupo/:grupoRepeticao', async (req, res) => {
  const { grupoRepeticao } = req.params;

  try {
    // Deleta todas as atividades que têm o mesmo grupo de repetição
    const [result] = await db.query(`DELETE FROM plano_atividades WHERE grupo_repeticao = ?`, [grupoRepeticao]);

    if (result.affectedRows === 0) {
      return res.status(404).send('Nenhuma atividade encontrada para o grupo de repetição especificado');
    }

    res.send('Todas as atividades do grupo de repetição foram excluídas com sucesso');
  } catch (error) {
    console.error('Erro ao excluir atividades do grupo de repetição:', error);
    res.status(500).send('Erro ao excluir atividades do grupo de repetição');
  }
});

module.exports = router;
