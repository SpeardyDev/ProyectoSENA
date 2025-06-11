const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const auth = require("../middleware/authMiddleware");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");

dotenv.config();
const bd = require("../config/dbMysql");
const otpStore = {};

// Seguridad HTTP headers
router.use(helmet());

// Configuración Rate Limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máx 10 intentos por IP
  message: { message: "Demasiados intentos, intenta más tarde." },
});

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 5, // Máx 5 intentos por IP
  message: { message: "Demasiadas solicitudes de código, intenta más tarde." },
});

// Nodemailer seguro
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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
router.post(
  "/registrar",
  [
    body("username").isEmail().withMessage("Email inválido"),
    body("password").isLength({ min: 8 }).withMessage("- La contraseña debe tener al menos 8 caracteres"),
    body("nombre").optional().isString().isLength({ min: 2, max: 100 }),
    body("telefono").optional().isString().isLength({ min: 14, max: 14 }).withMessage("- por favor introdusca un numero de telefono valido"),
    body("rol").optional().isIn(["Empleado", "Administrador"]),
    body("ID_Estado").optional().isInt({ min: 1, max: 2 }),
    body("documento").optional().isString().isLength({ min: 5, max: 20 }).withMessage("Documento no valido"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      let {
        documento = null,
        nombre = null,
        username,
        password,
        telefono = null,
        ID_Estado,
        rol = "Empleado",
      } = req.body;

      ID_Estado = Number(ID_Estado);
      if (![1, 2].includes(ID_Estado)) {
        ID_Estado = 1;
      }

      // Consulta si el username ya existe
      const [userByUsername] = await bd.execute(
        "SELECT id FROM users WHERE username = ?",
        [username]
      );
      if (userByUsername.length > 0) {
        return res.status(409).send({ message: "El correo electrónico ya está registrado." });
      }

      // Consulta si el documento ya existe (si se envía)
      if (documento) {
        const [userByDocumento] = await bd.execute(
          "SELECT id FROM users WHERE documento = ?",
          [documento]
        );
        if (userByDocumento.length > 0) {
          return res.status(409).send({ message: "El documento ya está registrado." });
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await bd.execute(
        `INSERT INTO users 
        (documento, nombre, username, password, telefono, ID_Estado, rol) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [documento, nombre, username, hashedPassword, telefono, ID_Estado, rol]
      );

      res.status(201).send({ message: "Usuario registrado exitosamente" });
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      res.status(500).send({ message: "Error del servidor" });
    }
  }
);

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
router.post(
  "/login",
  loginLimiter,
  [
    body("username").isEmail().withMessage("Email inválido"),
    body("password").isString().isLength({ min: 8 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const { username, password } = req.body;
      const [rows] = await bd.execute(
        "SELECT id, username, password, nombre, rol, fotoPerfil FROM users WHERE username = ?",
        [username]
      );
      if (rows.length === 0) {
        return res
          .status(400)
          .send({ message: "Usuario o contraseña incorrectos" });
      }
      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .send({ message: "Usuario o contraseña incorrectos" });
      }
      const token = jwt.sign(
        {
          id: user.id,
          rol: user.rol,
          aud: "marflexv4_frontend",
          iss: "marflexv4_backend",
        },
        process.env.JWT_SECRET,
        { expiresIn: "15m", algorithm: "HS256" }
      );
      res.send({
        message: "Ingreso exitoso",
        success: true,
        token,
        nombre: user.nombre,
        rol: user.rol,
        userId: user.id,
        fotoPerfil: user.fotoPerfil || null,
      });
    } catch (error) {
      console.error("Error en el servidor:", error);
      res.status(500).send({ message: "Error en el servidor" });
    }
  }
);

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

// Cerrar sesión de usuario (logout)
router.post("/cerrarsesion", (req, res) => {
  try {
    res.send({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    console.error(`[ERROR] Fallo al cerrar sesión: ${error.message}`, error);
    res.status(500).json({
      message: "Ocurrió un error al cerrar la sesión. Inténtelo más tarde."
    });
  }
});

// Recuperación de contraseña (enviar OTP)
router.post(
  "/recuperar-password",
  otpLimiter,
  [body("username").isEmail().withMessage("Email inválido")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const { username } = req.body;
      const [rows] = await bd.execute(
        "SELECT id, username FROM users WHERE username = ?",
        [username]
      );
      if (rows.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado." });
      }
      const otp = Math.floor(100000 + Math.random() * 900000);
      // Guardar el OTP de forma segura (en producción, usar Redis o DB temporal)
      otpStore[username] = { otp, expires: Date.now() + 5 * 60 * 1000 };
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: username,
        subject: "Código de Recuperación",
        html: `<p>Tu código de recuperación es: <strong>${otp}</strong></p><p>Expira en 5 minutos.</p>`,
      };
      await transporter.sendMail(mailOptions);
      res.json({ message: "Código enviado al correo." });
    } catch (error) {
      console.error(`[ERROR] Fallo en /recuperar-password para ${req.body?.username}: ${error.message}`, error);
      res.status(500).json({
        message: "Ocurrió un error al procesar la recuperación de contraseña. Intente nuevamente más tarde."
      });
    }
  }
);

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

// Verificar OTP
router.post(
  "/verificar-otp",
  otpLimiter,
  [
    body("username").isEmail().withMessage("Email inválido"),
    body("otp")
      .isInt()
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP inválido"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { username, otp } = req.body;
    const storedOtp = otpStore[username];
    if (
      !storedOtp ||
      storedOtp.otp !== parseInt(otp) ||
      storedOtp.expires < Date.now()
    ) {
      return res.status(400).json({ message: "Código inválido o expirado." });
    }
    res.json({ message: "Código correcto. Puedes cambiar tu contraseña." });
  }
);
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
router.post(
  "/reset-password",
  [
    body("username").isEmail().withMessage("Email inválido"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener al menos 8 caracteres"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const { username, password } = req.body;
      const [rows] = await bd.execute(
        "SELECT id FROM users WHERE username = ?",
        [username]
      );
      if (rows.length === 0) {
        return res.status(400).json({ message: "Usuario no encontrado." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await bd.execute("UPDATE users SET password = ? WHERE username = ?", [
        hashedPassword,
        username,
      ]);
      res.json({ message: "Contraseña restablecida con éxito." });
    } catch (error) {
      console.error(`[ERROR] Fallo en /reset-password para ${req.body?.username}: ${error.message}`, error);
      res.status(500).json({
        message: "Ocurrió un error al restablecer la contraseña. Intente nuevamente más tarde."
      });
    }
  }
);

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

// Subir o actualizar foto de perfil
router.post(
  "/usuarios/foto",
  auth,
  upload.single("fotoPerfil"),
  async (req, res) => {
    try {
      // Validar archivo (solo imágenes, máx 2MB)
      if (
        !req.file ||
        !/.(jpg|jpeg|png|webp)$/i.test(req.file.originalname) ||
        req.file.size > 2 * 1024 * 1024
      ) {
        return res
          .status(400)
          .json({
            error:
              "Formato o tamaño de archivo no permitido (solo imágenes JPG, PNG, WEBP de máx 2MB)",
          });
      }
      const userId = req.user.id;
      const [rows] = await bd.execute(
        "SELECT fotoPerfil FROM users WHERE id = ?",
        [userId]
      );
      if (rows.length === 0)
        return res.status(404).json({ error: "Usuario no encontrado" });
      await bd.execute("UPDATE users SET fotoPerfil = ? WHERE id = ?", [
        req.file.filename,
        userId,
      ]);
      res.json({ message: "Foto actualizada", fotoPerfil: req.file.filename });
    } catch (error) {
      console.error(
        `[ERROR] Fallo en /usuarios/foto para userID=${req.user?.id}: ${error.message}`,
        error
      );
      res.status(500).json({ error: "Error actualizando foto. Intente más tarde." });
    }
  }
);

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
router.delete("/eliminar/usuarios/foto", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await bd.execute(
      "SELECT fotoPerfil FROM users WHERE id = ?",
      [userId]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Usuario no encontrado" });
    const fotoPerfil = rows[0].fotoPerfil;
    if (fotoPerfil) {
      const filePath = path.join(__dirname, "../uploads", fotoPerfil);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      await bd.execute("UPDATE users SET fotoPerfil = NULL WHERE id = ?", [
        userId,
      ]);
    }
    res.json({ message: "Foto eliminada con éxito" });
  } catch (error) {
    console.error(
      `[ERROR] Fallo en DELETE /eliminar/usuarios/foto para userID=${req.user?.id}: ${error.message}`,
      error
    );
    res.status(500).json({ error: "Error al eliminar la foto" });
  }
});

module.exports = router;
