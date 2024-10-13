import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import RecoveryToken from "../models/recoveryTokenModel.js";
import sendEmail from "../utils/email/sendEmail.js";
import { validationResult } from "express-validator";
import { serialize } from "cookie";

const clientURL = process.env.CLIENT_URL;

// Registro
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, username } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: "Ya existe un usuario con el mismo correo electrónico",
      });
    }

    const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
    // Crear un avatar con DiceBear en base al username
    const avatar = `https://avatars.dicebear.com/api/initials/${username}.svg`;

    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
      avatar,
    });

    const accessToken = jwt.sign(
      { id_user: newUser.id_user, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const token = serialize("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    res.setHeader("Set-Cookie", token);

    res.status(200).json({
      message: "Usuario registrado correctamente",
      user: {
        id_user: newUser.id_user,
        email: newUser.email,
        username: newUser.username,
        avatar: newUser.avatar, // Devolver el avatar generado
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al registrar el usuario",
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Email o contraseña incorrectos" });
    }

    const accessToken = jwt.sign(
      { id_user: user.id_user, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const token_jwt = serialize("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    res.setHeader("Set-Cookie", token_jwt);

    res.status(200).json({
      message: "Login exitoso",
      user: {
        id_user: user.id_user,
        email: user.email,
        username: user.username,
        avatar: user.avatar, // Incluir avatar en la respuesta
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno en el servidor" });
  }
};

// Logout
export const logout = async (req, res) => {
  console.log('NODE_ENV:', process.env.NODE_ENV); // Aquí verificas el valor de NODE_ENV

  const token = serialize("token", null, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: "lax",
    maxAge: -1,
    path: "/",
  });
  res.setHeader("Set-Cookie", token);
  res.status(200).json({ message: "Logout exitoso" });
};

// Recuperar Contraseña
export const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Email no existe" });
    }

    let resetToken = crypto.randomBytes(32).toString("hex");

    await RecoveryToken.create({
      user_id: user.id_user,
      token: resetToken,
    });

    const link = `${clientURL}/change-password?token=${resetToken}&id=${user.id_user}`;

    await sendEmail(user.email, "Password Reset Request", {
      name: user.username,
      link,
    });

    res.status(200).json({
      message: "Correo enviado para restablecer contraseña",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al enviar el correo",
    });
  }
};

// Cambiar Contraseña
export const changePassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const token_row = await RecoveryToken.findOne({ where: { token } });
    if (!token_row) {
      return res.status(404).json({ message: "Token inválido" });
    }

    const user = await User.findOne({ where: { id_user: token_row.user_id } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.password = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
    await user.save();

    await RecoveryToken.destroy({ where: { user_id: token_row.user_id } });

    res.status(200).json({ message: "Contraseña cambiada con éxito" });
  } catch (error) {
    res.status(500).json({
      message: "Error al cambiar la contraseña",
    });
  }
};

// Verificar autenticación
export const checkAuth = async (req, res) => {
  try {
    res.status(200).json({ isLoggedIn: true });
  } catch (error) {
    res.status(401).json({ isLoggedIn: false });
  }
};
