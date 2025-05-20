const express = require("express");
const router = express.Router();
const upload = require('../middleware/upload');
const auth = require('../middleware/authMiddleware');
const fs = require('fs');
const path = require('path');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const bd = require("../config/dbMysql");
const otpStore = {};

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
    let {
      documento = null,
      nombre = null,
      username,
      password,
      telefono = null,
      ID_Estado = 1, // Valor por defecto (Activo)
      rol = 'Empleado'
    } = req.body;

    // Validación: ID_Estado debe ser 1 o 2 (Activo/Inactivo)
    // Si viene vacío o no es válido, ponlo en 1 (Activo)
    if (!ID_Estado || isNaN(ID_Estado) || ![1, 2].includes(Number(ID_Estado))) {
      ID_Estado = 1;
    } else {
      ID_Estado = Number(ID_Estado);
    }

    // Verifica si el usuario existe
    const [existing] = await bd.execute(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );
    if (existing.length > 0) {
      return res.status(400).send({ message: "El usuario ya existe." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserta los datos
    await bd.execute(
      `INSERT INTO users 
      (documento, nombre, username, password, telefono, ID_Estado, rol) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        documento,
        nombre,
        username,
        hashedPassword,
        telefono,
        ID_Estado,
        rol
      ]
    );

    res.status(201).send({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(400).send({ message: "Error al registrar usuario", error });
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
    const [rows] = await bd.execute(
      "SELECT id, username, password, nombre, rol, fotoPerfil FROM users WHERE username = ?",
      [username]
    );
    if (rows.length === 0) {
      return res.status(400).send({ message: "Usuario o contraseña incorrectos" });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Usuario o contraseña incorrectos" });
    }
    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.send({
      message: "Ingreso exitoso",
      success: true,
      token,
      nombre: user.nombre,
      rol: user.rol,
      userId: user.id,
      fotoPerfil: user.fotoPerfil || null
    });
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

// Cerrar sesión de usuario
router.post("/cerrarsesion", (req, res) => {
  try {
    // Aquí falta código para manejar la eliminación del token del cliente
    res.send({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    res.status(500).send({ message: "Error en el servidor" });
  }
});

// Configuración de nodemailer
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
  const [rows] = await bd.execute(
    "SELECT id, username FROM users WHERE username = ?",
    [username]
  );
  if (rows.length === 0) {
    return res.status(404).json({ message: "Usuario no encontrado." });
  }
  const usuario = rows[0];
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[username] = { otp, expires: Date.now() + 5 * 60 * 1000 };
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: usuario.username,
    subject: "Código de Recuperación",
    html: `<p>Tu código de recuperación es: <strong>${otp}</strong></p><p>Expira en 5 minutos.</p>`,
  };
  await transporter.sendMail(mailOptions);
  res.json({ message: "Código enviado al correo." });
});

/**
 * @swagger
 * /auth/verificar-otp:
 *   post:
 *     summary: Verificar el código OTP para recuperación de contraseña
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
 *               otp:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Código verificado correctamente
 *       400:
 *         description: Código inválido o expirado
 */

// Verificación del código OTP
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
    const [rows] = await bd.execute(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );
    if (rows.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await bd.execute(
      "UPDATE users SET password = ? WHERE username = ?",
      [hashedPassword, username]
    );
    res.json({ message: "Contraseña restablecida con éxito." });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    res.status(500).json({ message: "Error del servidor. Inténtalo de nuevo." });
  }
});


/**
 * @swagger
 * /auth/usuarios/foto:
 *   post:
 *     summary: Subir o actualizar foto de perfil del usuario
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fotoPerfil:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Foto actualizada exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error actualizando foto
 */

// Añadir foto de perfil
router.post('/usuarios/foto', auth, upload.single('fotoPerfil'), async (req, res) => {
  try {
    const userId = req.user.id;
    // Busca el usuario
    const [rows] = await bd.execute(
      "SELECT fotoPerfil FROM users WHERE id = ?",
      [userId]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    // Actualiza el nombre de la foto en la base de datos
    await bd.execute(
      "UPDATE users SET fotoPerfil = ? WHERE id = ?",
      [req.file.filename, userId]
    );
    res.json({ message: 'Foto actualizada', fotoPerfil: req.file.filename });
  } catch (error) {
    console.error("Error actualizando foto de perfil:", error);
    res.status(500).json({ error: 'Error actualizando foto' });
  }
});


/**
 * @swagger
 * /auth/eliminar/usuarios/foto:
 *   delete:
 *     summary: Eliminar la foto de perfil del usuario
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Foto eliminada con éxito
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al eliminar la foto
 */

// Eliminar foto de perfil
router.delete('/eliminar/usuarios/foto', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await bd.execute(
      "SELECT fotoPerfil FROM users WHERE id = ?",
      [userId]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    const fotoPerfil = rows[0].fotoPerfil;
    if (fotoPerfil) {
      const filePath = path.join(__dirname, '../uploads', fotoPerfil);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      await bd.execute(
        "UPDATE users SET fotoPerfil = NULL WHERE id = ?",
        [userId]
      );
    }
    res.json({ message: 'Foto eliminada con éxito' });
  } catch (error) {
    console.error("Error al eliminar foto:", error);
    res.status(500).json({ error: 'Error al eliminar la foto' });
  }
});


module.exports = router;
