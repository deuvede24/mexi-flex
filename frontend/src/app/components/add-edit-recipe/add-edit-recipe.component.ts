import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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
      //  steps: ['', Validators.required],
      steps: this.fb.array([]),  // Cambiamos steps a un array
      category: ['', Validators.required],
      is_premium: [false, Validators.required],
      //  ingredients: ['', Validators.required],
      ingredients: this.fb.array([]),  // Array de ingredientes que luego convertiremos a JSON
      serving_size: [1, Validators.required],
      preparation_time: [0, Validators.required],
      image: [''],  // Campo para la URL de la imagen
    });

    this.id = Number(this.aRouter.snapshot.paramMap.get('id') || 0);
  }

  ngOnInit(): void {
    if (this.id !== 0) {
      this.getRecipeById(this.id);
    }
  }

  // Obtener un array de ingredientes del formulario
  getIngredients(): FormArray {
    return this.form.get('ingredients') as FormArray;
  }

  // Obtener un array de pasos del formulario
  getSteps(): FormArray {
    return this.form.get('steps') as FormArray;
  }
  // Función para crear un control de ingrediente
  createIngredient(): FormGroup {
    return this.fb.group({
      nombre: ['', Validators.required],
      //cantidad: ['', Validators.required]
      cantidadImperial: ['', Validators.required],  // Cambio a cantidadImperial para coincidir con el HTML
      cantidadMetric: ['', Validators.required]     // Cambio a cantidadMetric para coincidir con el HTML
    });
  }

  // Añadir un ingrediente al array
  addIngredient() {
    this.getIngredients().push(this.createIngredient());
  }
  // Eliminar un ingrediente
  removeIngredient(index: number) {
    this.getIngredients().removeAt(index);
  }

  // Función para crear un control de paso (step)
  createStep(): FormGroup {
    return this.fb.group({
      descripcion: ['', Validators.required],
    });
  }
  // Añadir un paso al array
  addStep() {
    this.getSteps().push(this.createStep());
  }


  // Eliminar un paso
  removeStep(index: number) {
    this.getSteps().removeAt(index);
  }


  // Obtener el array de steps del formulario
  get steps() {
    return this.form.get('steps') as FormArray;
  }

  /*getRecipeById(id: number) {
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
  }*/
  getRecipeById(id: number) {
    this.loading = true;
    this.recipeService.getRecipeById(id).subscribe({
      next: (response: { code: number; message: string; data: Recipe }) => {
        const recipeData = response.data;

        // Verificar si ingredients ya es un array, si no, parsearlo
        const ingredientsArray = Array.isArray(recipeData.ingredients) ? recipeData.ingredients : JSON.parse(recipeData.ingredients || '[]');
        ingredientsArray.forEach((ingredient: { nombre: string, cantidad: { imperial: string, metric: string }}) => {
          this.getIngredients().push(this.fb.group({
            nombre: [ingredient.nombre, Validators.required],
            //cantidad: [ingredient.cantidad, Validators.required]
            cantidadImperial: [ingredient.cantidad.imperial, Validators.required],
            cantidadMetric: [ingredient.cantidad.metric, Validators.required]
          }));
        });

      // Verificar si steps ya es un array
      const stepsArray = Array.isArray(recipeData.steps) ? recipeData.steps : JSON.parse(recipeData.steps || '[]');
      stepsArray.forEach((step: { descripcion: string }) => {
        this.getSteps().push(this.fb.group({
          descripcion: [step.descripcion, Validators.required]
        }));
      });

        this.form.patchValue({
          title: recipeData.title,
          description: recipeData.description,
          category: recipeData.category,
          is_premium: recipeData.is_premium,
          serving_size: recipeData.serving_size,
          preparation_time: recipeData.preparation_time,
          image: recipeData.image
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

    const formValue = this.form.value;

    // Convertir el array de ingredientes en JSON
    formValue.ingredients = formValue.ingredients.map((ingredient: { nombre: string, cantidadImperial: string, cantidadMetric: string  }) => ({
      nombre: ingredient.nombre,
     // cantidad: ingredient.cantidad
     cantidad: {
      imperial: ingredient.cantidadImperial,  // Usar cantidadImperial para coincidir con el HTML
      metric: ingredient.cantidadMetric       // Usar cantidadMetric para coincidir con el HTML
    }
    }));
    // Convertir el array de steps en JSON
    formValue.steps = formValue.steps.map((step: { descripcion: string }) => ({
      descripcion: step.descripcion
    }));

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
