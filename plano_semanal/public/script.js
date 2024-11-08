document.addEventListener('DOMContentLoaded', async function () {
  const calendarEl = document.getElementById('calendar');
  const form = document.getElementById('scheduleForm');
  const editForm = document.getElementById('editForm');
  let currentEventId = null;

  // Função para popular dropdown de tipos de atividades com valor atual
  async function populateTipoAtividade(selectElementId, selectedId = null) {
    const response = await fetch('/api/tipo_atividades');
    const tipos = await response.json();
    const selectElement = document.getElementById(selectElementId);
    selectElement.innerHTML = '';  // Limpar opções existentes

    tipos.forEach(tipo => {
      const option = document.createElement('option');
      option.value = tipo.id;
      option.textContent = tipo.descricao;
      if (selectedId && tipo.id === selectedId) {
        option.selected = true;  // Seleciona a opção correspondente ao valor atual
      }
      selectElement.appendChild(option);
    });
  }

  // Função para popular dropdown de valências com valor atual
  async function populateValencia(selectElementId, selectedId = null) {
    const response = await fetch('/api/valencias');
    const valencias = await response.json();
    const selectElement = document.getElementById(selectElementId);
    selectElement.innerHTML = '';  // Limpar opções existentes

    valencias.forEach(valencia => {
      const option = document.createElement('option');
      option.value = valencia.id;
      option.textContent = valencia.descricao;
      if (selectedId && valencia.id === selectedId) {
        option.selected = true;  // Seleciona a opção correspondente ao valor atual
      }
      selectElement.appendChild(option);
    });
  }

  // Carregar dropdowns para o formulário principal
  await populateTipoAtividade('tipoAtividadeId');  // Formulário principal
  await populateValencia('valenciaId');            // Formulário principal

  // Configuração do calendário com navegação e edição de eventos
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    slotMinTime: "08:00:00",
    slotMaxTime: "20:00:00",
    locale: 'pt-br',
    editable: true,
    events: '/api/atividades',
    eventClick: async function (info) {
      currentEventId = info.event.id;

      // Mapeamento dos dias da semana em inglês para português
      const diasSemanaMap = {
        'Monday': 'Segunda',
        'Tuesday': 'Terça',
        'Wednesday': 'Quarta',
        'Thursday': 'Quinta',
        'Friday': 'Sexta'
      };

      // Obter o dia da semana do evento e mapear para português
      const diaSemana = info.event.start.toLocaleString('en-US', { weekday: 'long' });
      document.getElementById('editDiaSemana').value = diasSemanaMap[diaSemana] || 'Segunda';

      document.getElementById('editHoraInicio').value = info.event.start.toISOString().substring(11, 16);
      document.getElementById('editHoraFim').value = info.event.end.toISOString().substring(11, 16);

      // Preencher os selects de tipo de atividade e valência com o valor atual
      await populateTipoAtividade('editTipoAtividadeId', info.event.extendedProps.tipo_atividade_id);
      await populateValencia('editValenciaId', info.event.extendedProps.valencia_id);

      openEditModal();
    }
  });

  calendar.render();

  // Função para abrir o modal com overlay e evitar duplicação
  function openEditModal() {
    const editModal = document.getElementById('editModal');
    const modalOverlay = document.getElementById('modalOverlay');

    editModal.style.display = 'block';
    modalOverlay.style.display = 'block';
  }

  // Função para fechar o modal e ocultar o overlay
  function closeEditModal() {
    const editModal = document.getElementById('editModal');
    const modalOverlay = document.getElementById('modalOverlay');

    editModal.style.display = 'none';
    modalOverlay.style.display = 'none';
  }

  // Submissão do formulário principal
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const diaSemana = document.getElementById('diaSemana').value;
    const horaInicio = document.getElementById('horaInicio').value;
    const horaFim = document.getElementById('horaFim').value;
    const tipoAtividadeId = document.getElementById('tipoAtividadeId').value;
    const valenciaId = document.getElementById('valenciaId').value;

    if (!diaSemana || !horaInicio || !horaFim || !tipoAtividadeId || !valenciaId) {
      alert('Por favor, preencha todos os campos do formulário.');
      return;
    }

    if (horaInicio >= horaFim) {
      alert('A hora de início deve ser anterior à hora de fim.');
      return;
    }

    const atividade = {
      dia_semana: diaSemana,
      hora_inicio: horaInicio,
      hora_fim: horaFim,
      tipo_atividade_id: tipoAtividadeId,
      valencia_id: valenciaId
    };

    await fetch('/api/atividades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(atividade)
    });

    alert('Atividade salva com sucesso!');
    calendar.refetchEvents();
    form.reset();  // Limpar o formulário após o envio
  });

  // Submissão do formulário de edição com validações
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const diaSemana = document.getElementById('editDiaSemana').value;
    const horaInicio = document.getElementById('editHoraInicio').value;
    const horaFim = document.getElementById('editHoraFim').value;
    const tipoAtividadeId = document.getElementById('editTipoAtividadeId').value;
    const valenciaId = document.getElementById('editValenciaId').value;

    if (!diaSemana || !horaInicio || !horaFim || !tipoAtividadeId || !valenciaId) {
      alert('Por favor, preencha todos os campos do formulário de edição.');
      return;
    }

    if (horaInicio >= horaFim) {
      alert('A hora de início deve ser anterior à hora de fim.');
      return;
    }

    const atividade = {
      dia_semana: diaSemana,
      hora_inicio: horaInicio,
      hora_fim: horaFim,
      tipo_atividade_id: tipoAtividadeId,
      valencia_id: valenciaId
    };

    await fetch(`/api/atividades/${currentEventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(atividade)
    });

    alert('Atividade atualizada com sucesso!');
    calendar.refetchEvents();
    closeEditModal();
  });

  // Exclusão de atividade
  document.getElementById('deleteButton').addEventListener('click', async () => {
    if (confirm('Tem certeza de que deseja excluir esta atividade?')) {
      await fetch(`/api/atividades/${currentEventId}`, { method: 'DELETE' });

      alert('Atividade excluída com sucesso!');
      calendar.refetchEvents();
      closeEditModal();
    }
  });

  // Vincular o evento de clique ao botão "Cancelar" para fechar o modal
  document.getElementById('cancelButton').addEventListener('click', closeEditModal);
});
