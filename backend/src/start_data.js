import bcrypt from "bcrypt";
import User from "./models/userModel.js";
import Recipe from "./models/recipeModel.js";
import MapLocation from "./models/mapModel.js";
import Event from "./models/eventModel.js";
import RecipeIngredient from "./models/recipeIngredientModel.js"; // Importar el modelo de ingredientes

const insertInitialData = async () => {
  try {
    const hashedPassword = await bcrypt.hash(
      "password123",
      parseInt(process.env.BCRYPT_SALT)
    );

    // Insertar usuarios
    const userData = [
      {
        email: "admin@example.com",
        password: hashedPassword,
        username: "admin",
        roles: "admin",
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

    await User.bulkCreate(userData, { ignoreDuplicates: true });
    console.log("Usuarios insertados correctamente.");

    // Insertar recetas
    const recipeData = [
      {
        title: "Tacos de Tofu",
        description:
          "Deliciosos tacos veganos hechos con tofu marinado y verduras frescas.",
        steps: [
          { descripcion: "Marinar el tofu con salsa de soja, ajo y limón." },
          { descripcion: "Freír el tofu y mezclar con las verduras frescas." },
          { descripcion: "Servir con tortillas calientes." },
        ],
        category: "flexi",
        serving_size: 1,
        preparation_time: 20,
        is_premium: 0,
        image: null,
      },
      {
        title: "Ensalada de Quinoa",
        description:
          "Ensalada saludable con quinoa, verduras frescas y aderezo de limón.",
        steps: [
          { descripcion: "Cocinar la quinoa según las instrucciones del paquete." },
          { descripcion: "Picar el pepino, tomate y cebolla en trozos pequeños." },
          { descripcion: "Mezclar la quinoa cocida con las verduras." },
          { descripcion: "Añadir jugo de limón, aceite de oliva y sal al gusto." },
          { descripcion: "Refrigerar durante 15 minutos antes de servir." },
        ],
        category: "flexi",
        serving_size: 2,
        preparation_time: 50,
        is_premium: 0,
        image: null,
      },
    ];

    // Insertar las recetas
    await Recipe.bulkCreate(recipeData, {
      ignoreDuplicates: true,
      updateOnDuplicate: [
        "title",
        "description",
        "steps",
        "category",
        "is_premium",
        "serving_size",
        "preparation_time",
        "image",
      ],
    });

    // Obtener IDs de las recetas recién insertadas
    const insertedRecipes = await Recipe.findAll({
      where: {
        title: recipeData.map((r) => r.title),
      },
      attributes: ["id_recipe", "title"],
    });

    console.log("Recetas insertadas:", insertedRecipes);

    // Verificar si los IDs están presentes y si no, lanzar un error
    insertedRecipes.forEach((recipe) => {
      if (!recipe.id_recipe) {
        throw new Error(`ID de receta es null para la receta: ${recipe.title}`);
      }
      console.log("ID de receta:", recipe.id_recipe);
    });

    // Insertar ingredientes asociados a las recetas
    const ingredientsData = [
      // Ingredientes para "Tacos de Tofu"
      {
        recipe_id: insertedRecipes[0].id_recipe,
        ingredient_name: "Tofu",
        imperial_quantity: "8 oz",
        metric_quantity: "200g",
      },
      {
        recipe_id: insertedRecipes[0].id_recipe,
        ingredient_name: "Salsa de soja",
        imperial_quantity: "2 tbsp",
        metric_quantity: "30ml",
      },
      {
        recipe_id: insertedRecipes[0].id_recipe,
        ingredient_name: "Ajo",
        imperial_quantity: "2 cloves",
        metric_quantity: "2 dientes",
      },
      {
        recipe_id: insertedRecipes[0].id_recipe,
        ingredient_name: "Limón",
        imperial_quantity: "1 unit",
        metric_quantity: "1 unidad",
      },
      {
        recipe_id: insertedRecipes[0].id_recipe,
        ingredient_name: "Verduras frescas",
        imperial_quantity: "to taste",
        metric_quantity: "al gusto",
      },
      {
        recipe_id: insertedRecipes[0].id_recipe,
        ingredient_name: "Tortillas",
        imperial_quantity: "4 units",
        metric_quantity: "4 unidades",
      },
      // Ingredientes para "Ensalada de Quinoa"
      {
        recipe_id: insertedRecipes[1].id_recipe,
        ingredient_name: "Quinoa",
        imperial_quantity: "1 cup",
        metric_quantity: "200g",
      },
      {
        recipe_id: insertedRecipes[1].id_recipe,
        ingredient_name: "Pepino",
        imperial_quantity: "1 unit",
        metric_quantity: "1 unidad",
      },
      {
        recipe_id: insertedRecipes[1].id_recipe,
        ingredient_name: "Tomate",
        imperial_quantity: "2 units",
        metric_quantity: "2 unidades",
      },
      {
        recipe_id: insertedRecipes[1].id_recipe,
        ingredient_name: "Cebolla",
        imperial_quantity: "1/2 unit",
        metric_quantity: "1/2 unidad",
      },
      {
        recipe_id: insertedRecipes[1].id_recipe,
        ingredient_name: "Limón",
        imperial_quantity: "1 unit",
        metric_quantity: "1 unidad",
      },
      {
        recipe_id: insertedRecipes[1].id_recipe,
        ingredient_name: "Aceite de oliva",
        imperial_quantity: "2 tbsp",
        metric_quantity: "30ml",
      },
      {
        recipe_id: insertedRecipes[1].id_recipe,
        ingredient_name: "Sal",
        imperial_quantity: "to taste",
        metric_quantity: "al gusto",
      },
    ];

    try {
      await RecipeIngredient.bulkCreate(ingredientsData, {
        ignoreDuplicates: true,
      });
      console.log("Ingredientes insertados correctamente.");
    } catch (error) {
      console.error("Error al insertar ingredientes:", error);
    }

    // Insertar ubicaciones en el mapa
    const mapLocationData = [
      {
        name: "La Sagrada Familia",
        description: "Una famosa basílica diseñada por Antoni Gaudí.",
        latitude: 41.4036,
        longitude: 2.1744,
      },
      {
        name: "Parc Güell",
        description: "Un parque público con impresionantes obras de Gaudí.",
        latitude: 41.4145,
        longitude: 2.1527,
      },
      {
        name: "Casa Batlló",
        description: "Un edificio modernista diseñado por Gaudí.",
        latitude: 41.3916,
        longitude: 2.1649,
        category: "Museos",
      },
      {
        name: "Barri Gòtic (Barrio Gótico)",
        description: "El casco antiguo de Barcelona con calles estrechas y arquitectura histórica.",
        latitude: 41.3833,
        longitude: 2.1833,
        category: "Museos",
      },
      {
        name: "Museu Picasso",
        description: "Un museo dedicado a las obras del pintor Pablo Picasso.",
        latitude: 41.3851,
        longitude: 2.1805,
        category: "Museos",
      },
    ];

    await MapLocation.bulkCreate(mapLocationData, { ignoreDuplicates: true });
    console.log("Ubicaciones del mapa insertadas correctamente.");

    // Insertar eventos de ejemplo
    const eventData = [
      {
        title: "Lanzamiento de Receta Tacos Veganos",
        description: "Receta especial de tacos veganos para el público",
        type: "receta",
        date: new Date("2024-09-16"),
      },
      {
        title: "Apertura de Restaurante Vegano",
        description: "Un nuevo restaurante vegano abrirá sus puertas",
        type: "restaurante",
        date: new Date("2024-09-20"),
      },
    ];

    try {
      for (const event of eventData) {
        const existingEvent = await Event.findOne({
          where: { title: event.title, date: event.date },
        });

        if (!existingEvent) {
          await Event.create(event);
          console.log(`Evento ${event.title} insertado correctamente`);
        } else {
          console.log(`Evento ${event.title} ya existe, no se insertó`);
        }
      }
    } catch (error) {
      console.error("Error al insertar eventos:", error);
    }
  } catch (error) {
    console.error("Error en el proceso de inserción de datos:", error);
  }
};

export default insertInitialData;
