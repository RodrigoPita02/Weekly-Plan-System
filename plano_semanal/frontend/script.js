document.getElementById('activityForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const activityData = {
        dia_semana: document.getElementById('dia').value,
        hora_inicio: document.getElementById('horaInicio').value,
        hora_fim: document.getElementById('horaFim').value,
        tipo_atividade_id: document.getElementById('tipoAtividadeId').value,
        valencia_id: document.getElementById('valenciaId').value
    };

    fetch('http://localhost:3000/api/activities', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(activityData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Atividade adicionada:', data);
        loadActivities();
    })
    .catch((error) => {
        console.error('Erro:', error);
    });
});

function loadActivities() {
    fetch('http://localhost:3000/api/activities')
    .then(response => response.json())
    .then(data => {
        const scheduleDiv = document.getElementById('schedule');
        scheduleDiv.innerHTML = '';
        data.forEach(activity => {
            scheduleDiv.innerHTML += `<p>${activity.dia_semana}: ${activity.hora_inicio} - ${activity.hora_fim}</p>`;
        });
    });
}

loadActivities();
