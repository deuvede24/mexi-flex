import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'
import { Recipe } from '../interfaces/recipe.interface';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = `${environment.apiUrl}/recipes`;  // Aquí se usará la URL del entorno

  constructor(private http: HttpClient) { }


  // Obtener todas las recetas con código, mensaje y data
 getRecipes(): Observable<{ code: number; message: string; data: Recipe[] }> {
    return this.http.get<{ code: number; message: string; data: Recipe[] }>(this.apiUrl, { withCredentials: true });
  }

  // Obtener una receta por ID
  getRecipeById(id: number): Observable<{ code: number; message: string; data: Recipe }> {
    return this.http.get<{ code: number; message: string; data: Recipe }>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  // Agregar una nueva receta
  addRecipe(recipe: Recipe): Observable<{ code: number; message: string; data: Recipe }> {
    return this.http.post<{ code: number; message: string; data: Recipe }>(this.apiUrl, recipe, { withCredentials: true });
  }

  // Actualizar una receta existente
  updateRecipe(id: number, recipe: Recipe): Observable<{ code: number; message: string }> {
    return this.http.put<{ code: number; message: string }>(`${this.apiUrl}/${id}`, recipe, { withCredentials: true });
  }

  // Eliminar una receta
  deleteRecipe(id: number): Observable<{ code: number; message: string }> {
    return this.http.delete<{ code: number; message: string }>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  // Método para guardar receta
  saveRecipe(recipe: Recipe): Observable<{ code: number; message: string; data: Recipe }> {
    return this.http.post<{ code: number; message: string; data: Recipe }>(this.apiUrl, recipe, { withCredentials: true });
  }

 /* getRecipeCategoryCount() {
    return this.http.get<{ code: number; message: string; data: any[] }>('/recipes/category-count');
  }*/

  getRecipeCategoryCount(): Observable<{ code: number; message: string; data: any[] }> {
    return this.http.get<{ code: number; message: string; data: any[] }>(`${this.apiUrl}/category-count`, { withCredentials: true });
  }
  

}
