import { RecipeIngredient } from './recipe-ingredient.interface';

export interface Recipe {
    id_recipe: number;
    title: string;
    description: string;
    steps: string;
    category: string;
    is_premium: boolean;
    created_at?: string;
    updated_at?: string;
    user_id: number;
    ingredients?: RecipeIngredient[]; // Nueva propiedad para manejar ingredientes
  }

  
  
