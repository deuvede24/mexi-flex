/*export interface RecipeIngredient {
  name: string;  // Nombre del ingrediente
  quantity: {
    imperial: string;  // Cantidad en sistema imperial (por ejemplo: "1 taza")
    metric: string;    // Cantidad en sistema métrico (por ejemplo: "200g")
  };
}*/
export interface RecipeIngredient {
  ingredient_name: string;
  imperial_quantity: string;
  metric_quantity: string;
}

export interface RecipeVersion {
  id_version: number;
  version_name: string;
  steps: Step[];
  ingredients: RecipeIngredient[];  // Relación con los ingredientes
}


export interface Step {
  description: string;
}


/*export interface Recipe {
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
}*/

export interface Recipe {
  id_recipe: number;
  title: string;
  description: string;
  is_premium: boolean;
  serving_size: number;
  preparation_time: number;
  image?: string;
  created_at: Date;
  versions: RecipeVersion[];  // Relación con las versiones
}

