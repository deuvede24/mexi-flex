// src/models/userModel.js
import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const User = sequelize.define(
  "User",
  {
    id_user: {
      type: DataTypes.INTEGER(8).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      //  unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
     /*roles: {
      type: DataTypes.STRING(30),
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("roles");
        if (!rawValue) {
          return [];
        }
        return rawValue.split(",");
      },
  
      set(value) {
        if (Array.isArray(value)) {
            this.setDataValue('roles', value.join(','));
        } else {
            this.setDataValue('roles', value); // O maneja el caso de que value no sea un array de otra manera
        }
        
    },
    
    },*/
    roles: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "user",
    },

    avatar: {
      // Puede ser la ruta de la imagen subida o la URL generada por la API
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "users",
    indexes: [{ unique: true, fields: ["email"] }],
    timestamps: true,
    updatedAt: "updated_at",
    createdAt: "created_at",
  }
);

export default User;
