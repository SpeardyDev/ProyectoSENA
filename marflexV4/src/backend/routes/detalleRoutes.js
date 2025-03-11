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

// Obtener todos los detalles
router.get('/detalle_colchon', (req, res) => {
  db.query('SELECT * FROM detalle_colchon', (err, results) => {
      if (err) {
          res.status(500).json({ error: err.message });
      } else {
          res.json(results);
      }
  });
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

// Obtener un detalle por ID
router.get('/detalle_colchon/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM detalle_colchon WHERE ID = ?', [id], (err, result) => {
      if (err) {
          res.status(500).json({ error: err.message });
      } else if (result.length === 0) {
          res.status(404).json({ message: 'Detalle no encontrado' });
      } else {
          res.json(result[0]);
      }
  });
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
 *             properties:
 *               ID_Colchon:
 *                 type: integer
 *               ID_MateriaPrima:
 *                 type: integer
 *               Cantidad_Usada:
 *                 type: number
 *     responses:
 *       201:
 *         description: Detalle agregado exitosamente
 *       500:
 *         description: Error del servidor
 */

// Crear un nuevo detalle
router.post('/agregar/detalle_colchon', (req, res) => {
  const { ID_Colchon, ID_MateriaPrima, Cantidad_Usada } = req.body;
  const query = 'INSERT INTO detalle_colchon (ID_Colchon, ID_MateriaPrima, Cantidad_Usada) VALUES (?, ?, ?)';
  db.query(query, [ID_Colchon, ID_MateriaPrima, Cantidad_Usada], (err, result) => {
      if (err) {
          res.status(500).json({ error: err.message });
      } else {
          res.status(201).json({ id: result.insertId, ID_Colchon, ID_MateriaPrima, Cantidad_Usada });
      }
  });
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
 *       404:
 *         description: Detalle no encontrado
 *       500:
 *         description: Error del servidor
 */

// Actualizar un detalle
router.put('/actualizar/detalle_colchon/:id', (req, res) => {
  const { id } = req.params;
  const { ID_Colchon, ID_MateriaPrima, Cantidad_Usada } = req.body;
  const query = 'UPDATE detalle_colchon SET ID_Colchon = ?, ID_MateriaPrima = ?, Cantidad_Usada = ? WHERE ID = ?';
  db.query(query, [ID_Colchon, ID_MateriaPrima, Cantidad_Usada, id], (err, result) => {
      if (err) {
          res.status(500).json({ error: err.message });
      } else if (result.affectedRows === 0) {
          res.status(404).json({ message: 'Detalle no encontrado' });
      } else {
          res.json({ message: 'Detalle actualizado correctamente' });
      }
  });
});

/**
 * @swagger
 * /eliminar/detalle_colchon/{id}:
 *   delete:
 *     summary: Elimina un detalle de colchón por ID
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
router.delete('/eliminar/detalle_colchon/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM detalle_colchon WHERE ID = ?', [id], (err, result) => {
      if (err) {
          res.status(500).json({ error: err.message });
      } else if (result.affectedRows === 0) {
          res.status(404).json({ message: 'Detalle no encontrado' });
      } else {
          res.json({ message: 'Detalle eliminado correctamente' });
      }
  });
});

module.exports = router;