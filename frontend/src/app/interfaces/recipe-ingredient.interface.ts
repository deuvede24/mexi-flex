
// Interfaz para un Ingrediente
export interface Ingredient {
  id_ingredient: number;
  name: string;
}

// Interfaz para la relación entre Receta e Ingrediente
export interface RecipeIngredient {
  recipe_id: number;
  ingredient_id: number;
  quantity: string;  // Esto puede ser una cadena como "200g", "1 cup", etc.
}