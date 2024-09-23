/*export interface RecipeIngredient {
  name: string;  // Nombre del ingrediente
  quantity: string;  // Cantidad del ingrediente (por ejemplo: "200g")
}*/

export interface RecipeIngredient {
  name: string;  // Nombre del ingrediente
  quantity: {
    imperial: string;  // Cantidad en sistema imperial (por ejemplo: "1 taza")
    metric: string;    // Cantidad en sistema métrico (por ejemplo: "200g")
  };
}

export interface Step {
  description: string;  // Paso de la receta
}

export interface Recipe {
  id_recipe: number;
  title: string;
  description: string;
  steps: Step[];  // Pasos ahora como un array de objetos
  category: string;
  is_premium: boolean;
  created_at?: string;
  updated_at?: string;
  user_id: number;
  ingredients: RecipeIngredient[];  // Ingredientes como array de objetos con nombre y cantidad
  serving_size: number;  // Tamaño de la porción
  preparation_time: number;  // Tiempo de preparación en minutos
  image?: string;  // URL de la imagen
}
