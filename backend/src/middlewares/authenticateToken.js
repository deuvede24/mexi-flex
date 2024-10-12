import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authenticateToken = () => async (req, res, next) => {
  try {
    const { cookies } = req;
    const accessToken = cookies.token;

    // Si no hay token, redirige a la página de inicio o deniega el acceso
    if (!accessToken) {
      req.user = null; // No hay usuario autenticado
      return next(); // Continuamos al siguiente middleware
    }

    // Verificamos el token JWT
    try {
      const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
      const user = await User.findByPk(decodedToken.id_user);

      if (!user) {
        return res.status(401).json({ message: "Invalid token." });
      }

      req.user = user; // Asignamos el usuario al objeto req
      next(); // Continuamos al siguiente middleware
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error authenticating access token." });
  }
};
