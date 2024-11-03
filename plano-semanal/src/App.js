import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // para arrastar e redimensionar eventos

function App() {
  const [tiposAtividades, setTiposAtividades] = useState([]);
  const [valencias, setValencias] = useState([]);
  const [atividade, setAtividade] = useState({
    dia_semana: 'Segunda',
    hora_inicio: '',
    hora_fim: '',
    tipo_atividade_id: null, // Valor inicial definido como null
    valencia_id: null,        // Valor inicial definido como null
  });

  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const tiposResponse = await axios.get('http://localhost:5000/api/tipos-atividade');
      const valenciasResponse = await axios.get('http://localhost:5000/api/valencias');
      setTiposAtividades(tiposResponse.data);
      setValencias(valenciasResponse.data);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAtividade((prevAtividade) => ({
      ...prevAtividade,
      [name]: name === 'hora_inicio' || name === 'hora_fim' ? value : parseInt(value) || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação para garantir que todos os valores obrigatórios estão preenchidos
    if (!atividade.tipo_atividade_id || !atividade.valencia_id || !atividade.hora_inicio || !atividade.hora_fim) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const formattedAtividade = {
      ...atividade,
      hora_inicio: `${atividade.hora_inicio}:00`, // Adiciona segundos ao horário
      hora_fim: `${atividade.hora_fim}:00`,       // Adiciona segundos ao horário
      start: `${atividade.dia_semana}T${atividade.hora_inicio}:00`,
      end: `${atividade.dia_semana}T${atividade.hora_fim}:00`,
      title: `Atividade: ${tiposAtividades.find(t => t.id === +atividade.tipo_atividade_id)?.descricao} | ${valencias.find(v => v.id === +atividade.valencia_id)?.descricao}`,
    };

    try {
      // Adiciona a nova atividade no banco de dados
      await axios.post('http://localhost:5000/api/atividades', formattedAtividade);

      // Adiciona a nova atividade aos eventos do calendário
      setEventos([...eventos, formattedAtividade]);
      alert('Atividade criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
      alert('Ocorreu um erro ao criar a atividade.');
    }
  };

  return (
    <div>
      <h1>Plano Semanal de Atividades</h1>
      <form onSubmit={handleSubmit}>
        <select name="dia_semana" onChange={handleChange} value={atividade.dia_semana}>
          <option value="Segunda">Segunda</option>
          <option value="Terça">Terça</option>
          <option value="Quarta">Quarta</option>
          <option value="Quinta">Quinta</option>
          <option value="Sexta">Sexta</option>
        </select>
        <input type="time" name="hora_inicio" onChange={handleChange} required />
        <input type="time" name="hora_fim" onChange={handleChange} required />
        <select name="tipo_atividade_id" onChange={handleChange} value={atividade.tipo_atividade_id || ''}>
          <option value="">Selecione o tipo de atividade</option>
          {tiposAtividades.map(tipo => (
            <option key={tipo.id} value={tipo.id}>{tipo.descricao}</option>
          ))}
        </select>
        <select name="valencia_id" onChange={handleChange} value={atividade.valencia_id || ''}>
          <option value="">Selecione a valência</option>
          {valencias.map(valencia => (
            <option key={valencia.id} value={valencia.id}>{valencia.descricao}</option>
          ))}
        </select>

        <button type="submit">Criar Atividade</button>
      </form>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={eventos.map(evento => ({
          title: evento.title,
          start: evento.start, // Use o valor completo de data e hora
          end: evento.end,     // Use o valor completo de data e hora
        }))}
        editable={true}
        selectable={true}
        eventClick={(info) => {
          alert('Evento: ' + info.event.title);
        }}
      />
    </div>
  );
}

export default App;
