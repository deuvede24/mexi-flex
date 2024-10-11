// src/middlewares/authenticateToken.js
/*import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authenticateToken = (allowedRoles) => async (req, res, next) => {
  try {
    const { cookies } = req;
    const accessToken = cookies.token;

    // Intentamos obtener el token de la cabecera "Authorization"
    //--
    //const authHeader = req.headers['authorization'];
    //const accessToken = authHeader && authHeader.split(' ')[1];

    // if (!accessToken) {
    if (!accessToken) {
      console.log("No se ha proporcionado un token de acceso");
      return res.status(401).json({
        code: -50,
        message: "No se ha proporcionado un token de acceso",
      });
    }

    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findByPk(decodedToken.id_user);
    if (!user) {
      return res.status(401).json({
        code: -70,
        message: "Token de acceso no válido",
      });
    }

const hasPermission = allowedRoles.includes(user.roles);


    if (!hasPermission) {
      return res.status(403).json({
        code: -10,
        message: "No tiene los permisos necesarios.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Ha ocurrido un error al autenticar el token de acceso",
    });
  }
};*/

// src/middlewares/authenticateToken.js
/*import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authenticateToken =
  (allowedRoles = []) =>
  async (req, res, next) => {
    try {
      console.log("Middleware authenticateToken ejecutado");
      const { cookies } = req;
      console.log("Contenido de las cookies recibidas:", cookies);
      console.log("Contenido de las cookies recibidas:", req.cookies);

      const accessToken = cookies.token;
      console.log("Cookie recibida:", accessToken);

      // Si no hay token, lo tratamos como "guest"
      if (!accessToken) {
        console.log("Usuario invitado (guest), no se proporcionó un token.");
        req.user = { roles: "guest" }; // Asignamos el rol "guest"
        return next(); // Permitimos continuar, pero como invitado
      }

      // Verificamos el token
      const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
      console.log("Token verificado correctamente:", decodedToken);

      console.log("Token decodificado:", decodedToken); // Asegúrate de que aquí está el id_user correcto
      const user = await User.findByPk(decodedToken.id_user);
      console.log("Usuario encontrado en la base de datos:", user); // Verificamos si se encuentra el usuario en la base de datos
      if (!user) {
        return res.status(401).json({
          code: -70,
          message: "Token de acceso no válido",
        });
      }

      ///////////////////
      // Si el usuario es el admin (id_user === 1), asignamos el rol "admin"
      if (user.id_user === 1) {
        user.roles = "admin"; // Establecemos el rol de admin si es el usuario con id 1
        console.log("Rol del usuario: admin");
      } else {
        user.roles = "user"; // Cualquier otro usuario es un 'user'
        console.log("Rol del usuario: user");
      } ////////

      console.log("ID del usuario:", user.id_user);
      console.log("Rol del usuario asignado:", user.roles);
      req.user = user; // Asignamos el usuario a la petición

      // Verificamos los permisos basados en el rol
      const hasPermission =
        allowedRoles.length === 0 || allowedRoles.includes(user.roles);

      if (!hasPermission) {
        return res.status(403).json({
          code: -10,
          message: "No tiene los permisos necesarios.",
        });
      }

      next();
    } catch (error) {
      console.error("Error en el middleware authenticateToken:", error);
      res.status(500).json({
        code: -100,
        message: "Error al autenticar el token de acceso",
      });
    }
  };*/


 ////////////////////////////////////////////////////////////////////
 /* import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authenticateToken =
  (allowedRoles = []) =>
  async (req, res, next) => {
    try {
      console.log("Middleware authenticateToken ejecutado");
      console.log("Cookies recibidas en authenticateToken:", req.cookies);

      const { cookies } = req;
      const accessToken = cookies.token;

      console.log("Cookie recibida:", accessToken);

      // Si no hay token, tratamos al usuario como "guest"
      if (!accessToken) {
        console.log("Usuario invitado (guest), no se proporcionó un token.");
        req.user = { roles: "guest" }; // Asignamos el rol "guest"
        return next(); // Continuamos, pero como invitado
      }

      // Verificamos el token
      let decodedToken;
      try {
        decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
        console.log("JWT_SECRET en el middleware:", process.env.JWT_SECRET);

      } catch (err) {
        console.error("Token inválido:", err);
        return res.status(403).json({ message: "Token inválido o expirado." });
      }

      console.log("Token verificado correctamente:", decodedToken);

      // Asegurarnos de que el token tiene el campo `id_user`
      if (!decodedToken.id_user) {
        return res.status(400).json({
          code: -20,
          message: "Token inválido, no se encontró el ID de usuario",
        });
      }console.log("JWT_SECRET en el middleware:", process.env.JWT_SECRET);


      // Buscar el usuario por el `id_user` decodificado del token
      const user = await User.findByPk(decodedToken.id_user);

      // Verificamos si el usuario existe en la base de datos
      if (!user) {
        return res.status(401).json({
          code: -70,
          message: "Token de acceso no válido. Usuario no encontrado.",
        });
      }

      // Asignar el rol basado en el ID del usuario
      if (user.id_user === 1) {
        user.roles = "admin"; // Establecer como admin si es el usuario con id 1
        console.log("Rol del usuario: admin");
      } else {
        user.roles = "user"; // Asignar rol "user" a otros usuarios
        console.log("Rol del usuario: user");
      }

      console.log("ID del usuario:", user.id_user);
      console.log("Rol del usuario asignado:", user.roles);
      
      // Asignar el usuario y su rol al objeto `req`
      req.user = user;

      // Verificamos si el usuario tiene los permisos necesarios
      const hasPermission =
        allowedRoles.length === 0 || allowedRoles.includes(user.roles);

      if (!hasPermission) {
        return res.status(403).json({
          code: -10,
          message: "No tiene los permisos necesarios.",
        });
      }

      // Si todo está bien, continuamos al siguiente middleware
      next();
    } catch (error) {
      console.error("Error en el middleware authenticateToken:", error);
      return res.status(500).json({
        code: -100,
        message: "Error al autenticar el token de acceso",
      });
    }
  };
*/


import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authenticateToken = (allowedRoles = []) => async (req, res, next) => {
  try {
    const { cookies } = req;
    const accessToken = cookies.token;

    // Si no hay token, tratamos al usuario como "guest"
    if (!accessToken) {
      req.user = { roles: "guest" }; 
      return next(); 
    }

    // Verificamos el token JWT
    try {
      const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
      const user = await User.findByPk(decodedToken.id_user);

      if (!user) {
        return res.status(401).json({ message: 'Token inválido.' });
      }

      req.user = user; // Asignamos el usuario al objeto req
      next(); // Continuamos al siguiente middleware

    } catch (error) {
      return res.status(403).json({ message: 'Token inválido o expirado.' });
    }

  } catch (error) {
    return res.status(500).json({ message: 'Error al autenticar el token de acceso' });
  }
};
