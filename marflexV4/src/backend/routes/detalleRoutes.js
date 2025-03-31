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
 *       500:
 *         description: Error del servidor
 */
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
 *       404:
 *         description: Detalle no encontrado
 */
router.get("/detalle_colchon/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("SELECT * FROM detalle_colchon WHERE ID = ?", [id]);
        if (result.length === 0) {
            return res.status(404).json({ message: "Detalle no encontrado" });
        }
        res.json(result[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear un nuevo detalle
router.post("/agregar/detalle_colchon", async (req, res) => {
    try {
        const { ID_Colchon, ID_MateriaPrima, Cantidad_Usada } = req.body;
        if (!ID_Colchon || !ID_MateriaPrima || !Cantidad_Usada) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }
        const [result] = await db.query(
            "INSERT INTO detalle_colchon (ID_Colchon, ID_MateriaPrima, Cantidad_Usada) VALUES (?, ?, ?)",
            [ID_Colchon, ID_MateriaPrima, Cantidad_Usada]
        );
        res.status(201).json({ id: result.insertId, ID_Colchon, ID_MateriaPrima, Cantidad_Usada });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar un detalle
router.put("/actualizar/detalle_colchon/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { ID_Colchon, ID_MateriaPrima, Cantidad_Usada } = req.body;
        if (!ID_Colchon || !ID_MateriaPrima || !Cantidad_Usada) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
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

// Eliminar un detalle
router.delete("/eliminar/detalle_colchon/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("DELETE FROM detalle_colchon WHERE ID = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Detalle no encontrado" });
        }
        res.json({ message: "Detalle eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;