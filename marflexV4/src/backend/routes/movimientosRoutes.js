const express = require("express");
const router = express.Router();
const db = require("../config/dbMysql");

/**
 * @swagger
 * tags:
 *   name: Movimientos
 *   description: Endpoints para la gestión de movimientos de materia prima
 */

/**
 * @swagger
 * /movimientos:
 *   get:
 *     summary: Obtiene todos los movimientos
 *     tags: [Movimientos]
 *     responses:
 *       200:
 *         description: Lista de movimientos obtenida exitosamente
 *       500:
 *         description: Error del servidor
 */

// Obtener todos los movimientos
router.get('/movimientos', (req, res) => {
  db.query('SELECT * FROM movimientos', (err, results) => {
      if (err) {
          res.status(500).json({ error: err.message });
      } else {
          res.json(results);
      }
  });
});

/**
 * @swagger
 * /movimientos/{id}:
 *   get:
 *     summary: Obtiene un movimiento por ID
 *     tags: [Movimientos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movimiento obtenido exitosamente
 *       404:
 *         description: Movimiento no encontrado
 */

// Obtener un movimiento por ID
router.get('/movimientos/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM movimientos WHERE ID = ?', [id], (err, result) => {
      if (err) {
          res.status(500).json({ error: err.message });
      } else if (result.length === 0) {
          res.status(404).json({ message: 'Movimiento no encontrado' });
      } else {
          res.json(result[0]);
      }
  });
});

/**
 * @swagger
 * /agregar/movimientos:
 *   post:
 *     summary: Agrega un nuevo movimiento
 *     tags: [Movimientos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID_MateriaPrima:
 *                 type: integer
 *               Tipo:
 *                 type: string
 *               Cantidad:
 *                 type: number
 *               ID_Proveedor:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Movimiento agregado exitosamente
 *       500:
 *         description: Error del servidor
 */

// Crear un nuevo movimiento
router.post('/agregar/movimientos', (req, res) => {
  const { ID_MateriaPrima, Tipo, Cantidad, ID_Proveedor } = req.body;
  const query = 'INSERT INTO movimientos (ID_MateriaPrima, Tipo, Cantidad, ID_Proveedor) VALUES (?, ?, ?, ?)';
  db.query(query, [ID_MateriaPrima, Tipo, Cantidad, ID_Proveedor], (err, result) => {
      if (err) {
          res.status(500).json({ error: err.message });
      } else {
          res.status(201).json({ id: result.insertId, ID_MateriaPrima, Tipo, Cantidad, ID_Proveedor });
      }
  });
});

/**
 * @swagger
 * /actualizar/movimientos/{id}:
 *   put:
 *     summary: Actualiza un movimiento existente
 *     tags: [Movimientos]
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
 *               ID_MateriaPrima:
 *                 type: integer
 *               Tipo:
 *                 type: string
 *               Cantidad:
 *                 type: number
 *               ID_Proveedor:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Movimiento actualizado correctamente
 *       404:
 *         description: Movimiento no encontrado
 *       500:
 *         description: Error del servidor
 */

// Actualizar un movimiento
router.put('/actualizar/movimientos/:id', (req, res) => {
  const { id } = req.params;
  const { ID_MateriaPrima, Tipo, Cantidad, ID_Proveedor } = req.body;
  const query = 'UPDATE movimientos SET ID_MateriaPrima = ?, Tipo = ?, Cantidad = ?, ID_Proveedor = ? WHERE ID = ?';
  db.query(query, [ID_MateriaPrima, Tipo, Cantidad, ID_Proveedor, id], (err, result) => {
      if (err) {
          res.status(500).json({ error: err.message });
      } else if (result.affectedRows === 0) {
          res.status(404).json({ message: 'Movimiento no encontrado' });
      } else {
          res.json({ message: 'Movimiento actualizado correctamente' });
      }
  });
});

/**
 * @swagger
 * /eliminar/movimientos/{id}:
 *   delete:
 *     summary: Elimina un movimiento por ID
 *     tags: [Movimientos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movimiento eliminado correctamente
 *       404:
 *         description: Movimiento no encontrado
 *       500:
 *         description: Error del servidor
 */

// Eliminar un movimiento
router.delete('/eliminar/movimientos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM movimientos WHERE ID = ?', [id], (err, result) => {
      if (err) {
          res.status(500).json({ error: err.message });
      } else if (result.affectedRows === 0) {
          res.status(404).json({ message: 'Movimiento no encontrado' });
      } else {
          res.json({ message: 'Movimiento eliminado correctamente' });
      }
  });
});

// Obtener todas las entradas de materia prima
router.get('/entradas', async (req, res) => {
    try {
        const [rows] = await db.query('CALL ReporteEntradasMateriaPrima()');
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.sqlMessage || 'Error en el servidor' });
    }
});

// Obtener todas las salidas de materia prima
router.get('/salidas', async (req, res) => {
    try {
        const [rows] = await db.query('CALL ReporteSalidasMateriaPrima()');
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.sqlMessage || 'Error en el servidor' });
    }
});

module.exports = router;