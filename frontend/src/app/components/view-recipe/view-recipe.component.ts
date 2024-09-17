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

  getRecipeById(id: number) {
    this.loading = true;
    this.recipeService.getRecipeById(id).subscribe({
      next: (response: { code: number; message: string; data: Recipe }) => {
        this.recipe = response.data;
        this.loading = false;
      },
      error: () => {
        // Maneja el error
        this.loading = false;
      }
    });
  }

}

