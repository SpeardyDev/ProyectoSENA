const express = require("express");
const db = require("../config/dbMysql"); // Importar la conexión a MySQL
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: MateriaPrima
 *   description: Endpoints para la gestión de materia prima
 */

/**
 * @swagger
 * /materia_prima:
 *   get:
 *     summary: Obtiene toda la materia prima
 *     tags: [MateriaPrima]
 *     responses:
 *       200:
 *         description: Lista de materia prima obtenida exitosamente
 *       500:
 *         description: Error del servidor
 */

// Obtener toda la materia prima
router.get('/materia_prima', (req, res) => {
  db.query('SELECT * FROM materia_prima', (err, results) => {
      if (err) {
          res.status(500).json({ error: err.message });
      } else {
          res.json(results);
      }
  });
});

/**
 * @swagger
 * /materia_prima/{id}:
 *   get:
 *     summary: Obtiene una materia prima por ID
 *     tags: [MateriaPrima]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Materia prima obtenida exitosamente
 *       404:
 *         description: Materia prima no encontrada
 */

// Obtener una materia prima por ID
router.get('/materia_prima/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM materia_prima WHERE ID = ?', [id], (err, result) => {
      if (err) {
          res.status(500).json({ error: err.message });
      } else if (result.length === 0) {
          res.status(404).json({ message: 'Materia prima no encontrada' });
      } else {
          res.json(result[0]);
      }
  });
});

/**
 * @swagger
 * /agregar/materia_prima:
 *   post:
 *     summary: Agrega una nueva materia prima
 *     tags: [MateriaPrima]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre:
 *                 type: string
 *               Descripcion:
 *                 type: string
 *               Stock:
 *                 type: number
 *               Unidad:
 *                 type: string
 *     responses:
 *       201:
 *         description: Materia prima agregada exitosamente
 *       500:
 *         description: Error del servidor
 */

// Crear nueva materia prima
router.post('/agregar/materia_prima', (req, res) => {
  const { Nombre, Descripcion, Stock, Unidad } = req.body;
  const query = 'INSERT INTO materia_prima (Nombre, Descripcion, Stock, Unidad) VALUES (?, ?, ?, ?)';
  db.query(query, [Nombre, Descripcion, Stock, Unidad], (err, result) => {
      if (err) {
          res.status(500).json({ error: err.message });
      } else {
          res.status(201).json({ id: result.insertId, Nombre, Descripcion, Stock, Unidad });
      }
  });
});

/**
 * @swagger
 * /actualizar/materia_prima/{id}:
 *   put:
 *     summary: Actualiza una materia prima existente
 *     tags: [MateriaPrima]
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
 *               Descripcion:
 *                 type: string
 *               Stock:
 *                 type: number
 *               Unidad:
 *                 type: string
 *     responses:
 *       200:
 *         description: Materia prima actualizada correctamente
 *       404:
 *         description: Materia prima no encontrada
 *       500:
 *         description: Error del servidor
 */

// Actualizar materia prima
router.put('/actualizar/materia_prima/:id', (req, res) => {
  const { id } = req.params;
  const { Nombre, Descripcion, Stock, Unidad } = req.body;
  const query = 'UPDATE materia_prima SET Nombre = ?, Descripcion = ?, Stock = ?, Unidad = ? WHERE ID = ?';
  db.query(query, [Nombre, Descripcion, Stock, Unidad, id], (err, result) => {
      if (err) {
          res.status(500).json({ error: err.message });
      } else if (result.affectedRows === 0) {
          res.status(404).json({ message: 'Materia prima no encontrada' });
      } else {
          res.json({ message: 'Materia prima actualizada correctamente' });
      }
  });
});

/**
 * @swagger
 * /eliminar/materia_prima/{id}:
 *   delete:
 *     summary: Elimina una materia prima por ID
 *     tags: [MateriaPrima]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Materia prima eliminada correctamente
 *       404:
 *         description: Materia prima no encontrada
 *       500:
 *         description: Error del servidor
 */

// Eliminar materia prima
router.delete('/eliminar/materia_prima/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM materia_prima WHERE ID = ?', [id], (err, result) => {
      if (err) {
          res.status(500).json({ error: err.message });
      } else if (result.affectedRows === 0) {
          res.status(404).json({ message: 'Materia prima no encontrada' });
      } else {
          res.json({ message: 'Materia prima eliminada correctamente' });
      }
  });
});

module.exports = router;