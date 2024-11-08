document.addEventListener('DOMContentLoaded', async function() {
  const calendarEl = document.getElementById('calendar');
  const form = document.getElementById('scheduleForm');

  // Função para popular dropdown de tipos de atividades
  async function populateTipoAtividade() {
    const response = await fetch('/api/tipo_atividades');
    const tipos = await response.json();
    const tipoAtividadeSelect = document.getElementById('tipoAtividadeId');
    tipos.forEach(tipo => {
      const option = document.createElement('option');
      option.value = tipo.id;
      option.textContent = tipo.descricao;
      tipoAtividadeSelect.appendChild(option);
    });
  }

  // Função para popular dropdown de valências
  async function populateValencia() {
    const response = await fetch('/api/valencias');
    const valencias = await response.json();
    const valenciaSelect = document.getElementById('valenciaId');
    valencias.forEach(valencia => {
      const option = document.createElement('option');
      option.value = valencia.id;
      option.textContent = valencia.descricao;
      valenciaSelect.appendChild(option);
    });
  }

  // Carregar dados de dropdowns
  await populateTipoAtividade();
  await populateValencia();

  // Configuração do calendário
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    slotMinTime: "08:00:00",
    slotMaxTime: "20:00:00",
    locale: 'pt-br',
    events: '/api/atividades'
  });

  calendar.render();

  // Submissão do formulário
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const atividade = {
      dia_semana: document.getElementById('diaSemana').value,
      hora_inicio: document.getElementById('horaInicio').value,
      hora_fim: document.getElementById('horaFim').value,
      tipo_atividade_id: document.getElementById('tipoAtividadeId').value,
      valencia_id: document.getElementById('valenciaId').value
    };

    await fetch('/api/atividades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(atividade)
    });

    calendar.refetchEvents();
  });
});