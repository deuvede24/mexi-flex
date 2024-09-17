// map.component.ts
import { Component, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import { LocationService } from '../../services/location.service';
import { LocationDetailComponent } from '../location-detail/location-detail.component';
import { Location } from '../../interfaces/location.interface';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  providers: [LocationService],
  imports: [LocationDetailComponent],
})
export class MapComponent implements AfterViewInit {
  map!: mapboxgl.Map;
  selectedLocation: Location | null = null; // Cambiado para aceptar null
  panelVisible: boolean = false; // Control para la visibilidad del panel

  markers: mapboxgl.Marker[] = []; // Array para almacenar los marcadores
  filteredMarkers: mapboxgl.Marker[] = []; // Marcadores filtrados
  selectedCategories: Set<string> = new Set(); // Set para las categorías seleccionadas

  constructor(private locationService: LocationService, private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.getMapboxTokenAndInitializeMap();
  }

  getMapboxTokenAndInitializeMap(): void {
    this.http.get<{ mapboxToken: string }>('http://localhost:3000/map/token').subscribe((response) => {
      this.initializeMap(response.mapboxToken);
    });
  }

  initializeMap(token: string): void {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [2.1734, 41.3851],
      zoom: 12,
      accessToken: token,
    });

    this.map.on('load', () => {
      this.addMarkers(); // Cargar las ubicaciones existentes
    });

    this.map.on('click', (event) => {
      const features = this.map.queryRenderedFeatures(event.point); // Verificar si el clic fue en un marcador
      if (features.length === 0) {
        this.addNewLocation(event.lngLat); // Solo agregar nueva ubicación si no hay un marcador
      }
    });
  }

  addMarkers(): void {
    this.locationService.getLocations().subscribe((locations) => {
      locations.forEach((location) => {
        //this.addMarkerToMap(location);
        const marker = this.addMarkerToMap(location);
        this.markers.push(marker); // Almacenar todos los marcadores
      });
    });
  }

  addMarkerToMap(location: Location): mapboxgl.Marker {
    const marker = new mapboxgl.Marker()
      .setLngLat([location.longitude, location.latitude])
      .setPopup(
        new mapboxgl.Popup().setHTML(`
          <div class="popup-container">
          <h3>${location.name}</h3>
          <p>${location.description}</p>
          <p><small>Doble clic para más detalles</small></p>
          </div>
        `)
      )
      .addTo(this.map);

    // Añadir evento para mostrar los detalles al hacer doble clic
    marker.getElement().addEventListener('dblclick', (e) => {
      e.stopPropagation(); // Prevenir el evento de doble clic en el mapa
      this.showLocationDetails(location); // Mostrar detalles de la ubicación
    });
    return marker;
  }

  // Método para manejar la selección de filtros de categoría
  filterMarkers(event: any): void {
    const category = event.target.value.toLowerCase();

    if (event.target.checked) {
      this.selectedCategories.add(category); // Añadir categoría al set
    } else {
      this.selectedCategories.delete(category); // Eliminar categoría del set
    }

    // Filtrar marcadores
    this.applyMarkerFilter();
  }

  // Aplicar el filtro en función de las categorías seleccionadas
 /* applyMarkerFilter(): void {
    // Primero, ocultamos todos los marcadores
    console.log('Categorías seleccionadas:', this.selectedCategories);
    this.markers.forEach(marker => marker.remove());

    // Mostramos solo los marcadores que coincidan con las categorías seleccionadas
    this.locationService.getLocations().subscribe(locations => {
      console.log('Ubicaciones recibidas:', locations); // Verifica que las categorías son correctas
      locations.forEach(location => {
       // console.log('Categorías seleccionadas:', Array.from(this.selectedCategories));
        console.log('Categoría de la ubicación:', location.category);
        const locationCategory = location.category ? location.category.toLowerCase() : '';
        if (locationCategory && this.selectedCategories.has(locationCategory)) {
          const marker = this.addMarkerToMap(location);
          this.markers.push(marker); // Añadir solo los marcadores visibles
      }
        
      });
    });
  }*/// Aplicar el filtro en función de las categorías seleccionadas
applyMarkerFilter(): void {
  // Primero, ocultamos todos los marcadores
  console.log('Categorías seleccionadas:', this.selectedCategories);
  this.markers.forEach(marker => marker.remove());

  // Si no hay categorías seleccionadas, mostramos todas las ubicaciones
  if (this.selectedCategories.size === 0) {
    this.locationService.getLocations().subscribe(locations => {
      console.log('Mostrando todas las ubicaciones porque no hay categorías seleccionadas.');
      locations.forEach(location => {
        const marker = this.addMarkerToMap(location);
        this.markers.push(marker);
      });
    });
  } else {
    // Mostramos solo los marcadores que coincidan con las categorías seleccionadas
    this.locationService.getLocations().subscribe(locations => {
      console.log('Ubicaciones recibidas:', locations); // Verifica que las categorías son correctas
      locations.forEach(location => {
        const locationCategory = location.category ? location.category.toLowerCase() : '';
        if (locationCategory && this.selectedCategories.has(locationCategory)) {
          const marker = this.addMarkerToMap(location);
          this.markers.push(marker); // Añadir solo los marcadores visibles
        }
      });
    });
  }
}



  addNewLocation(lngLat: mapboxgl.LngLat): void {
    const name = prompt('Introduce un nombre para la nueva ubicación:');
    const description = prompt('Introduce una descripción para la nueva ubicación:');
    const category = prompt('Introduce una categoría para la nueva ubicación:'); // Pide la categoría también
    if (name && description && category) {
      const newLocation: Location = {
        name: name,
        description: description,
        latitude: lngLat.lat,
        longitude: lngLat.lng,
        category: category, // Añadimos la categoría aquí
      };

      this.locationService.createLocation(newLocation).subscribe({
        next: (createdLocation) => {
          console.log('Ubicación creada correctamente en el backend:', createdLocation);
          this.addMarkerToMap(createdLocation);
        },
        error: (error) => {
          console.error('Error al crear la ubicación:', error);
        },
      });
    }
  }

  showLocationDetails(location: Location): void {
    this.selectedLocation = location;
    this.panelVisible = true; 
    this.openDetailPanel();
  }

  openDetailPanel(): void {
    this.panelVisible = true; // Hacer visible el panel
  }

  closePanel(): void {
    this.selectedLocation = null; // Limpiar la ubicación seleccionada
    const panel = document.querySelector('.location-detail-panel');
    if (panel) {
      panel.classList.remove('visible'); // Ocultar el panel
    }
    this.panelVisible = false;
  }

}
