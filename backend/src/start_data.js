import bcrypt from "bcrypt";
import User from "./models/userModel.js";
import Recipe from "./models/recipeModel.js";
import RecipeVersion from './models/recipeVersionModel.js';
import MapLocation from "./models/mapModel.js";
import Event from "./models/eventModel.js";
import RecipeIngredient from "./models/recipeIngredientModel.js"; // Importar el modelo de ingredientes

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
        title: "Tacos de Picadillo",
        description: "Tacos tradicionales con carne molida o Heura",
        serving_size: 4,
        preparation_time: 45,
        is_premium: 0,
        image: "tacos_picadillo.jpg",
      },
    ];

    await Recipe.bulkCreate(recipeData, {
      ignoreDuplicates: true,
      updateOnDuplicate: ["title", "description", "serving_size", "preparation_time", "is_premium", "image"],
    });

    const tacosPicadilloRecipe = await Recipe.findOne({
      where: { title: "Tacos de Picadillo" },
      attributes: ["id_recipe", "title"]
    });

    if (!tacosPicadilloRecipe) throw new Error('Receta de tacos de picadillo no encontrada.');

    // Insertar versiones de recetas (con bulkCreate y control de duplicados)
    const versionData = [
      { recipe_id: tacosPicadilloRecipe.id_recipe, version_name: "tradicional", steps: JSON.stringify([{ descripcion: "Dorar la carne molida de ternera con cebolla y ajo." }, { descripcion: "Añadir tomate y cilantro." }]) },
      { recipe_id: tacosPicadilloRecipe.id_recipe, version_name: "flexi", steps: JSON.stringify([{ descripcion: "Dorar la carne de Heura con cebolla y ajo." }, { descripcion: "Añadir tomate y cilantro." }]) },
    ];

    await RecipeVersion.bulkCreate(versionData, { ignoreDuplicates: true });

    const insertedVersions = await RecipeVersion.findAll({ where: { recipe_id: tacosPicadilloRecipe.id_recipe } });

    // Insertar ingredientes de versiones con bulkCreate
    const ingredientData = [
      // Ingredientes de la versión tradicional
      { ingredient_name: "Carne molida de ternera", imperial_quantity: "1 lb", metric_quantity: "500 g", version_id: insertedVersions.find(v => v.version_name === "tradicional").id_version },
      { ingredient_name: "Cebolla", imperial_quantity: "1 unit", metric_quantity: "1 unidad", version_id: insertedVersions.find(v => v.version_name === "tradicional").id_version },
      { ingredient_name: "Ajo", imperial_quantity: "2 cloves", metric_quantity: "2 dientes", version_id: insertedVersions.find(v => v.version_name === "tradicional").id_version },
      { ingredient_name: "Tortillas de maíz", imperial_quantity: "12 units", metric_quantity: "12 unidades", version_id: insertedVersions.find(v => v.version_name === "tradicional").id_version },
      { ingredient_name: "Cilantro", imperial_quantity: "To taste", metric_quantity: "Al gusto", version_id: insertedVersions.find(v => v.version_name === "tradicional").id_version },
      { ingredient_name: "Tomate", imperial_quantity: "1 unit", metric_quantity: "1 unidad", version_id: insertedVersions.find(v => v.version_name === "tradicional").id_version },
    
      // Ingredientes de la versión flexi
      { ingredient_name: "Carne de Heura", imperial_quantity: "1 lb", metric_quantity: "500 g", version_id: insertedVersions.find(v => v.version_name === "flexi").id_version },
      { ingredient_name: "Cebolla", imperial_quantity: "1 unit", metric_quantity: "1 unidad", version_id: insertedVersions.find(v => v.version_name === "flexi").id_version }, // Compartido con la versión tradicional
      { ingredient_name: "Ajo", imperial_quantity: "2 cloves", metric_quantity: "2 dientes", version_id: insertedVersions.find(v => v.version_name === "flexi").id_version },  // Compartido
      { ingredient_name: "Tortillas de maíz", imperial_quantity: "12 units", metric_quantity: "12 unidades", version_id: insertedVersions.find(v => v.version_name === "flexi").id_version },  // Compartido
      { ingredient_name: "Cilantro", imperial_quantity: "To taste", metric_quantity: "Al gusto", version_id: insertedVersions.find(v => v.version_name === "flexi").id_version },  // Compartido
      { ingredient_name: "Tomate", imperial_quantity: "1 unit", metric_quantity: "1 unidad", version_id: insertedVersions.find(v => v.version_name === "flexi").id_version },  // Compartido
    ];
    

    await RecipeIngredient.bulkCreate(ingredientData, { ignoreDuplicates: true });
    console.log("Ingredientes insertados correctamente.");

    // Insertar ubicaciones en el mapa
    const mapLocationData = [
      { name: "La Sagrada Familia", description: "Una famosa basílica diseñada por Antoni Gaudí.", latitude: 41.4036, longitude: 2.1744 },
      { name: "Parc Güell", description: "Un parque público con impresionantes obras de Gaudí.", latitude: 41.4145, longitude: 2.1527 },
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


