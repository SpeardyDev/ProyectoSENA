const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../config/dbMysql");


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

// Obtener todos los usuarios (MySQL)
router.get("/api/usuarios", async (req, res) => {
  try {
    const [usuarios] = await db.execute("SELECT * FROM users");
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error });
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

// Actualizar usuario (MySQL)
router.put("/api/editar/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = { ...req.body };

    // Si hay contraseña, hasheala
    if (datosActualizados.password) {
      datosActualizados.password = await bcrypt.hash(datosActualizados.password, 10);
    }

    // Construye la parte SET dinámica
    const campos = [];
    const valores = [];
    for (let campo in datosActualizados) {
      campos.push(`${campo} = ?`);
      valores.push(datosActualizados[campo]);
    }

    if (campos.length === 0) {
      return res.status(400).json({ message: "No hay datos para actualizar" });
    }

    valores.push(id);

    // Actualiza
    const [result] = await db.execute(
      `UPDATE users SET ${campos.join(", ")} WHERE id = ?`,
      valores
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Devuelve el usuario actualizado
    const [usuarioActualizado] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
    res.json(usuarioActualizado[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario", error });
  }
});

// Actualizar usuario (MySQL)
router.put("/actualizar/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre, Usuario, Password, Rol, ID_Estado } = req.body;

    let updateUser = { Nombre, Usuario, Rol, ID_Estado };
    if (Password) {
      updateUser.Password = await bcrypt.hash(Password, 10);
    }

    const [result] = await db.query("UPDATE usuarios SET ? WHERE ID = ?", [
      updateUser,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario actualizado" });
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

// Eliminar usuario (MySQL)
router.delete("/api/eliminar/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Primero verifica si existe
    const [exist] = await db.execute("SELECT id FROM users WHERE id = ?", [id]);
    if (exist.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // Elimina
    await db.execute("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario", error });
  }
});

// Eliminar usuario (MySQL)
router.delete("/eliminar/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM usuarios WHERE ID = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
