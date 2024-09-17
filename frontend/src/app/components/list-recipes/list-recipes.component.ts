import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../interfaces/recipe.interface';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import * as Papa from 'papaparse';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-list-recipes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-recipes.component.html',
  styleUrls: ['./list-recipes.component.scss']
})
export class ListRecipesComponent implements OnInit {
  recipeList: Recipe[] = [];
  loading: boolean = false;

  constructor(
    private recipeService: RecipeService,
    private notificationService: NotificationService,
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getRecipes();
  }

  getRecipes() {
    this.loading = true;
    this.recipeService.getRecipes().subscribe({
      next: (response: { code: number; message: string; data: Recipe[] }) => {
        this.recipeList = response.data;
        this.loading = false;
      },
      error: () => {
        this.notificationService.showError('Error al cargar las recetas.');
        this.loading = false;
      }
    });
  }

  editRecipe(id: number) {
    this.router.navigate([`/recipes/edit/${id}`]);
  }

  addRecipe() {
    this.router.navigate(['/recipes/add']);  // Redirige al componente de añadir receta
  }

 /* deleteRecipe(id: number) {
    // Verificamos si el usuario es un invitado
    const currentUser = this.authService.getUser();
    const userRole = currentUser?.role;
    if (userRole === 'guest') {
      this.notificationService.showError('Los usuarios invitados no pueden eliminar recetas.');
      return;
    }

    // Si es un usuario registrado, permitir la eliminación
    this.loading = true;
    this.recipeService.deleteRecipe(id).subscribe({
      next: () => {
        this.getRecipes(); // Recargar la lista después de eliminar
        this.notificationService.showSuccess('La receta fue eliminada con éxito.');
        this.loading = false;
      },
      error: () => {
        this.notificationService.showError('Error al eliminar la receta.');
        this.loading = false;
      }
    });
  }*/

    deleteRecipe(id: number) {
      // Verificamos si el usuario es un invitado
      const currentUser = this.authService.getUser();
      const userRole = currentUser?.role;
      if (userRole === 'guest') {
        this.notificationService.showError('Los usuarios invitados no pueden eliminar recetas.');
        return;
      }
    
      // Confirmación antes de eliminar
      if (confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
        this.loading = true;
        this.recipeService.deleteRecipe(id).subscribe({
          next: () => {
            this.getRecipes(); // Recargar la lista después de eliminar
            this.notificationService.showSuccess('La receta fue eliminada con éxito.');
            this.loading = false;
          },
          error: () => {
            this.notificationService.showError('Error al eliminar la receta.');
            this.loading = false;
          }
        });
      }
    }

  downloadCSV() {
    const csvData = Papa.unparse(this.recipeList); // Convierte la lista de recetas a CSV
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'recetas.csv'); // Descarga el archivo CSV
  }
}
