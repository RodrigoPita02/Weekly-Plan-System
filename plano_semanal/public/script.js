document.addEventListener('DOMContentLoaded', () => {
    const calendario = document.getElementById('calendario');

    fetch('/plano-semanal')
        .then(response => response.json())
        .then(planos => {
            planos.forEach(plano => {
                const diaIndex = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].indexOf(plano.dia_semana);
                const inicio = plano.hora_inicio.split(':');
                const fim = plano.hora_fim.split(':');
                const startBlock = (parseInt(inicio[0]) - 8) * 4 + parseInt(inicio[1]) / 15;
                const endBlock = (parseInt(fim[0]) - 8) * 4 + parseInt(fim[1]) / 15;
                
                for (let i = startBlock; i < endBlock; i++) {
                    const block = calendario.children[diaIndex + i * 5];
                    block.style.backgroundColor = '#add8e6';
                    block.innerText = `${plano.tipo_atividade} - ${plano.valencia}`;
                }
            });
        });
});
