//authRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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



router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Intentando iniciar sesión con:", username);
    const user = await User.findOne({ username });
    if (!user) {
      console.log("Usuario no encontrado");
      return res.status(400).send({ message: "Credenciales no válidas" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Contraseña incorrecta");
      return res.status(400).send({ message: "Credenciales no válidas" });
    }
    const token = jwt.sign(
      { id: user._id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Token generado:", token); //Enviar el token y el rol del usuario
    res.send({ token, rol: user.rol });
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).send({ message: "Error en el servidor", error });
  }
});
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

module.exports = router;
