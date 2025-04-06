const express = require("express");
const router = express.Router();
const db = require("../config/dbMysql");

/**
 * @swagger
 * tags:
 *   name: DetalleColchon
 *   description: Endpoints para la gestión de detalles de colchones
 */

/**
 * @swagger
 * /detalle_colchon:
 *   get:
 *     summary: Obtiene todos los detalles de colchones
 *     tags: [DetalleColchon]
 *     responses:
 *       200:
 *         description: Lista de detalles obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Error del servidor
 */

// Obtener todos los detalles
router.get("/detalle_colchon", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM detalle_colchon");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /detalle_colchon/{id}:
 *   get:
 *     summary: Obtiene un detalle por ID
 *     tags: [DetalleColchon]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Detalle no encontrado
 *       500:
 *         description: Error del servidor
 */

// Obtener detalle por ID
router.get("/detalle_colchon/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(
      "SELECT * FROM detalle_colchon WHERE ID = ?",
      [id]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: "Detalle no encontrado" });
    }
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /agregar/detalle_colchon:
 *   post:
 *     summary: Agrega un nuevo detalle de colchón
 *     tags: [DetalleColchon]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ID_Colchon
 *               - ID_MateriaPrima
 *               - Cantidad_Usada
 *             properties:
 *               ID_Colchon:
 *                 type: integer
 *               ID_MateriaPrima:
 *                 type: integer
 *               Cantidad_Usada:
 *                 type: number
 *     responses:
 *       201:
 *         description: Detalle creado exitosamente
 *       400:
 *         description: Campos faltantes u otros errores de validación
 *       500:
 *         description: Error del servidor
 */

// Crear un nuevo detalle
router.post("/agregar/detalle_colchon", async (req, res) => {
  try {
    const { ID_Colchon, ID_MateriaPrima, Cantidad_Usada } = req.body;
    if (!ID_Colchon || !ID_MateriaPrima || !Cantidad_Usada) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }
    const [result] = await db.query(
      "INSERT INTO detalle_colchon (ID_Colchon, ID_MateriaPrima, Cantidad_Usada) VALUES (?, ?, ?)",
      [ID_Colchon, ID_MateriaPrima, Cantidad_Usada]
    );
    res
      .status(201)
      .json({
        id: result.insertId,
        ID_Colchon,
        ID_MateriaPrima,
        Cantidad_Usada,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /actualizar/detalle_colchon/{id}:
 *   put:
 *     summary: Actualiza un detalle de colchón existente
 *     tags: [DetalleColchon]
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
 *             required:
 *               - ID_Colchon
 *               - ID_MateriaPrima
 *               - Cantidad_Usada
 *             properties:
 *               ID_Colchon:
 *                 type: integer
 *               ID_MateriaPrima:
 *                 type: integer
 *               Cantidad_Usada:
 *                 type: number
 *     responses:
 *       200:
 *         description: Detalle actualizado correctamente
 *       400:
 *         description: Campos faltantes
 *       404:
 *         description: Detalle no encontrado
 *       500:
 *         description: Error del servidor
 */

// Actualizar un detalle
router.put("/actualizar/detalle_colchon/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { ID_Colchon, ID_MateriaPrima, Cantidad_Usada } = req.body;
    if (!ID_Colchon || !ID_MateriaPrima || !Cantidad_Usada) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }
    const [result] = await db.query(
      "UPDATE detalle_colchon SET ID_Colchon = ?, ID_MateriaPrima = ?, Cantidad_Usada = ? WHERE ID = ?",
      [ID_Colchon, ID_MateriaPrima, Cantidad_Usada, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Detalle no encontrado" });
    }
    res.json({ message: "Detalle actualizado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /eliminar/detalle_colchon/{id}:
 *   delete:
 *     summary: Elimina un detalle de colchón
 *     tags: [DetalleColchon]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle eliminado correctamente
 *       404:
 *         description: Detalle no encontrado
 *       500:
 *         description: Error del servidor
 */

// Eliminar un detalle
router.delete("/eliminar/detalle_colchon/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(
      "DELETE FROM detalle_colchon WHERE ID = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Detalle no encontrado" });
    }
    res.json({ message: "Detalle eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;