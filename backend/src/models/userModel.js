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
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    roles: {
      type: DataTypes.STRING(30),
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("roles");
        if (!rawValue) {
          return [];
        }
        return rawValue.split(",");
      },
      /*set(value) {
        this.setDataValue("roles", value.join(","));
      },*/
      set(value) {
        if (Array.isArray(value)) {
            this.setDataValue('roles', value.join(','));
        } else {
            this.setDataValue('roles', value); // O maneja el caso de que value no sea un array de otra manera
        }
        
    },
    
    },
    photo: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    preference: {
      type: DataTypes.ENUM("original", "vegan", "vegetarian"),
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    indexes: [{ unique: true, fields: ["email"] }],
    timestamps: true,
    updatedAt: "updated_at",
    createdAt: "created_at",
  }
);

export default User;
