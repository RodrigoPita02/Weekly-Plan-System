document.addEventListener('DOMContentLoaded', async function () {
  const calendarEl = document.getElementById('calendar');
  const form = document.getElementById('scheduleForm');
  const editForm = document.getElementById('editForm');
  let currentEventId = null;

  // Função para popular dropdown de tipos de atividades com valor selecionado
  async function populateTipoAtividade(selectElementId, selectedId = null) {
    const response = await fetch('/api/tipo_atividades');
    const tipos = await response.json();
    const selectElement = document.getElementById(selectElementId);
    selectElement.innerHTML = '<option value="" disabled>Selecione um tipo de atividade</option>'; // Reset

    tipos.forEach(tipo => {
      const option = document.createElement('option');
      option.value = tipo.id;
      option.textContent = tipo.descricao;

      if (selectedId && parseInt(tipo.id) === parseInt(selectedId)) {
        option.selected = true; // Seleciona a opção correta ao editar
      }
      selectElement.appendChild(option);
    });

    // Forçar seleção se selectedId foi passado
    if (selectedId) {
      selectElement.value = selectedId;
    }
  }

  // Função para popular dropdown de valências com valor selecionado
  async function populateValencia(selectElementId, selectedId = null) {
    const response = await fetch('/api/valencias');
    const valencias = await response.json();
    const selectElement = document.getElementById(selectElementId);
    selectElement.innerHTML = '<option value="" disabled>Selecione uma valência</option>'; // Reset

    valencias.forEach(valencia => {
      const option = document.createElement('option');
      option.value = valencia.id;
      option.textContent = valencia.descricao;

      if (selectedId && parseInt(valencia.id) === parseInt(selectedId)) {
        option.selected = true; // Seleciona a opção correta ao editar
      }
      selectElement.appendChild(option);
    });

    // Forçar seleção se selectedId foi passado
    if (selectedId) {
      selectElement.value = selectedId;
    }
  }

  // Carregar dropdowns para o formulário principal (sem valor selecionado)
  await populateTipoAtividade('tipoAtividadeId');  // Formulário principal
  await populateValencia('valenciaId');            // Formulário principal

  // Configuração do calendário com navegação e edição de eventos
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    slotMinTime: "08:00:00",
    slotMaxTime: "21:00:00",
    nowIndicator: true,
    locale: 'pt-br',
    editable: true,
    events: '/api/atividades',
    
    eventDidMount: function(info) {
      // Log para depuração dos eventos carregados no calendário
      console.log('Evento renderizado no calendário:', info.event);
    },
    
    eventClick: async function (info) {
      currentEventId = info.event.id;

      // Preencher data, horário de início e fim no modal de edição
      document.getElementById('editData').value = info.event.start.toISOString().split('T')[0];
      document.getElementById('editHoraInicio').value = info.event.start.toISOString().substring(11, 16);
      document.getElementById('editHoraFim').value = info.event.end.toISOString().substring(11, 16);

      // Preencher os selects de tipo de atividade e valência com os valores da atividade atual
      await populateTipoAtividade('editTipoAtividadeId', info.event.extendedProps.tipo_atividade_id);
      await populateValencia('editValenciaId', info.event.extendedProps.valencia_id);

      openEditModal();
    }
  });

  calendar.render();

  // Abrir e fechar o modal
  function openEditModal() {
    document.getElementById('editModal').style.display = 'block';
    document.getElementById('modalOverlay').style.display = 'block';
  }

  function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('modalOverlay').style.display = 'none';
  }

  // Vincular o evento de clique ao botão "Cancelar"
  document.getElementById('cancelButton').addEventListener('click', closeEditModal);

  // Submissão do formulário principal
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = document.getElementById('data').value;
    const horaInicio = document.getElementById('horaInicio').value;
    const horaFim = document.getElementById('horaFim').value;
    const tipoAtividadeId = document.getElementById('tipoAtividadeId').value;
    const valenciaId = document.getElementById('valenciaId').value;

    if (!data || !horaInicio || !horaFim || !tipoAtividadeId || !valenciaId) {
      alert('Por favor, preencha todos os campos do formulário.');
      return;
    }

    if (horaInicio >= horaFim) {
      alert('A hora de início deve ser anterior à hora de fim.');
      return;
    }

    const atividade = {
      data,
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

    const data = document.getElementById('editData').value;
    const horaInicio = document.getElementById('editHoraInicio').value;
    const horaFim = document.getElementById('editHoraFim').value;
    const tipoAtividadeId = document.getElementById('editTipoAtividadeId').value;
    const valenciaId = document.getElementById('editValenciaId').value;

    if (!data || !horaInicio || !horaFim || !tipoAtividadeId || !valenciaId) {
      alert('Por favor, preencha todos os campos do formulário de edição.');
      return;
    }

    if (horaInicio >= horaFim) {
      alert('A hora de início deve ser anterior à hora de fim.');
      return;
    }

    const atividade = {
      data,
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
});
