import { Component, Input, OnInit } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { Location } from '../../interfaces/location.interface';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrls: ['./location-detail.component.scss'],
  standalone: true,
  providers: [LocationService],
})
export class LocationDetailComponent implements OnInit {
  @Input() location!: Location; // Recibimos la ubicación seleccionada
  //searchResults: Location[] = []; // Resultados de la búsqueda
  form: FormGroup; // Formulario para la edición de la ubicación
  isEditMode = false; // Variable para controlar el modo edición

  constructor(
    private locationService: LocationService,
    public router: Router,
    private fb: FormBuilder
  ) {
    // Inicializamos el formulario con validaciones
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      latitude: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
      longitude: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
      category: ['', Validators.required]  
    });
  }

  ngOnInit(): void {
    // Si la ubicación está definida, rellenamos el formulario con los datos
    if (this.location) {
      this.form.patchValue({
        name: this.location.name,
        description: this.location.description,
        latitude: this.location.latitude,
        longitude: this.location.longitude,
        category: this.location.category // Parchar categoría aquí
      });
    }
  }

  // Método para activar el modo de edición
  editLocation(): void {
    if (this.location?.id) {
      this.router.navigate(['/locations/edit', this.location.id]);
    } else {
      console.error('No se puede editar: la ubicación no tiene un ID.');
    }
  }

  // Método para guardar los cambios realizados
  saveChanges(): void {
    if (this.form.valid) {
      const updatedLocation: Location = {
        ...this.location,
        name: this.form.value.name,
        description: this.form.value.description,
        latitude: parseFloat(this.form.value.latitude),
        longitude: parseFloat(this.form.value.longitude),
      };

      this.locationService.updateLocation(updatedLocation.id!, updatedLocation).subscribe({
        next: () => {
          alert('Ubicación actualizada con éxito');
          this.isEditMode = false; // Salimos del modo edición
          // Opcional: puedes actualizar el marcador en el mapa aquí si es necesario
        },
        error: (error) => {
          console.error('Error al actualizar la ubicación:', error);
        }
      });
    } else {
      alert('Por favor, completa el formulario correctamente');
    }
  }

  // Método para eliminar una ubicación
  deleteLocation(): void {
    if (this.location?.id != null && confirm('¿Estás seguro de que deseas eliminar esta ubicación?')) {
      this.locationService.deleteLocation(this.location.id).subscribe(() => {
        alert('Ubicación eliminada con éxito');
        this.router.navigate(['/locations']); // O recargar el mapa
      });
    } else {
      console.error('No se puede eliminar: la ubicación no tiene un ID.');
    }
  }
}

