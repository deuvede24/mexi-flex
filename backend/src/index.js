// src/index.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js"; // Importar correctamente
import testRoutes from "./routes/testRoutes.js"; // Si esto es necesario
import commentRoutes from "./routes/commentRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import ingredientRoutes from "./routes/ingredientRoutes.js";
import recipeIngredientRoutes from "./routes/recipeIngredientRoutes.js";
//import mapLocationRoutes from './routes/mapRoutes.js'
import mapRoutes from './routes/mapRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import chartRoutes from './routes/chartRoutes.js';


import { testConnection } from "./db.js";
import insertInitialData from "./start_data.js";

const app = express();

// Configura CORS para permitir solicitudes desde el frontend
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:4200",
  })
);

// Middleware para analizar cookies y el cuerpo de las solicitudes
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//const initializeServer = async () => {
await testConnection();
await insertInitialData();

// Configurar rutas
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use('/recipes', recipeRoutes); // Asegúrate de que esta línea esté correcta
app.use("/test", testRoutes); // Si esto es necesario
app.use("/comments", commentRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/ingredients", ingredientRoutes);
app.use("/recipe-ingredients", recipeIngredientRoutes);
//app.use('/locations', mapLocationRoutes);
app.use('/map', mapRoutes);
app.use('/events', eventRoutes);  // Añadir las rutas de eventos
app.use('/api/charts', chartRoutes); 



// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
//};

//initializeServer();
