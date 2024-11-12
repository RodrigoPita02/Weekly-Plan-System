document.addEventListener('DOMContentLoaded', async function () {
  const calendarEl = document.getElementById('calendar');
  const form = document.getElementById('scheduleForm');
  const editForm = document.getElementById('editForm');
  const toggleFormButton = document.getElementById('toggleFormButton');
  const repeatWeeklyCheckbox = document.getElementById('repeatWeekly');
  let currentEventId = null;
  let currentGroupId = null;

  // Função para gerar um identificador único para o grupo de repetição
  function generateGroupId() {
    return 'grupo_' + Math.random().toString(36).substr(2, 9);
  }

  // Alternar a exibição do formulário
  toggleFormButton.addEventListener('click', () => {
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    toggleFormButton.textContent = form.style.display === 'none'
      ? 'Adicionar Nova Atividade'
      : 'Ocultar Formulário';
  });

  // Função para popular dropdown de tipos de atividades
  async function populateTipoAtividade(selectElementId, selectedId = null) {
    const response = await fetch('/api/tipo_atividades');
    const tipos = await response.json();
    const selectElement = document.getElementById(selectElementId);
    selectElement.innerHTML = '<option value="" disabled>Selecione um tipo de atividade</option>';

    tipos.forEach(tipo => {
      const option = document.createElement('option');
      option.value = tipo.id;
      option.textContent = tipo.descricao;

      if (selectedId && parseInt(tipo.id) === parseInt(selectedId)) {
        option.selected = true;
      }
      selectElement.appendChild(option);
    });
    if (selectedId) {
      selectElement.value = selectedId;
    }
  }

  // Função para popular dropdown de valências
  async function populateValencia(selectElementId, selectedId = null) {
    const response = await fetch('/api/valencias');
    const valencias = await response.json();
    const selectElement = document.getElementById(selectElementId);
    selectElement.innerHTML = '<option value="" disabled>Selecione uma valência</option>';

    valencias.forEach(valencia => {
      const option = document.createElement('option');
      option.value = valencia.id;
      option.textContent = valencia.descricao;

      if (selectedId && parseInt(valencia.id) === parseInt(selectedId)) {
        option.selected = true;
      }
      selectElement.appendChild(option);
    });
    if (selectedId) {
      selectElement.value = selectedId;
    }
  }

  await populateTipoAtividade('tipoAtividadeId');
  await populateValencia('valenciaId');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    slotMinTime: "08:00:00",
    slotMaxTime: "21:00:00",
    nowIndicator: true,
    locale: 'pt-br',
    editable: true,
    events: '/api/atividades',
    eventClick: async function (info) {
      currentEventId = info.event.id;
      currentGroupId = info.event.extendedProps.grupo_repeticao || null;

      document.getElementById('editData').value = info.event.start.toISOString().split('T')[0];
      document.getElementById('editHoraInicio').value = info.event.start.toISOString().substring(11, 16);
      document.getElementById('editHoraFim').value = info.event.end.toISOString().substring(11, 16);

      await populateTipoAtividade('editTipoAtividadeId', info.event.extendedProps.tipo_atividade_id);
      await populateValencia('editValenciaId', info.event.extendedProps.valencia_id);

      openEditModal();
    },
    eventContent: function(arg) {
      const { event } = arg;
      const tipoAtividade = event.extendedProps.tipo_atividade || '';
      const horaInicio = event.start.toISOString().substring(11, 16);
      const horaFim = event.end.toISOString().substring(11, 16);
    
      const customContent = `
        <div class="event-content" style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; text-align: center;">
          <div class="event-title" style="font-size: 1.1rem;">
            ${event.title}
          </div>
          <div class="event-type" style="font-size: 1rem; color: #264653;">
            ${tipoAtividade}
          </div>
          <div class="event-time" style="font-size: 1.2rem; color: white;">
            ${horaInicio} - ${horaFim}
          </div>
        </div>
      `;
    
      return { html: customContent };
    }    
  });

  calendar.render();

  // Função para adicionar datas semanais até o final do mês
  function getWeeklyDates(startDate) {
    const dates = [];
    let currentDate = new Date(startDate);
    const month = currentDate.getMonth();

    while (currentDate.getMonth() === month) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 7);
    }
    return dates;
  }

  // Abrir e fechar o modal
  function openEditModal() {
    document.getElementById('editModal').style.display = 'block';
    document.getElementById('modalOverlay').style.display = 'block';
  }

  function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('modalOverlay').style.display = 'none';
  }

  // Vincular o botão "Cancelar" ao fechamento do modal
  document.getElementById('cancelButton').addEventListener('click', closeEditModal);

  // Submissão do formulário principal
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = document.getElementById('data').value;
    const horaInicio = document.getElementById('horaInicio').value;
    const horaFim = document.getElementById('horaFim').value;
    const tipoAtividadeId = document.getElementById('tipoAtividadeId').value;
    const valenciaId = document.getElementById('valenciaId').value;
    const repeatWeekly = repeatWeeklyCheckbox.checked;

    if (!data || !horaInicio || !horaFim || !tipoAtividadeId || !valenciaId) {
      alert('Por favor, preencha todos os campos do formulário.');
      return;
    }

    if (horaInicio >= horaFim) {
      alert('A hora de início deve ser anterior à hora de fim.');
      return;
    }

    const atividadeBase = {
      hora_inicio: horaInicio,
      hora_fim: horaFim,
      tipo_atividade_id: tipoAtividadeId,
      valencia_id: valenciaId
    };

    const groupId = repeatWeekly ? generateGroupId() : null;
    const datasParaInserir = repeatWeekly ? getWeeklyDates(data) : [new Date(data)];

    for (const date of datasParaInserir) {
      atividadeBase.data = date.toISOString().split('T')[0];
      atividadeBase.grupo_repeticao = groupId;

      await fetch('/api/atividades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(atividadeBase)
      });
    }

    alert('Atividade(s) salva(s) com sucesso!');
    calendar.refetchEvents();
    form.reset();
    form.style.display = 'none';
    toggleFormButton.textContent = 'Adicionar Nova Atividade';
  });

  // Submissão do formulário de edição
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
      valencia_id: valenciaId,
      grupo_repeticao: currentGroupId
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
    if (confirm('Tem certeza de que deseja excluir esta atividade e todas as suas repetições?')) {
      const deleteUrl = currentGroupId
        ? `/api/atividades/grupo/${currentGroupId}`
        : `/api/atividades/${currentEventId}`;

      await fetch(deleteUrl, { method: 'DELETE' });

      alert('Atividade excluída com sucesso!');
      calendar.refetchEvents();
      closeEditModal();
    }
  });
});
