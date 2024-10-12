/*import bcrypt from "bcrypt";
import User from "./models/userModel.js";
import Recipe from "./models/recipeModel.js";
import RecipeIngredient from "./models/recipeIngredientModel.js";
import MapLocation from "./models/mapModel.js";
import Event from "./models/eventModel.js";

const insertInitialData = async () => {
  try {
    // Insertar usuarios iniciales
    const hashedPassword = await bcrypt.hash("password123", parseInt(process.env.BCRYPT_SALT));

    const userData = [
      { email: "admin@example.com", password: hashedPassword, username: "admin", roles: "admin", avatar: null },
      { email: "user@example.com", password: hashedPassword, username: "user", roles: "user", avatar: null },
      { email: "carolina@gmail.com", password: hashedPassword, username: "carol", roles: "user", avatar: null },
      { email: "dogbark@gmail.com", password: hashedPassword, username: "dog", roles: "user", avatar: null },
    ];

    await User.bulkCreate(userData, { ignoreDuplicates: true });
    console.log("Usuarios insertados correctamente.");

    // Insertar recetas y verificar duplicados
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

    // Insertar recetas solo si no existen
    for (const recipe of recipeData) {
      const existingRecipe = await Recipe.findOne({ where: { title: recipe.title } });
      if (!existingRecipe) {
        await Recipe.create(recipe);
        console.log(`Receta '${recipe.title}' insertada correctamente.`);
      } else {
        console.log(`Receta '${recipe.title}' ya existe, no se insertó.`);
      }
    }

    // Buscar recetas para asociar ingredientes
    const tacosPicadilloRecipe = await Recipe.findOne({ where: { title: "Tacos de Picadillo Tradicional" } });
    const flautasPolloRecipe = await Recipe.findOne({ where: { title: "Flautas de Pollo Tradicional" } });
    const tacosChicharronRecipe = await Recipe.findOne({ where: { title: "Tacos de Chicharrón Prensado Tradicional" } });
    const tacosTofuRecipe = await Recipe.findOne({ where: { title: "Tacos de Tofu Flexi" } });
    const flautasTofuRecipe = await Recipe.findOne({ where: { title: "Flautas de Tofu Flexi" } });

    if (!tacosPicadilloRecipe || !flautasPolloRecipe || !tacosChicharronRecipe || !tacosTofuRecipe || !flautasTofuRecipe) {
      throw new Error('Recetas necesarias no encontradas.');
    }

    // Insertar ingredientes de cada receta sin duplicados
    const ingredientData = [
      // Ingredientes para Tacos de Picadillo Tradicional
      { ingredient_name: "Carne molida de ternera", quantity: "125 g", recipe_id: tacosPicadilloRecipe.id_recipe },
      { ingredient_name: "Cebolla", quantity: "1/2 unidad", recipe_id: tacosPicadilloRecipe.id_recipe },
      { ingredient_name: "Ajo", quantity: "2 dientes", recipe_id: tacosPicadilloRecipe.id_recipe },
      { ingredient_name: "Tomate", quantity: "1 unidad", recipe_id: tacosPicadilloRecipe.id_recipe },
      { ingredient_name: "Cilantro", quantity: "Al gusto", recipe_id: tacosPicadilloRecipe.id_recipe },
      { ingredient_name: "Tortillas de maíz", quantity: "4 unidades", recipe_id: tacosPicadilloRecipe.id_recipe },

      // Ingredientes para Flautas de Pollo Tradicional
      { ingredient_name: "Pechuga de pollo", quantity: "200 g", recipe_id: flautasPolloRecipe.id_recipe },
      { ingredient_name: "Tortillas de maíz", quantity: "6 unidades", recipe_id: flautasPolloRecipe.id_recipe },
      { ingredient_name: "Aceite", quantity: "Para freír", recipe_id: flautasPolloRecipe.id_recipe },
      { ingredient_name: "Lechuga", quantity: "Al gusto", recipe_id: flautasPolloRecipe.id_recipe },
      { ingredient_name: "Crema", quantity: "Al gusto", recipe_id: flautasPolloRecipe.id_recipe },

      // Ingredientes para Tacos de Chicharrón Prensado Tradicional
      { ingredient_name: "Chicharrón prensado", quantity: "150 g", recipe_id: tacosChicharronRecipe.id_recipe },
      { ingredient_name: "Tortillas de maíz", quantity: "4 unidades", recipe_id: tacosChicharronRecipe.id_recipe },
      { ingredient_name: "Salsa verde", quantity: "Al gusto", recipe_id: tacosChicharronRecipe.id_recipe },
      { ingredient_name: "Cebolla", quantity: "1/2 unidad", recipe_id: tacosChicharronRecipe.id_recipe },

      // Ingredientes para Tacos de Tofu Flexi
      { ingredient_name: "Tofu", quantity: "200 g", recipe_id: tacosTofuRecipe.id_recipe },
      { ingredient_name: "Salsa de soja", quantity: "2 cucharadas", recipe_id: tacosTofuRecipe.id_recipe },
      { ingredient_name: "Ajo", quantity: "2 dientes", recipe_id: tacosTofuRecipe.id_recipe },
      { ingredient_name: "Aceite de oliva", quantity: "2 cucharadas", recipe_id: tacosTofuRecipe.id_recipe },
      { ingredient_name: "Tortillas de maíz", quantity: "4 unidades", recipe_id: tacosTofuRecipe.id_recipe },

      // Ingredientes para Flautas de Tofu Flexi
      { ingredient_name: "Tofu", quantity: "200 g", recipe_id: flautasTofuRecipe.id_recipe },
      { ingredient_name: "Tortillas de maíz", quantity: "6 unidades", recipe_id: flautasTofuRecipe.id_recipe },
      { ingredient_name: "Aceite", quantity: "Para freír", recipe_id: flautasTofuRecipe.id_recipe },
      { ingredient_name: "Lechuga", quantity: "Al gusto", recipe_id: flautasTofuRecipe.id_recipe },
      { ingredient_name: "Crema vegana", quantity: "Al gusto", recipe_id: flautasTofuRecipe.id_recipe }
    ];

    // Insertar ingredientes solo si no existen
    for (const ingredient of ingredientData) {
      const existingIngredient = await RecipeIngredient.findOne({
        where: { ingredient_name: ingredient.ingredient_name, recipe_id: ingredient.recipe_id }
      });
      if (!existingIngredient) {
        await RecipeIngredient.create(ingredient);
        console.log(`Ingrediente '${ingredient.ingredient_name}' para la receta '${ingredient.recipe_id}' insertado correctamente.`);
      } else {
        console.log(`Ingrediente '${ingredient.ingredient_name}' ya existe, no se insertó.`);
      }
    }

    // Insertar ubicaciones de mapa
    const mapLocationData = [
      { name: "La Sagrada Familia", description: "Una famosa basílica diseñada por Antoni Gaudí.", latitude: 41.4036, longitude: 2.1744, category: 'park' },
      { name: "Parc Güell", description: "Un parque público con impresionantes obras de Gaudí.", latitude: 41.4145, longitude: 2.1527, category: 'park' },
      { name: "Casa Batlló", description: "Un edificio modernista diseñado por Gaudí.", latitude: 41.3916, longitude: 2.1649, category: 'Museos' },
    ];

    for (const location of mapLocationData) {
      const existingLocation = await MapLocation.findOne({ where: { name: location.name } });
      if (!existingLocation) {
        await MapLocation.create(location);
        console.log(`Ubicación '${location.name}' insertada correctamente.`);
      } else {
        console.log(`Ubicación '${location.name}' ya existe, no se insertó.`);
      }
    }

    // Insertar eventos
    const eventData = [
      { title: "Lanzamiento de Receta Tacos Veganos", description: "Receta especial de tacos veganos para el público", type: "receta", date: new Date("2024-09-16") },
      { title: "Apertura de Restaurante Vegano", description: "Un nuevo restaurante vegano abrirá sus puertas", type: "restaurante", date: new Date("2024-09-20") },
    ];

    for (const event of eventData) {
      const existingEvent = await Event.findOne({ where: { title: event.title } });
      if (!existingEvent) {
        await Event.create(event);
        console.log(`Evento '${event.title}' insertado correctamente.`);
      } else {
        console.log(`Evento '${event.title}' ya existe, no se insertó.`);
      }
    }

    console.log("Todos los datos iniciales han sido insertados correctamente.");

  } catch (error) {
    console.error("Error en el proceso de inserción de datos:", error);
  }
};

export default insertInitialData;*/
/*import bcrypt from "bcrypt";
import User from "./models/userModel.js";
import Recipe from "./models/recipeModel.js";
import RecipeIngredient from "./models/recipeIngredientModel.js";
import MapLocation from "./models/mapModel.js";
import Event from "./models/eventModel.js";

const insertInitialData = async () => {
  try {
    // Insertar usuarios iniciales con upsert
    const hashedPassword = await bcrypt.hash("password123", parseInt(process.env.BCRYPT_SALT));

    const userData = [
      { id_user: 1, email: "admin@example.com", password: hashedPassword, username: "admin", roles: "admin", avatar: null },
      { id_user: 2, email: "user@example.com", password: hashedPassword, username: "user", roles: "user", avatar: null },
      { id_user: 3, email: "carolina@gmail.com", password: hashedPassword, username: "carol", roles: "user", avatar: null },
      { id_user: 4, email: "dogbark@gmail.com", password: hashedPassword, username: "dog", roles: "user", avatar: null },
    ];

    for (const user of userData) {
      await User.upsert(user);
      console.log(`Usuario '${user.username}' insertado o actualizado correctamente.`);
    }

    // Insertar recetas con upsert usando id_recipe como clave
    const recipeData = [
      {
        id_recipe: 1,
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
        id_recipe: 2,
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
        id_recipe: 3,
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
        id_recipe: 4,
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
        id_recipe: 5,
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
        id_recipe: 6,
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

    for (const recipe of recipeData) {
      await Recipe.upsert(recipe);
      console.log(`Receta '${recipe.title}' insertada o actualizada correctamente.`);
    }

    // Obtener recetas por id_recipe
    const tacosPicadilloRecipe = await Recipe.findByPk(1);
    const tacosFlexiRecipe = await Recipe.findByPk(2);
    const flautasPolloRecipe = await Recipe.findByPk(3);
    const flautasTofuRecipe = await Recipe.findByPk(4);
    const tacosChicharronRecipe = await Recipe.findByPk(5);
    const tacosTofuRecipe = await Recipe.findByPk(6);

    if (!tacosPicadilloRecipe || !flautasPolloRecipe || !tacosChicharronRecipe || !tacosTofuRecipe || !flautasTofuRecipe) {
      throw new Error('Recetas necesarias no encontradas.');
    }

    // Insertar ingredientes con upsert usando id_recipe como referencia
    const ingredientData = [
      // Ingredientes para Tacos de Picadillo Tradicional
      { ingredient_name: "Carne molida de ternera", quantity: "125 g", recipe_id: tacosPicadilloRecipe.id_recipe },
      { ingredient_name: "Cebolla", quantity: "1/2 unidad", recipe_id: tacosPicadilloRecipe.id_recipe },
      { ingredient_name: "Ajo", quantity: "2 dientes", recipe_id: tacosPicadilloRecipe.id_recipe },
      { ingredient_name: "Tomate", quantity: "1 unidad", recipe_id: tacosPicadilloRecipe.id_recipe },
      { ingredient_name: "Cilantro", quantity: "Al gusto", recipe_id: tacosPicadilloRecipe.id_recipe },
      { ingredient_name: "Tortillas de maíz", quantity: "4 unidades", recipe_id: tacosPicadilloRecipe.id_recipe },

      // Ingredientes para Tacos de Picadillo Flexi
      { ingredient_name: "Heura", quantity: "150 g", recipe_id: tacosFlexiRecipe.id_recipe },
      { ingredient_name: "Cebolla", quantity: "1/2 unidad", recipe_id: tacosFlexiRecipe.id_recipe },
      { ingredient_name: "Ajo", quantity: "2 dientes", recipe_id: tacosFlexiRecipe.id_recipe },
      { ingredient_name: "Tomate", quantity: "1 unidad", recipe_id: tacosFlexiRecipe.id_recipe },
      { ingredient_name: "Cilantro", quantity: "Al gusto", recipe_id: tacosFlexiRecipe.id_recipe },
      { ingredient_name: "Tortillas de maíz", quantity: "4 unidades", recipe_id: tacosFlexiRecipe.id_recipe },

      // Ingredientes para Flautas de Pollo Tradicional
      { ingredient_name: "Pechuga de pollo", quantity: "200 g", recipe_id: flautasPolloRecipe.id_recipe },
      { ingredient_name: "Tortillas de maíz", quantity: "6 unidades", recipe_id: flautasPolloRecipe.id_recipe },
      { ingredient_name: "Aceite", quantity: "Para freír", recipe_id: flautasPolloRecipe.id_recipe },
      { ingredient_name: "Lechuga", quantity: "Al gusto", recipe_id: flautasPolloRecipe.id_recipe },
      { ingredient_name: "Crema", quantity: "Al gusto", recipe_id: flautasPolloRecipe.id_recipe },

      // Ingredientes para Flautas de Tofu Flexi
      { ingredient_name: "Tofu", quantity: "200 g", recipe_id: flautasTofuRecipe.id_recipe },
      { ingredient_name: "Tortillas de maíz", quantity: "6 unidades", recipe_id: flautasTofuRecipe.id_recipe },
      { ingredient_name: "Aceite", quantity: "Para freír", recipe_id: flautasTofuRecipe.id_recipe },
      { ingredient_name: "Lechuga", quantity: "Al gusto", recipe_id: flautasTofuRecipe.id_recipe },
      { ingredient_name: "Crema vegana", quantity: "Al gusto", recipe_id: flautasTofuRecipe.id_recipe },

      // Ingredientes para Tacos de Chicharrón Prensado Tradicional
      { ingredient_name: "Chicharrón prensado", quantity: "150 g", recipe_id: tacosChicharronRecipe.id_recipe },
      { ingredient_name: "Tortillas de maíz", quantity: "4 unidades", recipe_id: tacosChicharronRecipe.id_recipe },
      { ingredient_name: "Salsa verde", quantity: "Al gusto", recipe_id: tacosChicharronRecipe.id_recipe },
      { ingredient_name: "Cebolla", quantity: "1/2 unidad", recipe_id: tacosChicharronRecipe.id_recipe },

      // Ingredientes para Tacos de Tofu Flexi
      { ingredient_name: "Tofu", quantity: "200 g", recipe_id: tacosTofuRecipe.id_recipe },
      { ingredient_name: "Salsa de soja", quantity: "2 cucharadas", recipe_id: tacosTofuRecipe.id_recipe },
      { ingredient_name: "Ajo", quantity: "2 dientes", recipe_id: tacosTofuRecipe.id_recipe },
      { ingredient_name: "Aceite de oliva", quantity: "2 cucharadas", recipe_id: tacosTofuRecipe.id_recipe },
      { ingredient_name: "Tortillas de maíz", quantity: "4 unidades", recipe_id: tacosTofuRecipe.id_recipe },
    ];

    for (const ingredient of ingredientData) {
      await RecipeIngredient.upsert(ingredient);
      console.log(`Ingrediente '${ingredient.ingredient_name}' insertado o actualizado correctamente para la receta ${ingredient.recipe_id}.`);
    }

    // Insertar ubicaciones de mapa con upsert
    const mapLocationData = [
      { name: "La Sagrada Familia", description: "Una famosa basílica diseñada por Antoni Gaudí.", latitude: 41.4036, longitude: 2.1744, category: 'park' },
      { name: "Parc Güell", description: "Un parque público con impresionantes obras de Gaudí.", latitude: 41.4145, longitude: 2.1527, category: 'park' },
      { name: "Casa Batlló", description: "Un edificio modernista diseñado por Gaudí.", latitude: 41.3916, longitude: 2.1649, category: 'Museos' },
    ];

    for (const location of mapLocationData) {
      await MapLocation.upsert(location);
      console.log(`Ubicación '${location.name}' insertada o actualizada correctamente.`);
    }

    // Insertar eventos con upsert
    const eventData = [
      { title: "Lanzamiento de Receta Tacos Veganos", description: "Receta especial de tacos veganos para el público", type: "receta", date: new Date("2024-09-16") },
      { title: "Apertura de Restaurante Vegano", description: "Un nuevo restaurante vegano abrirá sus puertas", type: "restaurante", date: new Date("2024-09-20") },
    ];

    for (const event of eventData) {
      await Event.upsert(event);
      console.log(`Evento '${event.title}' insertado o actualizado correctamente.`);
    }

    console.log("Todos los datos iniciales han sido insertados o actualizados correctamente.");

  } catch (error) {
    console.error("Error en el proceso de inserción de datos:", error);
  }
};

export default insertInitialData;*/
import bcrypt from "bcrypt";
import User from "./models/userModel.js";
import Recipe from "./models/recipeModel.js";
import RecipeIngredient from "./models/recipeIngredientModel.js";
import MapLocation from "./models/mapModel.js";
import Event from "./models/eventModel.js";

