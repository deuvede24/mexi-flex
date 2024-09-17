import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Location } from '../interfaces/location.interface';
import { switchMap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { CreateLocationResponse } from '../interfaces/location.interface';  // Importa la interfaz

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = 'http://localhost:3000/map'; // Asegúrate de que esta URL apunte a tu backend

  constructor(private http: HttpClient) { }

  // Obtener todas las ubicaciones
  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/locations`);
    
  }

  // Obtener una ubicación específica por ID
  getLocation(id: number): Observable<Location> {
    return this.http.get<Location>(`${this.apiUrl}/locations/${id}`);
  }

  // Geocodificación de una ubicación
  geocodeLocation(query: string): Observable<any> {
    return this.getMapboxToken().pipe(
      switchMap(response => {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${response.mapboxToken}`;
        return this.http.get(url);
      })
    );
  }

  // Obtener el token de Mapbox
  getMapboxToken(): Observable<{ mapboxToken: string }> {
    return this.http.get<{ mapboxToken: string }>(`${this.apiUrl}/token`);
  }


  /*createLocation(location: Location): Observable<Location> {
    return this.http.post<CreateLocationResponse>(`${this.apiUrl}/locations`, location)
      .pipe(map(response => response.newLocation)); // Solo devolvemos newLocation
  }*/
      createLocation(location: Location): Observable<Location> {
        return this.http.post<CreateLocationResponse>(`${this.apiUrl}/locations`, location)
          .pipe(map(response => {
            // Aquí nos aseguramos que la respuesta incluya la categoría también
            return {
              ...response.newLocation,
              category: response.newLocation.category || location.category, // Incluimos la categoría
            };
          }));
      }

  // Actualizar una ubicación existente
 /* updateLocation(id: number, location: Location): Observable<Location> {
    return this.http.put<Location>(`${this.apiUrl}/locations/${id}`, location);
  }*/
    updateLocation(id: number, location: Location): Observable<Location> {
      return this.http.put<Location>(`${this.apiUrl}/locations/${id}`, location)
        .pipe(map(response => {
          // Nos aseguramos que la categoría también esté presente
          return {
            ...response,
            category: response.category || location.category, // Incluimos la categoría si es necesario
          };
        }));
    }
    

  deleteLocation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/locations/${id}`);
  }
}

