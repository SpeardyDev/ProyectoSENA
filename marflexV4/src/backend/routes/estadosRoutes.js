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
router.get('/estados', (req, res) => {
  db.query('SELECT * FROM estados', (err, results) => {
      if (err) {
          res.status(500).json({ error: err.message });
      } else {
          res.json(results);
      }
  });
});

module.exports = router;