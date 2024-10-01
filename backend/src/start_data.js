import bcrypt from "bcrypt";
import User from "./models/userModel.js";
import Recipe from "./models/recipeModel.js";
import RecipeIngredient from "./models/recipeIngredientModel.js";
import MapLocation from "./models/mapModel.js";
import Event from "./models/eventModel.js";

const insertInitialData = async () => {
  try {
    const hashedPassword = await bcrypt.hash("password123", parseInt(process.env.BCRYPT_SALT));

    // Insertar usuarios
    const userData = [
      { email: "admin@example.com", password: hashedPassword, username: "admin", roles: "admin", avatar: null },
      { email: "user@example.com", password: hashedPassword, username: "user", roles: "user", avatar: null },
      { email: "carolina@gmail.com", password: hashedPassword, username: "carol", roles: "user", avatar: null },
      { email: "dogbark@gmail.com", password: hashedPassword, username: "dog", roles: "user", avatar: null },
    ];

    await User.bulkCreate(userData, { ignoreDuplicates: true });
    console.log("Usuarios insertados correctamente.");

    // Insertar recetas
    const recipeData = [
      {
        title: "Tacos de Picadillo Tradicional",
        description: "Tacos tradicionales con carne molida",
        serving_size: 1,
        preparation_time: 45,
        is_premium: 0,
        image: "tacos_picadillo.jpg",
        category: "tradicional",
        steps: "1. Dorar la carne molida de ternera con cebolla y ajo.\n2. Añadir tomate y cilantro."
      },
      {
        title: "Tacos de Picadillo Flexi",
        description: "Tacos con Heura",
        serving_size: 1,
        preparation_time: 45,
        is_premium: 0,
        image: "tacos_heura.jpg",
        category: "flexi",
        steps: "1. Dorar la carne de Heura con cebolla y ajo.\n2. Añadir tomate y cilantro."
      },
      {
        title: "Flautas de Pollo Tradicional",
        description: "Flautas tradicionales con pollo",
        serving_size: 1,
        preparation_time: 60,
        is_premium: 0,
        image: "flautas_pollo.jpg",
        category: "tradicional",
        steps: "1. Cocinar la pechuga de pollo y desmenuzarla.\n2. Rellenar las tortillas con el pollo y freírlas."
      },
      {
        title: "Flautas de Tofu Flexi",
        description: "Flautas con tofu.",
        serving_size: 1,
        preparation_time: 60,
        is_premium: 0,
        image: "flautas_tofu.jpg",
        category: "flexi",
        steps: "1. Rallar el tofu, sazonarlo y cocinarlo.\n2. Rellenar las tortillas con el tofu y freírlas."
      },
      {
        title: "Tacos de Chicharrón Prensado Tradicional",
        description: "Tacos con chicharrón prensado.",
        serving_size: 1,
        preparation_time: 40,
        is_premium: 0,
        image: "tacos_chicharron.jpg",
        category: "tradicional",
        steps: "1. Cocinar el chicharrón prensado.\n2. Colocar el chicharrón en las tortillas de maíz."
      },
      {
        title: "Tacos de Tofu Flexi",
        description: "Tacos de tofu crujiente",
        serving_size: 2,
        preparation_time: 30,
        is_premium: 0,
        image: "tacos_tofu.jpg",
        category: "flexi",
        steps: "1. Marinar el tofu con salsa de soja, ajo y aceite.\n2. Cocinar el tofu marinado en la air fryer."
      }
    ];

    await Recipe.bulkCreate(recipeData, {
      ignoreDuplicates: true,
      updateOnDuplicate: ["title", "description", "serving_size", "preparation_time", "is_premium", "image", "category", "steps"],
    });

    console.log("Recetas insertadas correctamente.");

    const tacosPicadilloRecipe = await Recipe.findOne({ where: { title: "Tacos de Picadillo Tradicional" } });
    const flautasPolloRecipe = await Recipe.findOne({ where: { title: "Flautas de Pollo Tradicional" } });
    const tacosChicharronRecipe = await Recipe.findOne({ where: { title: "Tacos de Chicharrón Prensado Tradicional" } });

    // Insertar ingredientes
    const ingredientData = [
      { ingredient_name: "Carne molida de ternera", quantity: "125 g", recipe_id: tacosPicadilloRecipe.id_recipe },
      { ingredient_name: "Cebolla", quantity: "1/2 unidad", recipe_id: tacosPicadilloRecipe.id_recipe },
      { ingredient_name: "Ajo", quantity: "2 dientes", recipe_id: tacosPicadilloRecipe.id_recipe },
      { ingredient_name: "Pechuga de pollo", quantity: "200 g", recipe_id: flautasPolloRecipe.id_recipe },
      { ingredient_name: "Tortillas de maíz", quantity: "6 unidades", recipe_id: flautasPolloRecipe.id_recipe },
      { ingredient_name: "Chicharrón prensado", quantity: "150 g", recipe_id: tacosChicharronRecipe.id_recipe },
      { ingredient_name: "Tortillas de maíz", quantity: "4 unidades", recipe_id: tacosChicharronRecipe.id_recipe },
    ];

    await RecipeIngredient.bulkCreate(ingredientData, { ignoreDuplicates: true });
    console.log("Ingredientes insertados correctamente.");

    // Insertar ubicaciones en el mapa
    const mapLocationData = [
      { name: "La Sagrada Familia", description: "Una famosa basílica diseñada por Antoni Gaudí.", latitude: 41.4036, longitude: 2.1744, category: 'park' },
      { name: "Parc Güell", description: "Un parque público con impresionantes obras de Gaudí.", latitude: 41.4145, longitude: 2.1527, category: 'park' },
      { name: "Casa Batlló", description: "Un edificio modernista diseñado por Gaudí.", latitude: 41.3916, longitude: 2.1649, category: 'Museos' },
    ];

    await MapLocation.bulkCreate(mapLocationData, { ignoreDuplicates: true });
    console.log("Ubicaciones del mapa insertadas correctamente.");

    // Insertar eventos de ejemplo
    const eventData = [
      { title: "Lanzamiento de Receta Tacos Veganos", description: "Receta especial de tacos veganos para el público", type: "receta", date: new Date("2024-09-16") },
      { title: "Apertura de Restaurante Vegano", description: "Un nuevo restaurante vegano abrirá sus puertas", type: "restaurante", date: new Date("2024-09-20") },
    ];

    await Event.bulkCreate(eventData, { ignoreDuplicates: true });
    console.log("Eventos insertados correctamente.");

  } catch (error) {
    console.error("Error en el proceso de inserción de datos:", error);
  }
};

export default insertInitialData;
