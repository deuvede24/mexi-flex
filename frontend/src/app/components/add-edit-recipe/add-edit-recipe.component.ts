import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { Recipe, RecipeVersion, RecipeIngredient, Step } from '../../interfaces/recipe.interface';
import { ActivatedRoute } from '@angular/router';
import { ProgressBarComponent } from '../../shared/progress-bar/progress-bar.component';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service'; // Reemplazamos ToastrService

/*@Component({
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
 
  getRecipeById(id: number) {
    this.loading = true;
    this.recipeService.getRecipeById(id).subscribe({
      next: (response: { code: number; message: string; data: Recipe }) => {
        const recipeData = response.data;
        console.log('Datos recibidos de la receta:', recipeData);

        // Verificar si ingredients ya es un array, si no, parsearlo
        const ingredientsArray = Array.isArray(recipeData.ingredients) ? recipeData.ingredients : JSON.parse(recipeData.ingredients || '[]');
        ingredientsArray.forEach((ingredient: { nombre: string, cantidad: { imperial: string, metric: string } }) => {
          this.getIngredients().push(this.fb.group({
            nombre: [ingredient.nombre, Validators.required],
            //cantidad: [ingredient.cantidad, Validators.required]
            cantidadImperial: [ingredient.cantidad.imperial, Validators.required],
            cantidadMetric: [ingredient.cantidad.metric, Validators.required]
          }));
        });

        // Verificar si steps ya es un array
        const stepsArray = Array.isArray(recipeData.steps) ? recipeData.steps : JSON.parse(recipeData.steps || '[]');
        console.log('Steps array:', stepsArray);
        stepsArray.forEach((step: { descripcion: string }) => {
          this.getSteps().push(this.fb.group({
            descripcion: [step.descripcion, Validators.required]

          }));
          console.log('Pasos añadidos:', this.getSteps().controls);
        });
        console.log('Pasos añadidos2:', this.getSteps().controls);

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
    formValue.ingredients = formValue.ingredients.map((ingredient: { nombre: string, cantidadImperial: string, cantidadMetric: string }) => ({
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

    console.log('Datos a guardar:', recipe);

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
}*/



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
      versions: this.fb.array([]),  // Array de versiones
    });

    this.id = Number(this.aRouter.snapshot.paramMap.get('id') || 0);
  }

  ngOnInit(): void {
    if (this.id !== 0) {
      this.getRecipeById(this.id);
    }
  }

  // Obtener el array de versiones del formulario
  getVersions(): FormArray {
    return this.form.get('versions') as FormArray;
  }

  // Obtener el array de ingredientes de una versión específica
  getIngredients(versionIndex: number): FormArray {
    return this.getVersions().at(versionIndex).get('ingredients') as FormArray;
  }

  // Obtener el array de pasos de una versión específica
  getSteps(versionIndex: number): FormArray {
    return this.getVersions().at(versionIndex).get('steps') as FormArray;
  }

  // Función para crear un control de versión
  createVersion(): FormGroup {
    return this.fb.group({
      version_name: ['', Validators.required],
      ingredients: this.fb.array([]),  // Array de ingredientes para esta versión
      steps: this.fb.array([]),  // Array de pasos para esta versión
    });
  }

  // Función para crear un control de ingrediente
  createIngredient(): FormGroup {
    return this.fb.group({
      ingredient_name: ['', Validators.required],
      imperial_quantity: ['', Validators.required],
      metric_quantity: ['', Validators.required]
    });
  }

  // Función para crear un control de paso
  createStep(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required]
    });
  }

  // Añadir una versión al array de versiones
  addVersion() {
    this.getVersions().push(this.createVersion());
  }

  // Eliminar una versión
  removeVersion(index: number) {
    this.getVersions().removeAt(index);
  }

  // Añadir un ingrediente a una versión específica
  addIngredient(versionIndex: number) {
    this.getIngredients(versionIndex).push(this.createIngredient());
  }

  // Eliminar un ingrediente de una versión específica
  removeIngredient(versionIndex: number, ingredientIndex: number) {
    this.getIngredients(versionIndex).removeAt(ingredientIndex);
  }

  // Añadir un paso a una versión específica
  addStep(versionIndex: number) {
    this.getSteps(versionIndex).push(this.createStep());
  }

  // Eliminar un paso de una versión específica
  removeStep(versionIndex: number, stepIndex: number) {
    this.getSteps(versionIndex).removeAt(stepIndex);
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
  

getRecipeById(id: number) {
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

      // Limpiar las versiones actuales en el formulario
      this.getVersions().clear();
      console.log('Form versions cleared:', this.getVersions().value);

      // Cambiamos aquí para usar 'RecipeVersions' en lugar de 'versions'
      if (recipeData.RecipeVersions && recipeData.RecipeVersions.length > 0) {
        console.log(`Found ${recipeData.RecipeVersions.length} versions for the recipe.`);

        recipeData.RecipeVersions.forEach((version, versionIndex) => {
          console.log(`Processing version ${versionIndex + 1}:`, version);

          const versionGroup = this.createVersion();
          versionGroup.patchValue({
            version_name: version.version_name,
          });
          console.log('Version group after patchValue:', versionGroup.value);

          // Verificar si la versión tiene ingredientes antes de iterar sobre ellos
          if (version.RecipeIngredients && version.RecipeIngredients.length > 0) {
            console.log(`Found ${version.RecipeIngredients.length} ingredients for version: ${version.version_name}`);

            version.RecipeIngredients.forEach((ingredient, ingredientIndex) => {
              console.log(`Processing ingredient ${ingredientIndex + 1}:`, ingredient);
              this.getIngredients(this.getVersions().length).push({
                ingredient_name: ingredient.ingredient_name,
                imperial_quantity: ingredient.imperial_quantity,
                metric_quantity: ingredient.metric_quantity
              });
              console.log('Ingredients FormArray after push:', this.getIngredients(this.getVersions().length).value);
            });
          } else {
            console.log(`No ingredients found for version: ${version.version_name}`);
          }

          // **Verificación adicional de los pasos antes de procesarlos**
          console.log(`Raw steps for version ${version.version_name}:`, version.steps);
          if (version.steps && version.steps.length > 0) {
            console.log(`Found ${version.steps.length} steps for version: ${version.version_name}`);
            version.steps.forEach((step, stepIndex) => {
              console.log(`Processing step ${stepIndex + 1}:`, step);
              this.getSteps(this.getVersions().length).push({
                description: step.description // Asegúrate de que 'descripcion' es el campo correcto
              });
              console.log('Steps FormArray after push:', this.getSteps(this.getVersions().length).value);
            });
          } else {
            console.log(`No steps found for version: ${version.version_name}`);
          }

          // Finalmente, agregar el grupo de versión al formulario
          console.log(`Adding version ${version.version_name} to the form.`);
          this.getVersions().push(versionGroup);
          console.log('Form versions after push:', this.getVersions().value);
        });
      } else {
        console.log('No versions found for recipe.');
      }
    },
    error: (error) => {
      console.error('Error retrieving recipe:', error);
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
      versions: formValue.versions.map((version: any) => ({
        version_name: version.version_name,
        steps: version.steps.map((step: any) => ({
          description: step.description
        })),
        ingredients: version.ingredients.map((ingredient: any) => ({
          ingredient_name: ingredient.ingredient_name,
          imperial_quantity: ingredient.imperial_quantity,
          metric_quantity: ingredient.metric_quantity
        }))
      }))
    };

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
