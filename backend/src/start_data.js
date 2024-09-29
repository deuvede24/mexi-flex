import bcrypt from "bcrypt";
import User from "./models/userModel.js";
import Recipe from "./models/recipeModel.js";
import RecipeVersion from './models/recipeVersionModel.js';
import MapLocation from "./models/mapModel.js";
import Event from "./models/eventModel.js";
import RecipeIngredient from "./models/recipeIngredientModel.js";

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
        serving_size: 1,
        preparation_time: 45,
        is_premium: 0,
        image: "tacos_picadillo.jpg",
      },
      {
        title: "Flautas de Pollo",
        description: "Flautas tradicionales con pollo o tofu.",
        serving_size: 1,
        preparation_time: 60,
        is_premium: 0,
        image: "flautas_pollo.jpg",
      },
      {
        title: "Tacos de Chicharrón Prensado",
        description: "Tacos tradicionales con chicharrón prensado o tofu marinado.",
        serving_size: 1,
        preparation_time: 40,
        is_premium: 0,
        image: "tacos_chicharron.jpg",
      }
    ];
    
    await Recipe.bulkCreate(recipeData, {
      ignoreDuplicates: true,
      updateOnDuplicate: ["title", "description", "serving_size", "preparation_time", "is_premium", "image"],
    });
    
    const tacosPicadilloRecipe = await Recipe.findOne({
      where: { title: "Tacos de Picadillo" },
      attributes: ["id_recipe", "title"]
    });
    
    const flautasPolloRecipe = await Recipe.findOne({
      where: { title: "Flautas de Pollo" },
      attributes: ["id_recipe", "title"]
    });
    const tacosChicharronRecipe = await Recipe.findOne({
      where: { title: "Tacos de Chicharrón Prensado" },
      attributes: ["id_recipe", "title"]
    });
    
    if (!tacosChicharronRecipe) throw new Error('Receta Tacos de Chicharrón Prensado no encontrada.');
    if (!tacosPicadilloRecipe || !flautasPolloRecipe) throw new Error('Receta no encontrada.');
    
    // Insertar versiones de recetas sin JSON.stringify
    const versionData = [
      { recipe_id: tacosPicadilloRecipe.id_recipe, version_name: "tradicional", steps: [{ descripcion: "Dorar la carne molida de ternera con cebolla y ajo." }, { descripcion: "Añadir tomate y cilantro." }]},
      { recipe_id: tacosPicadilloRecipe.id_recipe, version_name: "flexi", steps: [{ descripcion: "Dorar la carne de Heura con cebolla y ajo." }, { descripcion: "Añadir tomate y cilantro." }] },
      { recipe_id: flautasPolloRecipe.id_recipe, version_name: "tradicional", steps: [{ descripcion: "Cocinar la pechuga de pollo y desmenuzarla." }, { descripcion: "Rellenar las tortillas con el pollo y freírlas hasta que estén doradas." }] },
      { recipe_id: flautasPolloRecipe.id_recipe, version_name: "flexi", steps: [{ descripcion: "Rallar el tofu, sazonarlo y cocinarlo en la air fryer." }, { descripcion: "Rellenar las tortillas con el tofu y freírlas hasta que estén doradas." }] },
      { 
        recipe_id: tacosChicharronRecipe.id_recipe, 
        version_name: "tradicional", 
        steps: [
          { descripcion: "Cocinar el chicharrón prensado en una sartén hasta que esté bien dorado." },
          { descripcion: "Colocar el chicharrón en las tortillas de maíz." },
          { descripcion: "Acompañar con pico de gallo, salsa y limón al gusto." }
        ]
      },
      { 
        recipe_id: tacosChicharronRecipe.id_recipe, 
        version_name: "flexi", 
        steps: [
          { descripcion: "Romper el tofu con las manos en pequeños pedazos no uniformes." },
          { descripcion: "Marinar el tofu con pimentón rojo, comino, ajo, salsa de soja, aceite de oliva y levadura nutricional durante 5 minutos." },
          { descripcion: "Colocar el tofu marinado en la air fryer durante 10 minutos o hasta que esté crujiente como chicharrón." },
          { descripcion: "Colocar el chicharrón de tofu en las tortillas de maíz." },
          { descripcion: "Acompañar con pico de gallo, salsa y limón al gusto." }
        ]
      }
    
    ];
    
    for (const version of versionData) {
      const existingVersion = await RecipeVersion.findOne({
        where: { recipe_id: version.recipe_id, version_name: version.version_name },
      });
    
      if (!existingVersion) {
        await RecipeVersion.create(version);
        console.log(`Versión '${version.version_name}' insertada correctamente.`);
      } else {
        console.log(`Versión '${version.version_name}' ya existe, no se insertó.`);
      }
    }
    
    const insertedVersions = await RecipeVersion.findAll({
      where: {
        recipe_id: [tacosPicadilloRecipe.id_recipe, flautasPolloRecipe.id_recipe, tacosChicharronRecipe.id_recipe]
      }
    });
    
    console.log("Versiones insertadas:", insertedVersions);
    console.log("Versiones insertadas o encontradas:", insertedVersions.map(v => v.id_version));
    
    // Insertar ingredientes de versiones con bulkCreate
    const ingredientData = [
      // Ingredientes de la versión tradicional de tacos
      { ingredient_name: "Carne molida de ternera", imperial_quantity: "1/4 lb", metric_quantity: "125 g", version_id: insertedVersions.find(v => v.version_name === "tradicional" && v.recipe_id === tacosPicadilloRecipe.id_recipe).id_version },
      // Más ingredientes aquí...
    ];
    console.log("Datos de ingredientes a insertar:", ingredientData);
    await RecipeIngredient.bulkCreate(ingredientData, { ignoreDuplicates: true });
    console.log("Ingredientes insertados correctamente.");
    


    

    // Insertar ubicaciones en el mapa
    const mapLocationData = [
      { name: "La Sagrada Familia", description: "Una famosa basílica diseñada por Antoni Gaudí.", latitude: 41.4036, longitude: 2.1744, category: 'park' },
      { name: "Parc Güell", description: "Un parque público con impresionantes obras de Gaudí.", latitude: 41.4145, longitude: 2.1527, category: 'park' },
      { name: "Casa Batlló", description: "Un edificio modernista diseñado por Gaudí.", latitude: 41.3916, longitude: 2.1649, category: 'Museos' },
      { name: "Barrio Gótico", description: "El casco antiguo de Barcelona con calles estrechas y mucha historia.", latitude: 41.3833, longitude: 2.1833, category: 'Museos' },
      { name: "Museo Picasso", description: "Un museo dedicado a las obras del pintor Pablo Picasso.", latitude: 41.3851, longitude: 2.1805, category: 'Museos' },
      { name: "Plaza Catalunya", description: "Un punto central de Barcelona con tiendas y restaurantes.", latitude: 41.3879, longitude: 2.16992, category: 'park' },
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



