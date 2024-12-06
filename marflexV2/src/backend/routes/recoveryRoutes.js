const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Ruta para generar el código de verificación
router.post('/generate-code', async (req, res) => {
  try {
    const { username } = req.body;

    console.log('Username recibido:', username);
    if (!username || !username.trim()) {
      return res.status(400).send({ message: 'El nombre de usuario es obligatorio.' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = code;
    await user.save();

    console.log(`Código de verificación generado para ${username}: ${code}`);
    res.status(200).send({ message: 'Código de verificación generado exitosamente.' });
  } catch (error) {
    console.error('Error al generar el código de verificación:', error);
    res.status(500).send({ message: 'Error en el servidor', error });
  }
});

// Verificar código de recuperación
router.post('/verify', async (req, res) => {
  try {
    const { username, code } = req.body;

    console.log('Username y código recibidos:', username, code);
    if (!username || !code || !username.trim() || !code.trim()) {
      return res.status(400).send({ message: 'El nombre de usuario y el código son obligatorios.' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      console.log(`Usuario no encontrado para el nombre de usuario: ${username}`);
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }

    console.log(`Comparando códigos: recibido (${code}), esperado (${user.verificationCode})`);
    if (user.verificationCode.trim() !== code.trim()) {
      console.log(`Código incorrecto para ${username}`);
      return res.status(400).send({ message: 'Código de verificación incorrecto' });
    }

    console.log(`Código verificado para ${username}`);
    res.status(200).send({ success: true, message: 'Código verificado exitosamente' });
  } catch (error) {
    console.error('Error al verificar el código:', error);
    res.status(500).send({ message: 'Error en el servidor', error });
  }
});

// Restablecer la contraseña
router.post('/reset-password', async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    const user = await User.findOne({ username: username });
    if (!user) {
      console.log('Usuario no encontrado:', username);
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }

    // Actualizar y encriptar la nueva contraseña
    user.password = await bcrypt.hash(newPassword, 10);
    user.verificationCode = null;
    await user.save();

    console.log(`Contraseña actualizada para ${username}`);
    res.status(200).send({ message: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).send({ message: 'Error en el servidor', error });
  }
});

module.exports = router;