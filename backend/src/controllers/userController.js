/*import User from '../models/userModel.js';
import { validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';

// Obtener detalles del usuario autenticado
export const getUser = async (req, res) => {
  try {
    const user_data = {
      id_user: req.user.id_user,
      email: req.user.email,
      name: req.user.name,
      surname: req.user.surname,
      photo: req.user.photo,
      location: req.user.location,
      preference: req.user.preference,
      avatar: req.user.avatar,
      roles: req.user.roles,
      created_at: req.user.created_at,
      updated_at: req.user.updated_at
    };

    res.status(200).json({
      code: 1,
      message: 'User Detail',
      data: user_data 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'An error occurred while obtaining the USER'
    });
  }
};

// Subir foto del usuario autenticado
export const uploadPhoto = async (req, res) => {
  try {
    const rutaArchivo = "./src/uploads/";

    if (req.file == undefined) {
      return res.status(400).json({
        code: -101,
        message: 'Please upload a file!'
      });
    }

    if (req.user.photo != null) {
      console.log("Ruta:" + rutaArchivo + req.user.photo);
      fs.access(rutaArchivo + req.user.photo, fs.constants.F_OK, (err) => {
        if (err) {
          console.log('The file does not exist or cannot be accessed');
        } else {
          fs.unlink(rutaArchivo + req.user.photo, (err) => {
            if (err) {
              console.error('Error al eliminar el archivo', err);
              return res.status(500).json({
                code: -103,
                message: 'Error deleting file',
                error: err
              });
            }
            console.log('El archivo ha sido eliminado correctamente.');
          });
        }
      });
    } else console.log("El usuario no tiene foto, la seteo en la DB");

    console.log("Guardo la imagen: " + req.file.filename + " en el id de usuario: " + req.user.id_user);
    await User.update({ photo: req.file.filename }, { where: { id_user: req.user.id_user } });
    return res.status(200).json({
      code: 1,
      message: "Uploaded the file successfully: " + req.file.originalname,
    });

  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
      error: `${err}`
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
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo usuario
export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
      res.status(404).json({ error: 'User not found' });
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
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};*/

import User from '../models/userModel.js';
import { validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';

// Obtener detalles del usuario autenticado
export const getUser = async (req, res) => {
  try {
    const user_data = {
      id_user: req.user.id_user,
      email: req.user.email,
      name: req.user.name,
      surname: req.user.surname,
      photo: req.user.photo,
      location: req.user.location,
      preference: req.user.preference,
      avatar: req.user.avatar,
      roles: req.user.roles,
      created_at: req.user.created_at,
      updated_at: req.user.updated_at
    };

    res.status(200).json({
      code: 1,
      message: 'User Detail',
      data: user_data 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'An error occurred while obtaining the USER'
    });
  }
};

// Subir foto del usuario autenticado
export const uploadPhoto = async (req, res) => {
  try {
    const rutaArchivo = "./src/uploads/";

    if (req.file == undefined) {
      return res.status(400).json({
        code: -101,
        message: 'Please upload a file!'
      });
    }

    if (req.user.photo != null) {
      console.log("Ruta:" + rutaArchivo + req.user.photo);
      fs.access(rutaArchivo + req.user.photo, fs.constants.F_OK, (err) => {
        if (err) {
          console.log('The file does not exist or cannot be accessed');
        } else {
          fs.unlink(rutaArchivo + req.user.photo, (err) => {
            if (err) {
              console.error('Error al eliminar el archivo', err);
              return res.status(500).json({
                code: -103,
                message: 'Error deleting file',
                error: err
              });
            }
            console.log('El archivo ha sido eliminado correctamente.');
          });
        }
      });
    } else console.log("El usuario no tiene foto, la seteo en la DB");

    console.log("Guardo la imagen: " + req.file.filename + " en el id de usuario: " + req.user.id_user);
    await User.update({ photo: req.file.filename }, { where: { id_user: req.user.id_user } });
    return res.status(200).json({
      code: 1,
      message: "Uploaded the file successfully: " + req.file.originalname,
    });

  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
      error: `${err}`
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
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo usuario
export const createUser = async (req, res) => {
  try {
    const { email, password, name, surname, roles, location, preference, avatar } = req.body;

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
        message: 'Ya existe un usuario con el mismo correo electrónico'
      });
    }

    // Crear un nuevo usuario
    const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      surname,
      roles,
      location,
      preference,
      avatar
    });

    // Enviar una respuesta al cliente
    res.status(201).json({
      code: 1,
      message: 'Usuario creado correctamente',
      data: newUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al registrar el usuario',
      error: error
    });
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
      res.status(404).json({ error: 'User not found' });
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
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
