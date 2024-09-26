import bcrypt from "bcrypt";
import User from "./models/userModel.js";
import Recipe from "./models/recipeModel.js";
import RecipeVersion from './models/recipeVersionModel.js';
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
        title: "Tacos de Picadillo",
        description:
          "Tacos tradicionales con carne molida de ternera o versión flexi con Heura.",
        category: "traditional",
        serving_size: 4,
        preparation_time: 45,
        is_premium: 0,
        image: "tacos_picadillo.jpg",
      }
    ];

    // Insertar las recetas
    await Recipe.bulkCreate(recipeData, {
      ignoreDuplicates: true,
      updateOnDuplicate: [
        "title",
        "description",
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

    const tacosPicadilloRecipe = insertedRecipes.find(recipe => recipe.title === "Tacos de Picadillo");

    if (!tacosPicadilloRecipe) {
      throw new Error("La receta 'Tacos de Picadillo' no fue encontrada.");
    }

    // Insertar versiones de la receta
    const versionData = [
      {
        recipe_id: tacosPicadilloRecipe.id_recipe,
        version_name: "tradicional",
        steps: [
          { descripcion: "Dorar la carne molida de ternera con cebolla y ajo." },
          { descripcion: "Agregar tomate, cilantro y cocinar a fuego lento." },
          { descripcion: "Servir en tortillas de maíz calientes." }
        ]
      },
      {
        recipe_id: tacosPicadilloRecipe.id_recipe,
        version_name: "flexi",
        steps: [
          { descripcion: "Dorar la carne de Heura con cebolla y ajo." },
          { descripcion: "Agregar tomate, cilantro y cocinar a fuego lento." },
          { descripcion: "Servir en tortillas de maíz calientes." }
        ]
      }
    ];

    await RecipeVersion.bulkCreate(versionData, { ignoreDuplicates: true });

    // Obtener IDs de las versiones recién insertadas
    const insertedVersions = await RecipeVersion.findAll({
      where: {
        recipe_id: tacosPicadilloRecipe.id_recipe,
      },
      attributes: ["id_version", "version_name"],
    });

    const traditionalVersion = insertedVersions.find(version => version.version_name === "tradicional");
    const flexiVersion = insertedVersions.find(version => version.version_name === "flexi");

    // Insertar ingredientes asociados a las versiones
    const ingredientsData = [
      // Ingredientes para la versión tradicional
      {
        version_id: traditionalVersion.id_version,
        ingredient_name: "Carne molida de ternera",
        imperial_quantity: "1 lb",
        metric_quantity: "500 g"
      },
      {
        version_id: traditionalVersion.id_version,
        ingredient_name: "Cebolla",
        imperial_quantity: "1 unit",
        metric_quantity: "1 unidad"
      },
      {
        version_id: traditionalVersion.id_version,
        ingredient_name: "Ajo",
        imperial_quantity: "2 cloves",
        metric_quantity: "2 dientes"
      },
      {
        version_id: traditionalVersion.id_version,
        ingredient_name: "Tortillas de maíz",
        imperial_quantity: "12 units",
        metric_quantity: "12 unidades"
      },
      {
        version_id: traditionalVersion.id_version,
        ingredient_name: "Cilantro",
        imperial_quantity: "To taste",
        metric_quantity: "Al gusto"
      },
      {
        version_id: traditionalVersion.id_version,
        ingredient_name: "Tomate",
        imperial_quantity: "1 unit",
        metric_quantity: "1 unidad"
      },

      // Ingredientes para la versión flexi
      {
        version_id: flexiVersion.id_version,
        ingredient_name: "Carne de Heura",
        imperial_quantity: "1 lb",
        metric_quantity: "500 g"
      },
      {
        version_id: flexiVersion.id_version,
        ingredient_name: "Cebolla",
        imperial_quantity: "1 unit",
        metric_quantity: "1 unidad"
      },
      {
        version_id: flexiVersion.id_version,
        ingredient_name: "Ajo",
        imperial_quantity: "2 cloves",
        metric_quantity: "2 dientes"
      },
      {
        version_id: flexiVersion.id_version,
        ingredient_name: "Tortillas de maíz",
        imperial_quantity: "12 units",
        metric_quantity: "12 unidades"
      },
      {
        version_id: flexiVersion.id_version,
        ingredient_name: "Cilantro",
        imperial_quantity: "To taste",
        metric_quantity: "Al gusto"
      },
      {
        version_id: flexiVersion.id_version,
        ingredient_name: "Tomate",
        imperial_quantity: "1 unit",
        metric_quantity: "1 unidad"
      }
    ];

    await RecipeIngredient.bulkCreate(ingredientsData, { ignoreDuplicates: true });

    console.log("Recetas, versiones e ingredientes insertados correctamente.");

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
