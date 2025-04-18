const express = require("express");
const db = require("../config/dbMysql"); // Importar la conexión a MySQL
const router = express.Router();

<<<<<<< HEAD
// Función auxiliar para obtener la instancia de Socket.IO desde el req
const getIO = (req) => req.app.get("io");

=======
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
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
<<<<<<< HEAD
=======

>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
// Obtener toda la materia prima
router.get("/materia_prima", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM materia_prima");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
<<<<<<< HEAD
=======

>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
// Obtener una materia prima por ID
router.get("/materia_prima/:id", async (req, res) => {
  try {
    const { id } = req.params;
<<<<<<< HEAD
    const [rows] = await db.query("SELECT * FROM materia_prima WHERE ID = ?", [id]);
=======
    const [rows] = await db.query("SELECT * FROM materia_prima WHERE ID = ?", [
      id,
    ]);
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
    if (rows.length === 0) {
      return res.status(404).json({ message: "Materia prima no encontrada" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
<<<<<<< HEAD
// Agregar nueva materia prima
router.post("/agregar/materia_prima", async (req, res) => {
  try {
    const { Nombre, Descripcion, Stock, Unidad } = req.body;
    
    // Validación de campos obligatorios
    if (!Nombre || Stock === undefined || !Unidad) {
      return res.status(400).json({
        success: false,
        message: "Nombre, Stock y Unidad son campos requeridos"
      });
    }
    
    // Validación de que Stock sea un número
    if (typeof Stock !== 'number') {
      return res.status(400).json({
        success: false,
        message: "Stock debe ser un número"
      });
    }
    
    // Inserta la nueva materia prima en la base de datos
=======

// Crear nueva materia prima
router.post("/agregar/materia_prima", async (req, res) => {
  try {
    const { Nombre, Descripcion, Stock, Unidad } = req.body;
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
    const [result] = await db.query(
      "INSERT INTO materia_prima (Nombre, Descripcion, Stock, Unidad) VALUES (?, ?, ?, ?)",
      [Nombre, Descripcion, Stock, Unidad]
    );
<<<<<<< HEAD
    
    // Recupera el registro recién insertado
    const [newItem] = await db.query("SELECT * FROM materia_prima WHERE ID = ?", [result.insertId]);
    
    // Obtiene la instancia de Socket.IO y emite el evento con la información actualizada
    const io = req.app.get("io");
    if (io) {
      io.emit("materia_prima_actualizada", { ...newItem[0], updatedAt: new Date() });
    }
    
    // Retorna la respuesta con éxito y los datos del registro insertado
    res.status(201).json({
      success: true,
      data: newItem[0],
      message: "Materia prima agregada exitosamente"
    });
    
  } catch (error) {
    console.error("Error en POST /agregar/materia_prima:", error);
    res.status(500).json({
      success: false,
      message: "Error al agregar materia prima",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});


=======
    res
      .status(201)
      .json({ id: result.insertId, Nombre, Descripcion, Stock, Unidad });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
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
<<<<<<< HEAD
// Actualizar materia prima
router.put("/actualizar/materia_prima/:id", async (req, res) => {
  const io = getIO(req);  // Se obtiene la instancia mediante req.app.get("io")
  
  try {
    const { id } = req.params;
    const { Nombre, Descripcion, Stock, Unidad } = req.body;
    
    await db.query(
      "UPDATE materia_prima SET Nombre = ?, Descripcion = ?, Stock = ?, Unidad = ? WHERE ID = ?",
      [Nombre, Descripcion, Stock, Unidad, id]
    );
    
    const [updatedItem] = await db.query("SELECT * FROM materia_prima WHERE ID = ?", [id]);
    
    if (!updatedItem || updatedItem.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Materia prima no encontrada" 
      });
    }
        
    if (io) {
      io.emit("materia_prima_actualizada", updatedItem[0]);
    } else {
      console.error("Socket.IO no está disponible");
    }
    
    res.status(200).json({
      success: true,
      message: "Registro actualizado correctamente",
      data: updatedItem[0]
    });
    
  } catch (error) {
    console.error("Error en actualización:", error);
    res.status(500).json({ 
      success: false,
      message: "Error interno al actualizar el registro",
      error: error.message
    });
=======

// Actualizar materia prima
router.put("/actualizar/materia_prima/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre, Descripcion, Stock, Unidad } = req.body;
    const [result] = await db.query(
      "UPDATE materia_prima SET Nombre = ?, Descripcion = ?, Stock = ?, Unidad = ? WHERE ID = ?",
      [Nombre, Descripcion, Stock, Unidad, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Materia prima no encontrada" });
    }
    res.json({ message: "Materia prima actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
  }
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
<<<<<<< HEAD
=======

>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
// Eliminar materia prima
router.delete("/eliminar/materia_prima/:id", async (req, res) => {
  try {
    const { id } = req.params;
<<<<<<< HEAD
    const io = req.app.get("io");
    
    // Verificar que el registro exista
    const [item] = await db.query("SELECT * FROM materia_prima WHERE ID = ?", [id]);
    if (!item || item.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Materia prima no encontrada"
      });
    }
    
    // Intentar eliminar el registro
    const [result] = await db.query("DELETE FROM materia_prima WHERE ID = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(500).json({
        success: false,
        message: "No se pudo eliminar la materia prima"
      });
    }
    
    // Emitir el evento a través de Socket.IO para que los clientes se actualicen en tiempo real
    if (io) {
      io.emit("materia_prima_eliminada", id);
    }
    
    // Respuesta exitosa
    res.json({
      success: true,
      message: "Materia prima eliminada correctamente",
      deletedId: id
    });
    
  } catch (error) {
    console.error("Error al eliminar materia prima:", error);
    res.status(500).json({
      success: false,
      message: "Error interno al eliminar el registro",
      error: error.message
    });
  }
});


module.exports = router;
=======
    const [result] = await db.query("DELETE FROM materia_prima WHERE ID = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Materia prima no encontrada" });
    }
    res.json({ message: "Materia prima eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
