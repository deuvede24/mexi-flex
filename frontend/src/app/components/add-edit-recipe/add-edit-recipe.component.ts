import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { Recipe, RecipeIngredient } from '../../interfaces/recipe.interface';
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
      category: ['', Validators.required],  // Añadir este campo al formulario
      is_premium: [false, Validators.required],
      serving_size: [1, Validators.required],
      preparation_time: [0, Validators.required],
      image: [''],  // Campo para la URL de la imagen
      ingredients: this.fb.array([]),  // Array de ingredientes
      //steps: this.fb.array([]),  // Array de pasos
      steps: ['', Validators.required]  // Campo de texto para los pasos
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

  /*get steps(): FormArray {
    return this.form.get('steps') as FormArray;
  }*/

  get steps(): FormControl {
    return this.form.get('steps') as FormControl;
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
  /*createStep(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required]
    });
  }*/


  /* addStep() {
     this.steps.push(this.createStep());
   }
 
   removeStep(index: number) {
     this.steps.removeAt(index);
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
          category: recipeData.category,
          is_premium: recipeData.is_premium,
          serving_size: recipeData.serving_size,
          preparation_time: recipeData.preparation_time,
          image: recipeData.image,
          //ingredients: recipeData.RecipeIngredients||[],
          steps: recipeData.steps || ''  // Aquí asignamos los pasos como un simple string
        });


        // Cargar ingredientes y pasos
        this.ingredients.clear();
        if (recipeData.RecipeIngredients && recipeData.RecipeIngredients.length) {
          recipeData.RecipeIngredients.forEach((ingredient: RecipeIngredient) => {
            this.ingredients.push(this.fb.group({
              //ingredient_name: ingredient.ingredient_name,
              //quantity: ingredient.quantity

              ingredient_name: [ingredient.ingredient_name, Validators.required],
              quantity: [ingredient.quantity, Validators.required]
            }));
          });
        }

        console.log('Form after patching:', this.form.value);

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
 /* saveRecipe() {
    if (this.form.invalid) {
      this.notificationService.showError('Por favor, complete todos los campos.');
      return;
    }

    const formValue = this.form.value;
    console.log('Form Value before sending to backend:', formValue); // Verifica lo que se está enviando al backend

    const recipe = {
      id: this.id,
      ...formValue,
      // steps: formValue.steps // Asegurarse de que los pasos sean un string de texto
      steps: formValue.steps.trim() // Guardamos los pasos como un string

    };

    // Si es una receta nueva, eliminamos el campo `id` antes de enviarla al backend
    if (this.id === 0) {
      delete recipe.id;
    }

    this.loading = true;

    console.log('Datos de la receta antes de enviarlos:', recipe);

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
          this.loading = false;
          this.router.navigate(['/recipes']);
        },
        error: (err) => {
          console.error('Error al registrar la receta:', err);
          this.notificationService.showError('Error al registrar la receta.');
          this.loading = false;
        }
      });
    }
  }*/

    saveRecipe() {
      if (this.form.invalid) {
        this.notificationService.showError('Por favor, complete todos los campos.');
        return;
      }
    
      // Validación para `preparation_time`
      if (typeof this.form.value.preparation_time !== 'number' || this.form.value.preparation_time <= 0) {
        this.notificationService.showError('El tiempo de preparación debe ser un número positivo.');
        return;
      }
    
      // Validación para `image` (si es que no es opcional)
      if (this.form.value.image && !['jpg', 'jpeg', 'png'].includes(this.form.value.image.split('.').pop().toLowerCase())) {
        this.notificationService.showError('La imagen debe tener una extensión válida (jpg, jpeg, png).');
        return;
      }
    
      const formValue = this.form.value;
      console.log('Form Value antes de enviar al backend:', formValue);
    
      const recipe = {
        id: this.id,
        ...formValue,
        image: formValue.image || 'default_image.jpg', // Imagen por defecto si no se proporciona una
        steps: formValue.steps.trim()
      };
    
      if (this.id === 0) {
        delete recipe.id;
      }
    
      this.loading = true;
    
      console.log('Datos de la receta antes de enviarlos:', recipe);
    
      if (this.id !== 0) {
        this.recipeService.updateRecipe(this.id, recipe).subscribe({
          next: (response) => {
            console.log('Respuesta completa del servidor al actualizar receta:', response);
            this.notificationService.showSuccess('Receta actualizada con éxito.');
            this.router.navigate(['/recipes']);
            this.loading = false;
          },
          error: (err) => {
            console.error('Error al actualizar la receta:', err);
            this.notificationService.showError('Error al actualizar la receta.');
            this.loading = false;
          }
        });
      } else {
        this.recipeService.addRecipe(recipe).subscribe({
          next: (response) => {
            console.log('Respuesta completa del servidor al añadir receta:', response);
            if (response && response.code === 1) {
              this.notificationService.showSuccess('Receta registrada con éxito.');
              this.loading = false;
              this.router.navigate(['/recipes']);
            } else {
              console.error('Respuesta inesperada del servidor:', response);
              this.notificationService.showError('Error al registrar la receta. Respuesta inesperada del servidor.');
              this.loading = false;
            }
          },
          error: (err) => {
            console.error('Error al registrar la receta:', err);
            if (err.error && err.error.errors) {
              err.error.errors.forEach((error: any) => {
                this.notificationService.showError(`Error: ${error.msg}`);
              });
            } else {
              this.notificationService.showError('Error al registrar la receta.');
            }
            this.loading = false;
          }
        });
      }
    }
    

  cancel() {
    this.router.navigate(['/recipes']);
  }
}
