const express = require("express");
const db = require("../config/dbMysql"); // Importar la conexión a MySQL
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Colchones
 *   description: Endpoints para la gestión de colchones
 */

/**
 * @swagger
 * /colchones:
 *   get:
 *     summary: Obtiene todos los colchones
 *     tags: [Colchones]
 *     responses:
 *       200:
 *         description: Lista de colchones obtenida exitosamente
 *       500:
 *         description: Error del servidor
 */

// Obtener todos los colchones
router.get('/colchones', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM colchones');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /colchones/{id}:
 *   get:
 *     summary: Obtiene un colchón por ID
 *     tags: [Colchones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Colchón obtenido exitosamente
 *       404:
 *         description: Colchón no encontrado
 */

// Obtener un colchón por ID
router.get('/colchones/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('SELECT * FROM colchones WHERE ID = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'Colchón no encontrado' });
    }
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /agregar/colchones:
 *   post:
 *     summary: Agrega un nuevo colchón
 *     tags: [Colchones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Modelo:
 *                 type: string
 *               Descripcion:
 *                 type: string
 *               Fecha_Fabricacion:
 *                 type: string
 *               Cantidad:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Colchón agregado exitosamente
 *       500:
 *         description: Error del servidor
 */

// Crear un nuevo colchón
router.post('/agregar/colchones', async (req, res) => {
  const { Modelo, Descripcion, Fecha_Fabricacion, Cantidad } = req.body;
  try {
    const query = 'INSERT INTO colchones (Modelo, Descripcion, Fecha_Fabricacion, Cantidad) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(query, [Modelo, Descripcion, Fecha_Fabricacion, Cantidad]);
    res.status(201).json({ id: result.insertId, Modelo, Descripcion, Fecha_Fabricacion, Cantidad });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /actualizar/colchones/{id}:
 *   put:
 *     summary: Actualiza un colchón existente
 *     tags: [Colchones]
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
 *               Modelo:
 *                 type: string
 *               Descripcion:
 *                 type: string
 *               Fecha_Fabricacion:
 *                 type: string
 *               Cantidad:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Colchón actualizado correctamente
 *       404:
 *         description: Colchón no encontrado
 *       500:
 *         description: Error del servidor
 */

// Actualizar un colchón
router.put('/actualizar/colchones/:id', async (req, res) => {
  const { id } = req.params;
  const { Modelo, Descripcion, Fecha_Fabricacion, Cantidad } = req.body;
  
  const fechaFormatoCorrecto = Fecha_Fabricacion ? new Date(Fecha_Fabricacion).toISOString().slice(0, 10) : null;
  
  try {
    const query = 'UPDATE colchones SET Modelo = ?, Descripcion = ?, Fecha_Fabricacion = ?, Cantidad = ? WHERE ID = ?';
    const [result] = await db.query(query, [Modelo, Descripcion, fechaFormatoCorrecto, Cantidad, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Colchón no encontrado' });
    }

    res.json({ message: 'Colchón actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /eliminar/colchones/{id}:
 *   delete:
 *     summary: Elimina un colchón por ID
 *     tags: [Colchones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Colchón eliminado correctamente
 *       404:
 *         description: Colchón no encontrado
 *       500:
 *         description: Error del servidor
 */

// Eliminar un colchón
router.delete('/eliminar/colchones/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM colchones WHERE ID = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Colchón no encontrado' });
    }

    res.json({ message: 'Colchón eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
