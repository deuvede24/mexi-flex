import bcrypt from "bcrypt";
import User from "./models/userModel.js";
import Recipe from "./models/recipeModel.js";
import Comment from "./models/commentModel.js";
import Favorite from "./models/favoriteModel.js";
import MapLocation from "./models/mapModel.js";
import Event from "./models/eventModel.js";

const insertInitialData = async () => {
  const hashedPassword = await bcrypt.hash(
    "password123",
    parseInt(process.env.BCRYPT_SALT)
  );

  const userData = [
    {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin",
      surname: "User",
      roles: ["admin"],
      photo: null,
      location: "Location1",
      preference: "original",
      avatar: null,
    },
    {
      email: "user@example.com",
      password: hashedPassword,
      name: "User",
      surname: "Example",
      roles: ["user"],
      photo: null,
      location: "Location2",
      preference: "vegan",
      avatar: null,
    },
  ];

  await User.bulkCreate(userData, { ignoreDuplicates: true });

  const recipeData = [
    {
      user_id: 1,
      title: "Spaghetti Bolognese",
      description: "A classic Italian pasta dish with a rich, savory sauce.",
      steps: "Cook spaghetti, prepare sauce, mix together",
      category: "traditional",
      ingredients: "Spaghetti, Tomato Sauce, Ground Beef", // Ingredientes como texto
      is_premium: 0,
    },
    {
      user_id: 2,
      title: "Chicken Salad",
      description: "A fresh and healthy salad with grilled chicken.",
      steps: "Cook chicken, mix ingredients, add dressing",
      category: "traditional",
      ingredients: "Lettuce, Tomatoes, Chicken, Dressing", // Ingredientes como texto
      is_premium: 0,
    },
  ];

  // Crear recetas
  await Recipe.bulkCreate(recipeData, { ignoreDuplicates: true });
  console.log("Recetas insertadas correctamente.");

  const commentData = [
    {
      content: "Great recipe!",
      user_id: 1,
      recipe_id: 1,
    },
    {
      content: "Loved it!",
      user_id: 2,
      recipe_id: 2,
    },
  ];
  await Comment.bulkCreate(commentData, { ignoreDuplicates: true });
  console.log("Comentarios insertados correctamente.");

  const favoriteData = [
    {
      user_id: 1,
      recipe_id: 2,
    },
    {
      user_id: 2,
      recipe_id: 1,
    },
  ];
  await Favorite.bulkCreate(favoriteData, { ignoreDuplicates: true });
  console.log("Favoritos insertados correctamente.");

  // Datos de ejemplo para ubicaciones en Barcelona
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
      description:
        "El casco antiguo de Barcelona con calles estrechas y arquitectura histórica.",
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

  // Eventos de ejemplo en Barcelona
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
};

export default insertInitialData;
