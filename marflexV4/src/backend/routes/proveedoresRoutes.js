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
router.get('/proveedores', (req, res) => {
    db.query('SELECT * FROM proveedores', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
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
router.get('/proveedores/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM proveedores WHERE ID = ?', [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (result.length === 0) {
            res.status(404).json({ message: 'Proveedor no encontrado' });
        } else {
            res.json(result[0]);
        }
    });
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
router.post('/agregar/proveedores', (req, res) => {
    const { Nombre, Telefono, Direccion } = req.body;
    const query = 'INSERT INTO proveedores (Nombre, Telefono, Direccion) VALUES (?, ?, ?)';
    db.query(query, [Nombre, Telefono, Direccion], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id: result.insertId, Nombre, Telefono, Direccion });
        }
    });
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
router.put('/actualizar/proveedores/:id', (req, res) => {
    const { id } = req.params;
    const { Nombre, Telefono, Direccion } = req.body;
    const query = 'UPDATE proveedores SET Nombre = ?, Telefono = ?, Direccion = ? WHERE ID = ?';
    db.query(query, [Nombre, Telefono, Direccion, id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Proveedor no encontrado' });
        } else {
            res.json({ message: 'Proveedor actualizado correctamente' });
        }
    });
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
router.delete('/eliminar/proveedores/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM proveedores WHERE ID = ?', [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Proveedor no encontrado' });
        } else {
            res.json({ message: 'Proveedor eliminado correctamente' });
        }
    });
});

module.exports = router;