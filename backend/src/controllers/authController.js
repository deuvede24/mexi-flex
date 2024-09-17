import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import RecoveryToken from '../models/recoveryTokenModel.js';
import sendEmail from "../utils/email/sendEmail.js";
import { validationResult } from 'express-validator';
import { serialize } from 'cookie';
// Creación de funciones personalizadas
import { esPar, contraseniasCoinciden } from '../utils/utils.js';

const clietURL = process.env.CLIENT_URL;

export const register = async (req, res) => {
  try {
    console.log("Datos recibidos en el registro:", req.body); // Log de los datos recibidos

    const errors = validationResult(req);

    // Si hay errores de validación, responde con un estado 400 Bad Request
    if (!errors.isEmpty()) {
      console.log("Errores de validación:", errors.array()); // Log de los errores de validación
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, surname, location, preference, avatar } = req.body;

    // Verificar si ya existe un usuario con el mismo correo electrónico
    const existingUser = await User.findOne({ where: { email }});
    if (existingUser) {
      console.log("El usuario ya existe:", email); // Log si el usuario ya existe
      return res.status(400).json({
        code: -2,
        message: 'Ya existe un usuario con el mismo correo electrónico'
      });
    }

    // Crear un nuevo usuario
    const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
    console.log("Contraseña hasheada:", hashedPassword); // Log de la contraseña hasheada

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      surname,
      roles:'user',
      location,
      preference,
      avatar,
      status: 1
    });
    await newUser.save();

    console.log("Nuevo usuario creado:", newUser); // Log del nuevo usuario creado

    // Generar un token de acceso y lo guardo en un token seguro (httpOnly)
    const accessToken = jwt.sign({ id_user: newUser.id_user, name: newUser.name }, process.env.JWT_SECRET);
    console.log("Token generado:", accessToken); // Log del token generado

    const token = serialize('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
    res.setHeader('Set-Cookie', token);

    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'Usuario registrado correctamente',
    //  accessToken: accessToken,  // Incluir el token en la respuesta
      user: {
        id_user: newUser.id_user,
        email: newUser.email,
        name: newUser.name,
        surname: newUser.surname,
        roles: newUser.roles
      }
    });
  } catch (error) {
    console.error("Error durante el registro:", error); // Log del error si algo falla
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al registrar el usuario',
      error: error,
    });
  }
};
//FUNCIONA PERO CONFLICTO CON ROLES; VAMOS A VER
/*export const login = async (req, res) => {
  try {
    const errors = validationResult(req);

    // If there are validation errors, respond with a 400 Bad Request status
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    // Verificar si el correo electrónico y la contraseña son correctos
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        code: -25,
        message: 'user No exist'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        code: -5,
        message: 'Credenciales incorrectas'
      });
    }

    // Generar un token de acceso y lo guardo en un token seguro (httpOnly)
    const accessToken = jwt.sign({ id_user: user.id_user, name: user.name }, process.env.JWT_SECRET);
    const token = serialize('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
    res.setHeader('Set-Cookie', token);

    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'Login OK',
      data: {
        user: {
          name: user.name,
          surname: user.surname,
          email: user.email
        } 
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al iniciar sesión',
      error: error
    });
  }
};*/


//VAMOS A PROBAR OTRA COSA PORQUE NO RULA!
/*export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user || !user.validPassword(password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Crear token
        const token = jwt.sign({ id_user: user.id_user, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Enviar la respuesta
        res.json({
            accessToken: token,
            user: {
                id_user: user.id_user,
                email: user.email,
                role: user.role,
                name: user.name,
                surname: user.surname,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};*/
//PROBLEMA CON LOS TOKEN PEOR POR FINMUESTRA RESPUESTA Y FUNCIONA SALUDO
/*export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
      // Buscar al usuario por email
      const user = await User.findOne({ where: { email } });

      // Verificar si el usuario existe
      if (!user) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Comparar la contraseña ingresada con la almacenada en la base de datos
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      // Si la contraseña no es válida, devolver un error
      if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Si la contraseña es válida, crear un token JWT
      const token = jwt.sign({ id_user: user.id_user, role: user.roles }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Enviar la respuesta con el token y los datos del usuario
      res.json({
         // accessToken: token,
          user: {
              id_user: user.id_user,
              email: user.email,
              role: user.roles,
              name: user.name,
              surname: user.surname,
          }
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};*/

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generar un token JWT
    const accessToken = jwt.sign({ id_user: user.id_user }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Serializar la cookie
    const token_jwt = serialize('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',  // Usa 'lax' si tienes problemas con CORS
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    // Establecer la cookie en el header de la respuesta
    res.setHeader('Set-Cookie', token_jwt);

    // Responder con la información del usuario, pero no el token
    res.status(200).json({
      code: 1,
      message: 'Login successful',
      user: {
        id_user: user.id_user,
        email: user.email,
        name: user.name,
        surname: user.surname,
        roles: user.roles,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




export const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);

    // If there are validation errors, respond with a 400 Bad Request status
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        code: -8,
        message: 'Email does not exist'
      });
    }

    let resetToken = crypto.randomBytes(32).toString("hex");

    await new RecoveryToken({
      user_id: user.id_user,
      token: resetToken,
      created_at: Date.now(),
    }).save();

    const link = `${clietURL}/change-password?token=${resetToken}&id=${user.id_user}`;

    await sendEmail(
      user.email,
      "Password Reset Request",
      {
        name: user.name,
        link: link,
      },
      "email/template/requestResetPassword.handlebars"
    ).then(response => {
      console.log("Resultado del envío del correo:", response);
      res.status(200).json({
        code: 100,
        message: 'Send Email OK',
        data: {
          token: resetToken,
          link: link
        }
      });

    },error => {
      console.error (error)
      res.status(200).json({
        code: -80,
        message: 'Send Email KO',
        data: {error}
      });
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al actualizar el usuario',
      error: error
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);

    // If there are validation errors, respond with a 400 Bad Request status
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, password } = req.body;

    //Reviso si el Token existe
    let token_row = await RecoveryToken.findOne({ where: { token } });
    if (!token_row) {
      return res.status(404).json({
        code: -3,
        message: 'Token Incorrecto'
      });
    } 

    // Buscar un usuario por su ID en la base de datos
    const user = await User.findOne({ where: { id_user: token_row.user_id } });
    if (!user) {
      return res.status(404).json({
        code: -10,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar la contraseña del usuario
    user.password = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
    await user.save();
    //Elimino el token
    await RecoveryToken.destroy({
      where: {
        user_id: token_row.user_id
      }
    })

    // Generar un token de acceso y lo guardo en un token seguro (httpOnly)
    const accessToken = jwt.sign({ id_user: user.id_user, name: user.name }, process.env.JWT_SECRET);
    const token_jwt = serialize('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
    res.setHeader('Set-Cookie', token_jwt);

    // Enviar una respuesta al cliente
    res.status(200).json({
      code: 1,
      message: 'User Detail',
      data: {
        user: {
          name: user.name,
          surname: user.surname,
          email: user.email
        } 
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al actualizar el usuario',
      error: error
    });
  }
};

export const logout = async (req, res) => {
  const { cookies } = req;
  const jwt = cookies.token;

  const token = serialize('token', null, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1,
    path: '/',
  });
  res.setHeader('Set-Cookie', token);
  res.status(200).json({
    code: 0,
    message: 'Logged out - Delete Token',
  });
}
