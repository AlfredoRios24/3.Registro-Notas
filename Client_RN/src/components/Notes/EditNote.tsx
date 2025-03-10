import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNoteById, updateNoteEdit } from '../../services/api';
import './EditNote.css'; // Importar los estilos

const EditNote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [state, setState] = useState('PENDING');

  // Función para formatear la fecha a "YYYY-MM-DD"
  const formatDate = (date: Date) => {

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    
      if (!startDate || !endDate || !state) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
      }
    
      // Verificación de las fechas
      if (new Date(startDate) > new Date(endDate)) {
        alert('La fecha de inicio no puede ser posterior a la fecha de fin.');
        return;
      }
    
      const updatedNote = { 
        title, 
        content, 
        startDate, 
        endDate, 
        state 
      };
    
      console.log('Datos enviados:', updatedNote);  // Verificar los datos antes de enviarlos
    
      const formatDate = (date: Date) => {
        return date.toISOString().split('.')[0];  // Se asegura de que la fecha tenga la hora
      };

      try {
        const formattedStartDate = formatDate(new Date(startDate));
        const formattedEndDate = formatDate(new Date(endDate));
    
        const updatedNoteWithDates = { 
          title, 
          content, 
          startDate: formattedStartDate, 
          endDate: formattedEndDate, 
          state 
        };
    
        await updateNoteEdit(Number(id), updatedNoteWithDates);
        alert('Nota actualizada con éxito');
        navigate('/');
      } catch (error) {
        console.error('Error al actualizar la nota:', error);
        alert('Error al actualizar la nota');
      }
    };



    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Ajuste a la zona horaria local
    return localDate.toISOString().split('T')[0];  // Solo la parte de la fecha (YYYY-MM-DD)
  };

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const noteId = Number(id);
        if (!isNaN(noteId)) {
          const note = await getNoteById(noteId);  // Llamada a la función en api.ts
          console.log('Nota obtenida:', note);
          setTitle(note.title);
          setContent(note.content);
          setStartDate(note.startDate ? note.startDate.split('T')[0] : '');  // Asignar fecha de inicio
          setEndDate(note.endDate ? note.endDate.split('T')[0] : '');      // Asignar fecha de fin
          setState(note.state || 'PENDING');   // Asignar estado
        } else {
          console.error('ID no válido');
        }
      } catch (error) {
        console.error('Error al obtener la nota para editar:', error);
      }
    };

    if (id) {
      fetchNote();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validamos si los campos obligatorios tienen valores
    if (!startDate || !endDate || !state) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    const updatedNote = { 
      title, 
      content, 
      startDate, 
      endDate, 
      state 
    };
    console.log(updatedNote);  // Verifica los datos antes de enviarlos

    try {
      // Convertimos las fechas al formato adecuado si es necesario
      const formattedStartDate = formatDate(new Date(startDate));
      const formattedEndDate = formatDate(new Date(endDate));

      // Enviamos la nota actualizada al backend
      const updatedNoteWithDates = { 
        title, 
        content, 
        startDate: formattedStartDate, 
        endDate: formattedEndDate, 
        state 
      };
      await updateNoteEdit(Number(id), updatedNoteWithDates);  // Llamada a la función updateNoteEdit
      alert('Nota actualizada con éxito');
      navigate('/');  // Redirigir al listado de notas
    } catch (error) {
      console.error('Error al actualizar la nota:', error);
      alert('Error al actualizar la nota');
    }


  };



  return (
    <div>
      <h2>Editar Nota</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Contenido:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="startDate">Fecha de inicio:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="endDate">Fecha de fin:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className='form-state'>
          {["PENDING", "IN_PROGRESS", "COMPLETED"].map((status) => (
            <div
              key={status}
              className={`state-option ${state === status ? status.toLowerCase() : ""}`}
              onClick={() => setState(status)}
            >
              {status === "PENDING" ? "Pendiente" : status === "IN_PROGRESS" ? "En progreso" : "Completada"}
            </div>
          ))}
        </div>
        <button type="submit" className="btn-edit">Actualizar Nota</button>
      </form>
    </div>
  );
};

export default EditNote;
