import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../interfaces/recipe.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-recipe',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-recipe.component.html',
  styleUrls: ['./view-recipe.component.scss']
})
export class ViewRecipeComponent implements OnInit {
  recipe: Recipe | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.getRecipeById(id);
    }
  }


  /* getRecipeById(id: number) {
     this.loading = true;
     this.recipeService.getRecipeById(id).subscribe({
       next: (response: { code: number; message: string; data: Recipe }) => {
         console.log('Recipe data received:', response.data);
         if (response.data && typeof response.data.steps === 'string') {
           this.recipe = response.data;
         } else {
           this.recipe = { ...response.data, steps: '' };  // Establece steps como una cadena vacía si no es string
         }
         this.loading = false;
       },
       error: () => {
         this.loading = false;
       }
     });
   }*/

  getRecipeById(id: number) {
    this.loading = true;
    this.recipeService.getRecipeById(id).subscribe({
      next: (response: { code: number; message: string; data: Recipe }) => {
        console.log('Recipe data received:', response.data);

        // Verifica si steps es un string, si no, lo inicializa como un string vacío.
        if (response.data && typeof response.data.steps === 'string') {
          this.recipe = response.data;
        } else {
          this.recipe = { ...response.data, steps: '' };  // Establece steps como una cadena vacía si no es string
        }

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

  }



}


