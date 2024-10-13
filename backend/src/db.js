import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USER_NAME,
  process.env.PASSWORD,
  {
    host: process.env.HOST_NAME,
    dialect: "mysql",
  }
);

const syncroModel = async () => {
  try {
    // Sincronizar el modelo con la base de datos (crear la tabla si no existe)
    // Con "alter: true" se sincronizan las columnas y se crean/eliminan si fuera necesario

    console.log(sequelize.models);
    console.log("Modelos registrados:", Object.keys(sequelize.models));
    
    await sequelize.sync({ alter: true }).then(() => {
      console.log("Modelos sincronizado con la base de datos");
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

const testConnection = async () => {
  try {
    await
    sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await syncroModel();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { sequelize, testConnection };
