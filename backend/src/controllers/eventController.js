import Event from '../models/eventModel.js';

// Obtener todos los eventos
export const getEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los eventos' });
  }
};

// Obtener un evento por su ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el evento' });
  }
};

// Crear un nuevo evento
export const addEvent = async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body);  // Log para ver qué se está enviando
    const { title, description, type, date } = req.body;
    const newEvent = await Event.create({ title, description, type, date });
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error al crear el evento:", error);
    res.status(500).json({ message: 'Error al crear el evento' });
  }
};

// Actualizar un evento existente
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    const { title, description, type, date } = req.body;
    await event.update({ title, description, type, date });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el evento' });
  }
};

// Eliminar un evento
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    await event.destroy();
    res.json({ message: 'Evento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el evento' });
  }
};
