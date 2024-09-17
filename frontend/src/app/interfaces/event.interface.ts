export interface CalendarEvent {
    id: number;
    title: string;
    description?: string;
    type: 'receta' | 'restaurante';
    date: string;  // o 'Date' si ya lo tienes como objeto fecha
    createdAt: string;
    updatedAt: string;
  }
  