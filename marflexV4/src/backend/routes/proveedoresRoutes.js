const express = require("express");
const router = express.Router();
const db = require("../config/dbMysql");

/**
 * @swagger
 * tags:
 *   name: Proveedores
 *   description: Endpoints para la gestión de proveedores
 */

/**
 * @swagger
 * /proveedores:
 *   get:
 *     summary: Obtiene todos los proveedores
 *     tags: [Proveedores]
 *     responses:
 *       200:
 *         description: Lista de proveedores obtenida exitosamente
 *       500:
 *         description: Error del servidor
 */

// Obtener todos los proveedores
router.get("/proveedores", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM proveedores");
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /proveedores/{id}:
 *   get:
 *     summary: Obtiene un proveedor por ID
 *     tags: [Proveedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proveedor obtenido exitosamente
 *       404:
 *         description: Proveedor no encontrado
 */

// Obtener un proveedor por ID
router.get("/proveedores/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("SELECT * FROM proveedores WHERE ID = ?", [
      id,
    ]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /agregar/proveedores:
 *   post:
 *     summary: Crea un nuevo proveedor
 *     tags: [Proveedores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre:
 *                 type: string
 *               Telefono:
 *                 type: string
 *               Direccion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proveedor creado exitosamente
 *       500:
 *         description: Error del servidor
 */

// Crear un nuevo proveedor
router.post("/agregar/proveedores", async (req, res) => {
  const { Nombre, Telefono, Direccion } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO proveedores (Nombre, Telefono, Direccion) VALUES (?, ?, ?)",
      [Nombre, Telefono, Direccion]
    );
    res.status(201).json({ id: result.insertId, Nombre, Telefono, Direccion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /actualizar/proveedores/{id}:
 *   put:
 *     summary: Actualiza un proveedor existente
 *     tags: [Proveedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre:
 *                 type: string
 *               Telefono:
 *                 type: string
 *               Direccion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Proveedor actualizado correctamente
 *       404:
 *         description: Proveedor no encontrado
 *       500:
 *         description: Error del servidor
 */

// Actualizar un proveedor
router.put("/actualizar/proveedores/:id", async (req, res) => {
  const { id } = req.params;
  const { Nombre, Telefono, Direccion } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE proveedores SET Nombre = ?, Telefono = ?, Direccion = ? WHERE ID = ?",
      [Nombre, Telefono, Direccion, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }
    res.json({ message: "Proveedor actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /eliminar/proveedores/{id}:
 *   delete:
 *     summary: Elimina un proveedor por ID
 *     tags: [Proveedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proveedor eliminado correctamente
 *       404:
 *         description: Proveedor no encontrado
 *       500:
 *         description: Error del servidor
 */

// Eliminar un proveedor
router.delete("/eliminar/proveedores/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM proveedores WHERE ID = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }
    res.json({ message: "Proveedor eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;