import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocationService } from '../../services/location.service';
import { Location } from '../../interfaces/location.interface';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-list-locations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-locations.component.html',
  styleUrls: ['./list-locations.component.scss'],
  providers: [LocationService]
})
export class ListLocationsComponent implements OnInit {
  locations: Location[] = [];

  constructor(private locationService: LocationService) { }
  // Función trackBy para optimizar la iteración de ubicaciones
  trackByLocationId(index: number, location: Location): number | null {
    return location.id ? location.id : null;
  }

  ngOnInit(): void {
    this.loadLocations();
  }

  isLoading = false;

  loadLocations(): void {
    if (!this.isLoading) {
      this.isLoading = true;
      this.locationService.getLocations().pipe(
        tap(data => {
          this.locations = [...data];
          this.isLoading = false; // Terminar estado de carga
        }),
        catchError(error => {
          console.error('Error loading locations', error);
          this.isLoading = false;  // Manejar errores
          return of([]);
        })
      ).subscribe();
    }
  }


  deleteLocation(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta ubicación?')) {
      this.locationService.deleteLocation(id).subscribe(() => {
        this.loadLocations();
      });
    }
  }
}

