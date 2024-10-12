import User from "../models/userModel.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Obtener detalles del usuario autenticado
export const getUser = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(403)
        .json({ message: "No se ha encontrado el usuario" });
    }

    const user_data = {
      id_user: req.user.id_user,
      email: req.user.email,
      username: req.user.username,
      avatar: req.user.avatar,
      created_at: req.user.created_at,
      updated_at: req.user.updated_at,
    };

    res.status(200).json({
      code: 1,
      message: "User Detail",
      data: user_data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Error al obtener los detalles del usuario",
    });
  }
};

// Crear un nuevo usuario
export const createUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Validar datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verificar si ya existe un usuario con el mismo correo electrónico
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        code: -2,
        message: "Ya existe un usuario con el mismo correo electrónico",
      });
    }

    // Generar avatar por defecto usando DiceBear
    const avatar = `https://avatars.dicebear.com/api/initials/${username}.svg`;

    // Crear un nuevo usuario
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT)
    );
    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
      avatar,
    });

    // Enviar una respuesta al cliente
    res.status(201).json({
      code: 1,
      message: "Usuario creado correctamente",
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Ha ocurrido un error al registrar el usuario",
      error: error,
    });
  }
};

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.update(req.body);
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar el avatar del usuario
export const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({
        code: -101,
        message: "No avatar provided!",
      });
    }

    await User.update({ avatar }, { where: { id_user: req.user.id_user } });

    res.status(200).json({
      code: 1,
      message: "Avatar updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "An error occurred while updating the avatar",
    });
  }
};

