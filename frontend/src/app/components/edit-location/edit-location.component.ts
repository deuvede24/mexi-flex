import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { Location } from '../../interfaces/location.interface';

@Component({
  selector: 'app-edit-location',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './edit-location.component.html',
  styleUrls: ['./edit-location.component.scss'],
  providers: [LocationService]
})
export class EditLocationComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  id: number;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      latitude: [0, Validators.required],
      longitude: [0, Validators.required],
      category: ['', Validators.required] // Añadir la categoría aquí
    });

    this.id = Number(this.route.snapshot.paramMap.get('id') || 0);
  }

  ngOnInit(): void {
    if (this.id !== 0) {
      this.isEditMode = true;
      this.getLocationById(this.id);
    }
  }

  getLocationById(id: number): void {
    this.locationService.getLocation(id).subscribe({
      next: (data: Location) => {
        this.form.setValue({
          name: data.name || '',
          description: data.description || '',
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
          category: data.category || '' // Cargar la categoría también
          
        });
      },
      error: (error) => {
        console.error('Error loading location',error);
      }
    });
  }

  saveLocation(): void {
    if (this.form.invalid) {
      return;
    }
    const locationData = { id: this.id, ...this.form.value };

    if (this.isEditMode) {
      this.locationService.updateLocation(this.id, locationData).subscribe(() => {
        this.router.navigate(['/locations']);
      });
    } else {
      this.locationService.createLocation(locationData).subscribe(() => {
        this.router.navigate(['/locations']);
      });
    }
  }
}
