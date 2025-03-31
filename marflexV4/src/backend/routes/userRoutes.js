const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../config/dbMysql");
const models = require("../models/User");

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para la gestión de usuarios (Solo Admin)
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *       500:
 *         description: Error en el servidor
 */

// Obtener todos los usuarios (MongoDB)
router.get("/api/usuarios", async (req, res) => {
  try {
    const usuarios = await models.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error });
  }
});

// Obtener todos los usuarios (MySQL)
router.get('/usuarios', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM usuarios');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/editar/usuarios/{id}:
 *   put:
 *     summary: Editar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */

// Actualizar usuario (MongoDB)
router.put("/api/editar/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;

    if (datosActualizados.password) {
      datosActualizados.password = await bcrypt.hash(datosActualizados.password, 10);
    }

    const usuarioActualizado = await models.findByIdAndUpdate(id, datosActualizados, {
      new: true,
    });

    if (!usuarioActualizado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario", error });
  }
});

// Actualizar usuario (MySQL)
router.put('/actualizar/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre, Usuario, Password, Rol, ID_Estado } = req.body;
    
    let updateUser = { Nombre, Usuario, Rol, ID_Estado };
    if (Password) {
      updateUser.Password = await bcrypt.hash(Password, 10);
    }

    const [result] = await db.query('UPDATE usuarios SET ? WHERE ID = ?', [updateUser, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/eliminar/usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */

// Eliminar usuario (MongoDB)
router.delete("/api/eliminar/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params; 
    const usuarioEliminado = await models.findByIdAndDelete(id);

    if (!usuarioEliminado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario", error });
  }
});

// Eliminar usuario (MySQL)
router.delete('/eliminar/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM usuarios WHERE ID = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
