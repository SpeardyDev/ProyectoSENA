const express = require("express");
const db = require("../config/dbMysql"); // Importar la conexión a MySQL
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Estados
 *   description: Endpoints para la gestión de estados
 */

/**
 * @swagger
 * /estados:
 *   get:
 *     summary: Obtiene todos los estados
 *     tags: [Estados]
 *     responses:
 *       200:
 *         description: Lista de estados obtenida exitosamente
 *       500:
 *         description: Error del servidor
 */

// Obtener todos los estados
router.get('/estados', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM estados');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Error en el servidor' });
    }
});

module.exports = router;