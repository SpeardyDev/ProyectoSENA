const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Enviar código de verificación al correo
router.post('/send', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ username: email });
    if (!user) {
      console.log('Usuario no encontrado:', email);
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }

    // Generar código de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    console.log(`Código de verificación generado para ${email}: ${verificationCode}`);

    user.verificationCode = verificationCode;
    await user.save();
    res.status(200).send({ message: 'Código enviado exitosamente' });
  } catch (error) {
    console.error('Error al enviar el código:', error);
    res.status(500).send({ message: 'Error en el servidor', error });
  }
});

// Verificar código de recuperación
router.post('/verify', async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ username: email });
    if (!user || user.verificationCode !== code) {
      console.log(`Código incorrecto para ${email}`);
      return res.status(400).send({ message: 'Código de verificación incorrecto' });
    }

    console.log(`Código verificado para ${email}`);
    res.status(200).send({ message: 'Código verificado exitosamente' });
  } catch (error) {
    console.error('Error al verificar el código:', error);
    res.status(500).send({ message: 'Error en el servidor', error });
  }
});

// Restablecer la contraseña
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ username: email });
    if (!user) {
      console.log('Usuario no encontrado:', email);
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }

    // Actualizar y encriptar la nueva contraseña
    user.password = await bcrypt.hash(newPassword, 10);
    user.verificationCode = null;
    await user.save();

    console.log(`Contraseña actualizada para ${email}`);
    res.status(200).send({ message: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).send({ message: 'Error en el servidor', error });
  }
});

module.exports = router;