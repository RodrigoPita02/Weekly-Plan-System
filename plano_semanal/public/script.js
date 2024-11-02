// script.js
document.addEventListener('DOMContentLoaded', () => {
    loadTipoAtividades();
    loadValencias();

    document.getElementById('plano-form').addEventListener('submit', addPlanoAtividade);
});

function loadTipoAtividades() {
    fetch('/api/tipo-atividades')
        .then(response => response.json())
        .then(data => {
            const tipoSelect = document.getElementById('tipo');
            data.forEach(tipo => {
                let option = document.createElement('option');
                option.value = tipo.id;
                option.textContent = tipo.descricao;
                tipoSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar tipos de atividades:', error));
}

function loadValencias() {
    fetch('/api/valencias')
        .then(response => response.json())
        .then(data => {
            const valenciaSelect = document.getElementById('valencia');
            data.forEach(valencia => {
                let option = document.createElement('option');
                option.value = valencia.id;
                option.textContent = valencia.descricao;
                valenciaSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar valências:', error));
}

function addPlanoAtividade(event) {
    event.preventDefault();
    const dia = document.getElementById('dia').value;
    const horaInicio = document.getElementById('horaInicio').value;
    const horaFim = document.getElementById('horaFim').value;
    const tipo = document.getElementById('tipo').value;
    const valencia = document.getElementById('valencia').value;

    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.textContent = `${dia} - ${horaInicio} a ${horaFim}`;

    document.getElementById('calendario').appendChild(slot);
}

