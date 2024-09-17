import { Component, AfterViewInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FullCalendarComponent as AngularFullCalendar } from '@fullcalendar/angular'; // Asegúrate de importar FullCalendar
import { ViewChild } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventService } from '../../services/event.service'; // Servicio para los eventos
import { CalendarEvent } from '../../interfaces/event.interface'; // Interfaz para los eventos

@Component({
  selector: 'app-fullcalendar',
  standalone: true,
  templateUrl: './fullcalendar.component.html',
  styleUrls: ['./fullcalendar.component.scss'],
  imports: [FullCalendarModule, ReactiveFormsModule], // Asegúrate de importar ReactiveFormsModule
  providers: [EventService], // Inyecta el servicio de eventos
})
export class FullCalendarComponent implements AfterViewInit {
  calendarOptions: CalendarOptions;
  eventForm: FormGroup;
  addModal = false;
  selectedEvent: CalendarEvent | null = null;

  // Correcta referencia a FullCalendar
  @ViewChild('fullcalendar') calendarComponent!: AngularFullCalendar;

  private eventService = inject(EventService); // Inyecta el servicio
  private fb = inject(FormBuilder);

  constructor() {
    // Definición de las opciones del calendario
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      selectable: true,
      dateClick: this.handleDateClick,
      eventClick: this.handleEventClick,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridDay'  // Aquí agregamos la vista de día
      },
      events: [], // Eventos serán cargados al inicializar
    };

    // Definición del formulario reactivo para los eventos
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      description: [''],
      type: ['receta', Validators.required]  // Agrega el campo 'type' y asegúrate de que sea obligatori
    });
  }

  // Cargar los eventos una vez que el componente esté cargado
  /*ngAfterViewInit(): void {
    this.loadEvents(); // Cargar los eventos después de la vista inicializada
  }*/
    ngAfterViewInit(): void {
      this.loadEvents();
      if (this.calendarComponent) {
        const calendarApi = this.calendarComponent.getApi();
    
        // Forzamos que "today" muestre solo el día actual
        const todayButton = document.querySelector('.fc-today-button');
        if (todayButton) {
          todayButton.addEventListener('click', () => {
            calendarApi.changeView('dayGridDay');  // Cambia a la vista de día
            calendarApi.today();  // Navega al día actual
          });
        }
      }
    }

  // Cargar los eventos desde el servicio
  loadEvents(): void {
    this.eventService.getEvents().subscribe((events: CalendarEvent[]) => {
      console.log('Eventos cargados:', events);  // Verifica los eventos cargados
      this.calendarOptions.events = events.map((event) => ({
        id: event.id.toString(),  // Asegúrate de convertir 'id' a string
        title: event.title,
        start: event.date, // Revisa que la fecha esté en formato válido
        description: event.description,
      }));

      // Asegurarse de que `calendarComponent` esté inicializado correctamente
      if (this.calendarComponent) {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.refetchEvents(); // Refresca los eventos una vez cargados
      } else {
        console.error('El componente FullCalendar no está inicializado.');
      }
    });
  }

  // Manejar el clic en una fecha del calendario
  handleDateClick = (info: any): void => {
    this.addModal = true;
    this.eventForm.reset();
    //this.eventForm.patchValue({ date: info.dateStr });
    this.eventForm.patchValue({ date: info.dateStr, type: 'receta' });  // Tipo por defecto 'receta' o el que prefieras
  };

  // Manejar el clic en un evento del calendario
  handleEventClick = (info: any): void => {
    this.addModal = true;
    this.selectedEvent = info.event;
    this.eventForm.patchValue({
      title: info.event.title,
      date: info.event.startStr,
      description: info.event.extendedProps.description || '',
      type: info.event.extendedProps.type || 'receta'  // Asegúrate de pasar el tipo
    });
  };


  formatDateToSQL(date: string): string {
    const d = new Date(date);
    // Formato YYYY-MM-DD HH:MM:SS
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  }
  // Guardar o actualizar el evento
  saveEvent(): void {
    if (this.eventForm.valid) {
      const newEvent = this.eventForm.value;
      console.log('Nuevo evento a crear:', newEvent);  // Revisa los datos aquí
      if (this.selectedEvent) {
        // Actualizar un evento existente
        this.eventService.updateEvent(this.selectedEvent.id, newEvent).subscribe(() => {
          this.loadEvents();
        });
      } else {
        // Crear un nuevo evento
        console.log('Nuevo evento a crear:', newEvent);
        this.eventService.createEvent(newEvent).subscribe({
          next: (response) => {
            console.log('Evento creado:', response);  // Verifica la respuesta aquí
            this.loadEvents();  // Recargar los eventos
          },
          error: (error) => {
            console.error('Error al crear el evento:', error);  // Verifica si hay algún error
          },
          complete: () => {
            console.log('Operación de creación completada.');
          }
        });
      }
      this.addModal = false;
    }
  }

  deleteEvent(): void {
    if (this.selectedEvent) {
      if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
        this.eventService.deleteEvent(this.selectedEvent.id).subscribe({
          next: () => {
            console.log('Evento eliminado');
            this.loadEvents();  // Recargar los eventos después de eliminar
          },
          error: (error) => {
            console.error('Error al eliminar el evento:', error);
          }
        });
        this.addModal = false;
      }
    }
  }

  

  // Resetear el formulario
  resetForm(): void {
    this.addModal = false;
    this.selectedEvent = null;
    this.eventForm.reset();
  }
}


