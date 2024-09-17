import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../interfaces/recipe.interface';
import { ActivatedRoute } from '@angular/router';
import { ProgressBarComponent } from '../../shared/progress-bar/progress-bar.component';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service'; // Reemplazamos ToastrService

@Component({
  selector: 'app-add-edit-recipe',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ProgressBarComponent],
  templateUrl: './add-edit-recipe.component.html',
  styleUrls: ['./add-edit-recipe.component.scss']
})
export class AddEditRecipeComponent implements OnInit {
  form: FormGroup;
  loading = false;
  id: number;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private router: Router,
    private notificationService: NotificationService,
    private aRouter: ActivatedRoute,
    public authService: AuthService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      steps: ['', Validators.required],
      category: ['', Validators.required],
      is_premium: [false, Validators.required],
      ingredients: ['', Validators.required],
    });

    this.id = Number(this.aRouter.snapshot.paramMap.get('id') || 0);
  }

  ngOnInit(): void {
    if (this.id !== 0) {
      this.getRecipeById(this.id);
    }
  }

  getRecipeById(id: number) {
    this.loading = true;
    this.recipeService.getRecipeById(id).subscribe({
      next: (response: { code: number; message: string; data: Recipe }) => {
        this.form.patchValue({
          title: response.data.title || '',
          description: response.data.description || '',
          steps: response.data.steps || '',
          category: response.data.category || '',
          is_premium: response.data.is_premium || false,
          ingredients: response.data.ingredients || '',
        });
        this.loading = false;
      },
      error: () => {
        this.notificationService.showError('Error al cargar la receta.');
        this.loading = false;
      }
    });
  }

  saveRecipe() {
    if (this.form.invalid) {
      this.notificationService.showError('Por favor, complete todos los campos.');
      return;
    }

    const recipe = { id: this.id, ...this.form.value };
    this.loading = true;

    if (this.id !== 0) {
      this.recipeService.updateRecipe(this.id, recipe).subscribe({
        next: () => {
          this.notificationService.showSuccess('Receta actualizada con éxito.');
          this.loading = false;
          this.router.navigate(['/recipes']);
        },
        error: () => {
          this.notificationService.showError('Error al actualizar la receta.');
          this.loading = false;
        }
      });
    } else {
      this.recipeService.addRecipe(recipe).subscribe({
        next: () => {
          this.notificationService.showSuccess('Receta registrada con éxito.');
          this.loading = false;
          this.router.navigate(['/recipes']);
        },
        error: () => {
          this.notificationService.showError('Error al registrar la receta.');
          this.loading = false;
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/recipes']);
  }
}
