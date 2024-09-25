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
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authenticateToken = (allowedRoles = []) => async (req, res, next) => {
  try {
    const { cookies } = req;
    const accessToken = cookies.token;

    // Si no hay token, lo tratamos como "guest"
    if (!accessToken) {
      console.log("Usuario invitado (guest), no se proporcionó un token.");
      req.user = { roles: 'guest' };  // Asignamos el rol "guest"
      return next();  // Permitimos continuar, pero como invitado
    }

    // Verificamos el token
    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findByPk(decodedToken.id_user);
    if (!user) {
      return res.status(401).json({
        code: -70,
        message: "Token de acceso no válido",
      });
    }

    // Verificamos los permisos basados en el rol
    const hasPermission = allowedRoles.length === 0 || allowedRoles.includes(user.roles);

    if (!hasPermission) {
      return res.status(403).json({
        code: -10,
        message: "No tiene los permisos necesarios.",
      });
    }

    req.user = user;  // Asignamos el usuario a la petición
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Error al autenticar el token de acceso",
    });
  }
};
