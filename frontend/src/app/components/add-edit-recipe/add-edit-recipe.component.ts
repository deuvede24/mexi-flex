import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { Recipe, RecipeIngredient, Step } from '../../interfaces/recipe.interface';
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
      is_premium: [false, Validators.required],
      serving_size: [1, Validators.required],
      preparation_time: [0, Validators.required],
      image: [''],  // Campo para la URL de la imagen
      ingredients: this.fb.array([]),  // Array de ingredientes
      steps: this.fb.array([]),  // Array de pasos
     // steps: ['', Validators.required]  // Campo de texto para los pasos
    });

    this.id = Number(this.aRouter.snapshot.paramMap.get('id') || 0);
  }

  ngOnInit(): void {
    if (this.id !== 0) {
      this.getRecipeById(this.id);
    }
  }


  get ingredients(): FormArray {
    return this.form.get('ingredients') as FormArray;
  }

  get steps(): FormArray {
    return this.form.get('steps') as FormArray;
  }


  createIngredient(): FormGroup {
    return this.fb.group({
      ingredient_name: ['', Validators.required],
      quantity: ['', Validators.required]
    });
  }

  addIngredient() {
    this.ingredients.push(this.createIngredient());
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }
  // Función para crear un control de paso
  createStep(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required]
    });
  }


  addStep() {
    this.steps.push(this.createStep());
  }

  removeStep(index: number) {
    this.steps.removeAt(index);
  }

  // Obtener los datos de la receta por ID
  /*getRecipeById(id: number) {
    this.loading = true;
    this.recipeService.getRecipeById(id).subscribe({
      next: (response: { code: number; message: string; data: Recipe }) => {
        const recipeData = response.data;

        this.form.patchValue({
          title: recipeData.title,
          description: recipeData.description,
          is_premium: recipeData.is_premium,
          serving_size: recipeData.serving_size,
          preparation_time: recipeData.preparation_time,
          image: recipeData.image
        });

        this.getVersions().clear();
        recipeData.versions.forEach((version) => {
          const versionGroup = this.createVersion();
          versionGroup.patchValue({
            version_name: version.version_name,
          });

          this.getIngredients(this.getVersions().length - 1).clear();
          this.getSteps(this.getVersions().length - 1).clear();

          version.ingredients.forEach((ingredient) => {
            this.getIngredients(this.getVersions().length - 1).push(this.fb.group({
              ingredient_name: ingredient.ingredient_name,
              imperial_quantity: ingredient.imperial_quantity,
              metric_quantity: ingredient.metric_quantity
            }));
          });

          version.steps.forEach((step) => {
            this.getSteps(this.getVersions().length - 1).push(this.fb.group({
              description: step.description
            }));
          });

          this.getVersions().push(versionGroup);
        });

        this.loading = false;
      },
      error: () => {
        this.notificationService.showError('Error al cargar la receta.');
        this.loading = false;
      }
    });
  }
*/


  /*getRecipeById(id: number) {
    this.loading = true;
    this.recipeService.getRecipeById(id).subscribe({
      next: (response: { code: number; message: string; data: Recipe }) => {
        const recipeData = response.data;

        console.log('Recipe Data received from API:', recipeData); // Verifica la estructura completa de los datos recibidos

        // Parchear el formulario principal con los datos de la receta
        this.form.patchValue({
          title: recipeData.title,
          description: recipeData.description,
          is_premium: recipeData.is_premium,
          serving_size: recipeData.serving_size,
          preparation_time: recipeData.preparation_time,
          image: recipeData.image
        });
        console.log('Form after patching:', this.form.value);

        // Cargar ingredientes y pasos
        this.ingredients.clear();
        recipeData.ingredients.forEach((ingredient: RecipeIngredient) => {
          this.ingredients.push(this.fb.group({
            ingredient_name: ingredient.ingredient_name,
            quantity: ingredient.quantity
          }));
        });

        this.steps.clear();
        recipeData.steps.forEach((step: any) => {
          this.steps.push(this.fb.group({
            description: step.description
          }));
        });


        this.loading = false;
      },
      error: (error) => {
        console.error('Error retrieving recipe:', error);
        this.notificationService.showError('Error al cargar la receta.');
        this.loading = false;
      },
    });
  }*/

  getRecipeById(id: number) {
    this.loading = true;
    this.recipeService.getRecipeById(id).subscribe({
      next: (response: { code: number; message: string; data: Recipe }) => {
        const recipeData = response.data;

        console.log('Recipe Data received from API:', recipeData); // Verifica la estructura completa de los datos recibidos

        // Parchear el formulario principal con los datos de la receta
        this.form.patchValue({
          title: recipeData.title,
          description: recipeData.description,
          is_premium: recipeData.is_premium,
          serving_size: recipeData.serving_size,
          preparation_time: recipeData.preparation_time,
          image: recipeData.image,
         // steps: recipeData.steps // Aquí asignamos los pasos como un simple string
        });
        console.log('Form after patching:', this.form.value);

        // Cargar ingredientes y pasos
        this.ingredients.clear();
        if (recipeData.RecipeIngredients && recipeData.RecipeIngredients.length) {
          recipeData.RecipeIngredients.forEach((ingredient: RecipeIngredient) => {
            this.ingredients.push(this.fb.group({
              ingredient_name: ingredient.ingredient_name,
              quantity: ingredient.quantity
            }));
          });
        }

        // Verificar si los pasos existen antes de iterarlos
        /*   if (recipeData.steps && recipeData.steps.length) {
             recipeData.steps.forEach((step: Step) => {
               this.steps.push(this.fb.group({
                 description: step.description
               }));
             });
           } // Obtener los pasos
     /*   this.steps.clear();
        recipeData.steps.forEach((step: any) => {
          this.steps.push(this.fb.group({
            description: step.description
          }));
        });
*/

        this.loading = false;
      },
      error: (error) => {
        console.error('Error retrieving recipe:', error);
        this.notificationService.showError('Error al cargar la receta.');
        this.loading = false;
      },
    });
  }



  // Guardar o actualizar la receta
  saveRecipe() {
    if (this.form.invalid) {
      this.notificationService.showError('Por favor, complete todos los campos.');
      return;
    }

    const formValue = this.form.value;

    const recipe = {
      id: this.id,
      ...formValue,
     // steps: formValue.steps // Asegurarse de que los pasos sean un string de texto
    };

    this.loading = true;

    if (this.id !== 0) {
      this.recipeService.updateRecipe(this.id, recipe).subscribe({
        next: () => {
          this.notificationService.showSuccess('Receta actualizada con éxito.');
          //this.loading = false;
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
          // this.loading = false;
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
