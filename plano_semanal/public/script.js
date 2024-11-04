document.addEventListener('DOMContentLoaded', function() {
    loadTiposAtividade();
    loadValencias();

    const calendarEl = document.getElementById('fullcalendar'); // Certifique-se de que o ID esteja correto
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay'
        },
        events: fetchEvents,
        editable: true,
        selectable: true,
        slotDuration: '00:30:00', // Define a duração do slot como 30 minutos
        slotLabelInterval: { hours: 1 }, // Mostra rótulos a cada 1 hora
        slotMinTime: '08:00:00', // Hora mínima para a exibição
        slotMaxTime: '21:00:00', // Hora máxima para a exibição
        allDaySlot: false, // Remove a linha "All Day"
        slotLabelFormat: { hour: '2-digit', minute: '2-digit', hour12: false }, // Formato das horas
        firstDay: 1, // Define a segunda-feira como o primeiro dia da semana
        nowIndicator: true, // Mostra a linha atual
        select: function(info) {
            const dia_semana = info.start.toLocaleDateString('pt-BR', { weekday: 'long' });
            const hora_inicio = info.start.toTimeString().slice(0, 5);
            const hora_fim = info.end.toTimeString().slice(0, 5);
            document.getElementById('dia_semana').value = dia_semana;
            document.getElementById('hora_inicio').value = hora_inicio;
            document.getElementById('hora_fim').value = hora_fim;
        }
    });

    calendar.render();

    document.getElementById('atividadeForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const dia_semana = document.getElementById('dia_semana').value;
        const hora_inicio = document.getElementById('hora_inicio').value;
        const hora_fim = document.getElementById('hora_fim').value;
        const tipo_atividade_id = document.getElementById('tipo_atividade_id').value;
        const valencia_id = document.getElementById('valencia_id').value;

        fetch('http://localhost:3000/atividades', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dia_semana, hora_inicio, hora_fim, tipo_atividade_id, valencia_id })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Atividade adicionada:', data);
            // Adiciona a nova atividade ao calendário
            calendar.addEvent({
                title: `Atividade ${tipo_atividade_id}`, // Substitua com descrição se disponível
                start: new Date(`${dia_semana}T${hora_inicio}:00`), // Cria um objeto Date com segundos
                end: new Date(`${dia_semana}T${hora_fim}:00`), // Cria um objeto Date com segundos
                allDay: false
            });
        })
        .catch(error => console.error('Erro:', error));
    });

    function fetchEvents(info, successCallback) {
        fetch('http://localhost:3000/atividades')
            .then(response => response.json())
            .then(data => {
                const events = data.map(atividade => {
                    const today = new Date();
                    const dayOfWeek = {
                        'Domingo': 0,
                        'Segunda': 1,
                        'Terça': 2,
                        'Quarta': 3,
                        'Quinta': 4,
                        'Sexta': 5,
                        'Sábado': 6
                    };

                    // Calcular o offset para o dia da semana
                    const dayOffset = (dayOfWeek[atividade.dia_semana] - today.getDay() + 7) % 7; 
                    const eventDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + dayOffset);

                    // Criar a data completa com horas
                    const start = new Date(eventDate);
                    const [horaInicio, minutosInicio] = atividade.hora_inicio.split(':');
                    start.setHours(horaInicio, minutosInicio, 0); // Define a hora de início com segundos como 0

                    const end = new Date(eventDate);
                    const [horaFim, minutosFim] = atividade.hora_fim.split(':');
                    end.setHours(horaFim, minutosFim, 0); // Define a hora de fim com segundos como 0

                    return {
                        title: `Atividade ${atividade.tipo_atividade_id}`, // Substitua com descrição se disponível
                        start: start, // Mantém o objeto Date
                        end: end, // Mantém o objeto Date
                        allDay: false
                    };
                });
                successCallback(events); // Passa os eventos para o calendário
            })
            .catch(error => console.error('Erro ao buscar eventos:', error));
    }
});

function loadTiposAtividade() {
    fetch('http://localhost:3000/tipos-atividade')
    .then(response => response.json())
    .then(data => {
        const tipoSelect = document.getElementById('tipo_atividade_id');
        data.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id;
            option.textContent = tipo.descricao;
            tipoSelect.appendChild(option);
        });
    });
}

function loadValencias() {
    fetch('http://localhost:3000/valencias')
    .then(response => response.json())
    .then(data => {
        const valenciaSelect = document.getElementById('valencia_id');
        data.forEach(valencia => {
            const option = document.createElement('option');
            option.value = valencia.id;
            option.textContent = valencia.descricao;
            valenciaSelect.appendChild(option);
        });
    });
}
