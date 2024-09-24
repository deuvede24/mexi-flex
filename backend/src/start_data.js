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
  // const hashedPassword2 = await bcrypt.hash("111111", 10);; // Para los usuarios con contraseña "111111"
  // Insertar usuarios

  const userData = [
    {
      email: "admin@example.com",
      password: hashedPassword,
      username: "admin",
      roles: "admin",
      avatar: null, // URL de avatar opcional
    },
    {
      email: "user@example.com",
      password: hashedPassword,
      username: "user",
      roles: "user",
      avatar: null, // URL de avatar opcional
    },
    {
      email: "carolina@gmail.com",
      password: hashedPassword,
      username: "carol",
      roles: "user",
      avatar: null, // URL de avatar opcional
    },
    {
      email: "dogbark@gmail.com",
      password: hashedPassword,
      username: "dog",
      roles: "user",
      avatar: null, // URL de avatar opcional
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
        { descripcion: "Servir con tortillas calientes." }
      ],
      category: "flexi",
      ingredients: [
        { nombre: "Tofu", cantidad: { imperial: "8 oz", metric: "200g" } },
        {
          nombre: "Salsa de soja",
          cantidad: { imperial: "2 tbsp", metric: "30ml" },
        },
        {
          nombre: "Ajo",
          cantidad: { imperial: "2 cloves", metric: "2 dientes" },
        },
        {
          nombre: "Limón",
          cantidad: { imperial: "1 unit", metric: "1 unidad" },
        },
        {
          nombre: "Verduras frescas",
          cantidad: { imperial: "to taste", metric: "al gusto" },
        },
        {
          nombre: "Tortillas",
          cantidad: { imperial: "4 units", metric: "4 unidades" },
        },
      ],
      serving_size: 1,
      preparation_time: 20,
      is_premium: 0,
      image: null, // Aquí podrías añadir la URL o el nombre del archivo de la imagen si tienes
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
        { descripcion: "Refrigerar durante 15 minutos antes de servir." }
      ],
      category: "flexi",
      ingredients: [
        { nombre: "Quinoa", cantidad: { imperial: "1 cup", metric: "200g" } },
        {
          nombre: "Pepino",
          cantidad: { imperial: "1 unit", metric: "1 unidad" },
        },
        {
          nombre: "Tomate",
          cantidad: { imperial: "2 units", metric: "2 unidades" },
        },
        {
          nombre: "Cebolla",
          cantidad: { imperial: "1/2 unit", metric: "1/2 unidad" },
        },
        {
          nombre: "Limón",
          cantidad: { imperial: "1 unit", metric: "1 unidad" },
        },
        {
          nombre: "Aceite de oliva",
          cantidad: { imperial: "2 tbsp", metric: "30ml" },
        },
        {
          nombre: "Sal",
          cantidad: { imperial: "to taste", metric: "al gusto" },
        },
      ],
      serving_size: 2,
      preparation_time: 50,
      is_premium: 0,
      image: null, // Aquí podrías añadir la URL o el nombre del archivo de la imagen si tienes
    },
  ];

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
  console.log("Insertando comentarios...");
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
