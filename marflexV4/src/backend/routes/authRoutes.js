//authRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer'); // Para enviar correos
const dotenv = require('dotenv');
dotenv.config(); // Cargar variables de entorno
const otpStore = {}; // Guardará los códigos temporalmente

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints relacionados con autenticación de usuarios
 */

/**
 * @swagger
 * /auth/registrar:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en la solicitud
 */

// Registro de usuario
router.post("/registrar", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    res.status(400).send(error);
    console.log('Error al agregar Usuario',error)
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       400:
 *         description: Usuario o contraseña incorrectos
 *       500:
 *         description: Error en el servidor
 */

// Inicio de sesión
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Intentando iniciar sesión con:", username);

    const user = await User.findOne({ username });

    if (!user) {
      console.log("Usuario no encontrado");
      return res.status(400).send({ message: "Usuario o contraseña incorrectos" });
    }
    console.log("Contraseña almacenada:", user.password);

    // Comparar la contraseña ingresada con la encriptada en la BD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Contraseña incorrecta");
      return res.status(400).send({ message: "Usuario o contraseña incorrectos" });
    }

    const token = jwt.sign(
      { id: user._id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Token generado:", token);
    res.send({ token, rol: user.rol });

  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).send({ message: "Error en el servidor" });
  }
});

/**
 * @swagger
 * /auth/cerrarsesion:
 *   post:
 *     summary: Cerrar sesión del usuario
 *     tags: [Autenticación]
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *       500:
 *         description: Error en el servidor
 */

// Cerrar sesion de usuario
router.post("/cerrarsesion", (req, res) => {
  try {
    // Aquí va donde voy  eliminar el token del lado del cliente (falta codigo)
    console.log("Cerrando sesión del usuario");
    res.send({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * @swagger
 * /auth/recuperar-password:
 *   post:
 *     summary: Enviar código OTP para recuperación de contraseña
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Código enviado al correo
 *       404:
 *         description: Usuario no encontrado
 */

// Enviar código OTP para la recuperación de contraseña
router.post("/recuperar-password", async (req, res) => {
  const { username } = req.body;
  const usuario = await User.findOne({ username });

  if (!usuario) {
    return res.status(404).json({ message: "Usuario no encontrado." });
  }

  const otp = Math.floor(100000 + Math.random() * 900000); // Código de 6 dígitos
  otpStore[username] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // Expira en 5 minutos

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: usuario.username,
    subject: "Código de Recuperación",
    html: `<p>Tu código de recuperación es: <strong>${otp}</strong></p><p>Expira en 5 minutos.</p>`,
  };

  await transporter.sendMail(mailOptions);
  res.json({ message: "Código enviado al correo." });
});

// Verificar código OTP
router.post("/verificar-otp", (req, res) => {
  const { username, otp } = req.body;
  const storedOtp = otpStore[username];

  if (!storedOtp || storedOtp.otp !== parseInt(otp) || storedOtp.expires < Date.now()) {
    return res.status(400).json({ message: "Código inválido o expirado." });
  }

  res.json({ message: "Código correcto. Puedes cambiar tu contraseña." });
});

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Restablecer la contraseña de un usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña restablecida con éxito
 *       400:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */

// Restablecer contraseña
router.post('/reset-password', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar usuario en la base de datos
    const usuario = await User.findOne({ username });

    if (!usuario) {
      return res.status(400).json({ message: "Usuario no encontrado." });
    }

    // Verifica si la contraseña ya está encriptada
    if (!usuario.password.startsWith("$2b$")) {
      const hashedPassword = await bcrypt.hash(password, 10);
      usuario.password = hashedPassword;
    } else {
      usuario.password = password;
    }

    // Guardar en la base de datos
    await usuario.save();
    console.log("Nueva contraseña encriptada guardada:", usuario.password);

    res.json({ message: "Contraseña restablecida con éxito." });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    res.status(500).json({ message: "Error del servidor. Inténtalo de nuevo." });
  }
});

module.exports = router;