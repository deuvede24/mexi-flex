/*import { Component } from '@angular/core';

@Component({
  selector: 'app-list-recipes-user',
  standalone: true,
  imports: [],
  templateUrl: './list-recipes-user.component.html',
  styleUrl: './list-recipes-user.component.scss'
})
export class ListRecipesUserComponent {

}*/

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../services/auth.service';
import { Recipe } from '../../interfaces/recipe.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-recipes-user',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-recipes-user.component.html',
  styleUrls: ['./list-recipes-user.component.scss']
})
export class ListRecipesUserComponent implements OnInit {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  version: 'traditional' | 'flexi' = 'traditional'; // Estado para el checkbox

  constructor(private recipeService: RecipeService, public authService: AuthService) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe((response: { code: number; message: string; data: Recipe[] }) => {
      this.recipes = response.data;  // Ajusta para obtener las recetas dentro de "data"
      this.filteredRecipes = this.recipes;
    });
  }

  onVersionChange(event: any): void {
    // Cambiar la versión seleccionada
    this.version = event.target.checked ? 'flexi' : 'traditional';
  }

  viewRecipe(recipe: Recipe): void {
    // Navegar a la página de detalles de la receta
    // Aquí implementas la lógica para redirigir a la receta seleccionada
  }
}