const insertInitialData = async () => {
  try {
    // Usuarios iniciales
    const hashedPassword = await bcrypt.hash(
      "password123",
      parseInt(process.env.BCRYPT_SALT)
    );
    const userData = [
      {
        email: "dani@example.com",
        password: hashedPassword,
        username: "dani",
        roles: "user",
        avatar: null,
      },
      {
        email: "user@example.com",
        password: hashedPassword,
        username: "user",
        roles: "user",
        avatar: null,
      },
      {
        email: "carolina@gmail.com",
        password: hashedPassword,
        username: "carol",
        roles: "user",
        avatar: null,
      },
      {
        email: "dogbark@gmail.com",
        password: hashedPassword,
        username: "dog",
        roles: "user",
        avatar: null,
      },
    ];

    await Promise.all(
      userData.map((user) =>
        User.upsert({
          email: user.email,
          password: user.password,
          username: user.username,
          roles: user.roles,
          avatar: user.avatar,
        })
      )
    );
    console.log("Usuarios insertados o actualizados correctamente.");

    // Recetas con ingredientes completos
    const recipeData = [
      {
        id_recipe: 1,
        title: "Tacos de Picadillo Tradicional",
        description: "Tacos tradicionales con carne molida",
        serving_size: 1,
        preparation_time: 45,
        is_premium: 0,
        image: "tacos_picadillo.jpg",
        category: "tradicional",
        steps:
          "1. Dorar la carne molida de ternera con cebolla y ajo.\n2. Añadir tomate y cilantro.",
      },
      {
        id_recipe: 2,
        title: "Tacos de Picadillo Flexi",
        description: "Tacos de picadillo con Picada de Heura",
        serving_size: 1,
        preparation_time: 45,
        is_premium: 0,
        image: "tacos_heura.jpg",
        category: "flexi",
        steps:
          "1. Dorar la carne de Heura con cebolla y ajo.\n2. Añadir tomate y cilantro.",
      },
      {
        id_recipe: 3,
        title: "Flautas de Pollo Tradicional",
        description: "Flautas tradicionales con pollo",
        serving_size: 1,
        preparation_time: 60,
        is_premium: 0,
        image: "flautas_pollo.jpg",
        category: "tradicional",
        steps:
          "1. Cocinar la pechuga de pollo y desmenuzarla.\n2. Rellenar las tortillas con el pollo y freírlas.",
      },
      {
        id_recipe: 4,
        title: "Flautas de Pollo Flexi",
        description: "Flautas con tofu.",
        serving_size: 1,
        preparation_time: 60,
        is_premium: 0,
        image: "flautas_tofu.jpg",
        category: "flexi",
        steps:
          "1. Rallar el tofu, sazonarlo y cocinarlo.\n2. Rellenar las tortillas con el tofu y freírlas.",
      },
      {
        id_recipe: 5,
        title: "Tacos de Chicharrón Tradicional",
        description: "Tacos con chicharrón prensado.",
        serving_size: 1,
        preparation_time: 40,
        is_premium: 0,
        image: "tacos_chicharron.jpg",
        category: "tradicional",
        steps:
          "1. Cocinar el chicharrón prensado.\n2. Colocar el chicharrón en las tortillas de maíz.",
      },
      {
        id_recipe: 6,
        title: "Tacos de Chicharrón Flexi",
        description: "Tacos de chicharrón de tofu crujiente",
        serving_size: 2,
        preparation_time: 30,
        is_premium: 0,
        image: "tacos_tofu.jpg",
        category: "flexi",
        steps:
          "1. Marinar el tofu con salsa de soja, ajo y aceite.\n2. Cocinar el tofu marinado en la air fryer.",
      },
    ];

    // Insertar o actualizar recetas e ingredientes
    for (const recipe of recipeData) {
      const [newRecipe] = await Recipe.upsert({
        id_recipe: recipe.id_recipe,
        title: recipe.title,
        description: recipe.description,
        serving_size: recipe.serving_size,
        preparation_time: recipe.preparation_time,
        is_premium: recipe.is_premium,
        image: recipe.image,
        category: recipe.category,
        steps: recipe.steps,
      });

      // Ingredientes según la receta
      const ingredientData = [];

      if (recipe.id_recipe === 1) {
        ingredientData.push(
          {
            ingredient_name: "Carne molida de ternera",
            quantity: "125 g",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Cebolla",
            quantity: "1/2 unidad",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Ajo",
            quantity: "2 dientes",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Tomate",
            quantity: "1 unidad",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Cilantro",
            quantity: "Al gusto",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Tortillas de maíz",
            quantity: "4 unidades",
            recipe_id: newRecipe.id_recipe,
          }
        );
      }

      if (recipe.id_recipe === 2) {
        ingredientData.push(
          {
            ingredient_name: "Picada de Heura",
            quantity: "150 g",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Cebolla",
            quantity: "1/2 unidad",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Ajo",
            quantity: "2 dientes",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Tomate",
            quantity: "1 unidad",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Cilantro",
            quantity: "Al gusto",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Tortillas de maíz",
            quantity: "4 unidades",
            recipe_id: newRecipe.id_recipe,
          }
        );
      }

      if (recipe.id_recipe === 3) {
        ingredientData.push(
          {
            ingredient_name: "Pechuga de pollo",
            quantity: "200 g",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Tortillas de maíz",
            quantity: "6 unidades",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Aceite",
            quantity: "Para freír",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Lechuga",
            quantity: "Al gusto",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Crema",
            quantity: "Al gusto",
            recipe_id: newRecipe.id_recipe,
          }
        );
      }

      if (recipe.id_recipe === 4) {
        ingredientData.push(
          {
            ingredient_name: "Tofu rallado",
            quantity: "200 g",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Tortillas de maíz",
            quantity: "6 unidades",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Aceite",
            quantity: "Para freír",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Lechuga",
            quantity: "Al gusto",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Crema vegana",
            quantity: "Al gusto",
            recipe_id: newRecipe.id_recipe,
          }
        );
      }

      if (recipe.id_recipe === 5) {
        ingredientData.push(
          {
            ingredient_name: "Chicharrón prensado",
            quantity: "150 g",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Tortillas de maíz",
            quantity: "4 unidades",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Salsa verde",
            quantity: "Al gusto",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Cebolla",
            quantity: "1/2 unidad",
            recipe_id: newRecipe.id_recipe,
          }
        );
      }

      if (recipe.id_recipe === 6) {
        ingredientData.push(
          {
            ingredient_name: "Chicharrón de Tofu crujiente",
            quantity: "200 g",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Salsa de soja",
            quantity: "2 cucharadas",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Ajo",
            quantity: "2 dientes",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Aceite de oliva",
            quantity: "2 cucharadas",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Tortillas de maíz",
            quantity: "4 unidades",
            recipe_id: newRecipe.id_recipe,
          }
        );
      }

      // Insertar o actualizar ingredientes
      /*  for (const ingredient of ingredientData) {
        await RecipeIngredient.upsert({
          recipe_id: ingredient.recipe_id,
          ingredient_name: ingredient.ingredient_name,
          quantity: ingredient.quantity,
        });
      }
    }*/ // Insertar ingredientes sin duplicarlos
      for (const ingredient of ingredientData) {
        const [ingredientRecord] = await RecipeIngredient.findOrCreate({
          where: {
            recipe_id: ingredient.recipe_id,
            ingredient_name: ingredient.ingredient_name,
          },
          defaults: { quantity: ingredient.quantity },
        });

        if (ingredientRecord) {
          console.log(
            `Ingrediente '${ingredient.ingredient_name}' insertado o actualizado correctamente.`
          );
        }
      }
    }

    // Insertar o actualizar ubicaciones de mapa
    const mapLocationData = [
      {
        id: 1,
        name: "Restaurante Vegano Central",
        description: "Restaurante de comida vegana en el centro de la ciudad",
        latitude: 40.416775,
        longitude: -3.70379,
        category: "Restaurante",
      },
      {
        id: 2,
        name: "Mercado de Tacos",
        description: "Mercado con los mejores tacos de la ciudad",
        latitude: 19.432608,
        longitude: -99.133209,
        category: "Mercado",
      },
    ];

    for (const location of mapLocationData) {
      await MapLocation.upsert({
        id: location.id,
        name: location.name,
        description: location.description,
        latitude: location.latitude,
        longitude: location.longitude,
        category: location.category,
      });
    }

    // Insertar o actualizar eventos
    const eventData = [
      {
        id: 1,
        title: "Festival de Tacos",
        description: "Un festival para probar diferentes tacos",
        type: "restaurante",
        date: new Date(),
      },
      {
        id: 2,
        title: "Feria Vegana",
        description: "Una feria con comida vegana",
        type: "feria",
        date: new Date(),
      },
    ];

    for (const event of eventData) {
      await Event.upsert({
        id: event.id,
        title: event.title,
        description: event.description,
        type: event.type,
        date: event.date,
      });
    }

    console.log("Datos insertados o actualizados correctamente.");
  } catch (error) {
    console.error("Error al insertar datos iniciales:", error);
  }
};

export default insertInitialData;
