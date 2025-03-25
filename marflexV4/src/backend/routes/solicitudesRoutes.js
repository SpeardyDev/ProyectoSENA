const express = require("express");
const router = express.Router();
const db = require("../config/dbMysql");
const bodyParser = require("body-parser");
router.use(bodyParser.json());

/**
 * @swagger
 * tags:
 *   name: Solicitudes
 *   description: Endpoints para la gestión de solicitudes
 */

/**
 * @swagger
 * /solicitudes_materia_prima:
 *   get:
 *     summary: Obtener todas las solicitudes de materia prima
 *     tags: [Solicitudes]
 *     responses:
 *       200:
 *         description: Lista de solicitudes obtenida exitosamente
 *       500:
 *         description: Error en el servidor
 */

// Obtener todas las solicitudes
router.get("/solicitudes_materia_prima", (req, res) => {
  db.query("SELECT * FROM solicitudes_materia_prima", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

/**
 * @swagger
 * /solicitudes_materia_prima/{id}:
 *   get:
 *     summary: Obtener una solicitud por ID
 *     tags: [Solicitudes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la solicitud
 *     responses:
 *       200:
 *         description: Solicitud encontrada
 *       404:
 *         description: Solicitud no encontrada
 *       500:
 *         description: Error en el servidor
 */

// Obtener una solicitud por ID
router.get("/solicitudes_materia_prima/:id", (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT * FROM solicitudes_materia_prima WHERE ID = ?",
    [id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (result.length === 0) {
        res.status(404).json({ message: "Solicitud no encontrada" });
      } else {
        res.json(result[0]);
      }
    }
  );
});

/**
 * @swagger
 * /agregar/solicitudes_materia_prima:
 *   post:
 *     summary: Crear una nueva solicitud de materia prima
 *     tags: [Solicitudes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID_Empleado:
 *                 type: integer
 *               ID_Materiaprima:
 *                 type: integer
 *               Cantidad_Solicitada:
 *                 type: integer
 *               Estado:
 *                 type: string
 *               Motivo_Rechazo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Solicitud creada exitosamente
 *       500:
 *         description: Error en el servidor
 */

// Crear una nueva solicitud
router.post("/agregar/solicitudes_materia_prima", (req, res) => {
  const {
    ID_Usuario,
    ID_MateriaPrima,
    Cantidad_Solicitada,
    Estado,
    Motivo_Rechazo,
  } = req.body;
  const query =
    "INSERT INTO solicitudes_materia_prima (ID_Usuario, ID_Materiaprima, Cantidad_Solicitada, Estado, Motivo_Rechazo) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [ID_Usuario, ID_MateriaPrima, Cantidad_Solicitada, Estado, Motivo_Rechazo],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res
          .status(201)
          .json({
            id: result.insertId,
            ID_Usuario,
            ID_MateriaPrima,
            Cantidad_Solicitada,
            Estado,
            Motivo_Rechazo,
          });
      }
    }
  );
});



/**
 * @swagger
 * /actualizar/solicitudes_materia_prima/{id}:
 *   put:
 *     summary: Actualizar una solicitud de materia prima
 *     tags: [Solicitudes]
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
 *               ID_Empleado:
 *                 type: integer
 *               ID_Materiaprima:
 *                 type: integer
 *               Cantidad_Solicitada:
 *                 type: integer
 *               Estado:
 *                 type: string
 *               Motivo_Rechazo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Solicitud actualizada correctamente
 *       404:
 *         description: Solicitud no encontrada
 *       500:
 *         description: Error en el servidor
 */

// Actualizar una solicitud
router.put("/actualizar/solicitudes_materia_prima/:id", (req, res) => {
  const { id } = req.params;
  const {
    ID_Usuario,
    ID_MateriaPrima,
    Cantidad_Solicitada,
    Estado,
    Motivo_Rechazo,
  } = req.body;
  const query =
    "UPDATE solicitudes_materia_prima SET ID_Usuario = ?, ID_MateriaPrima = ?, Cantidad_Solicitada = ?, Estado = ?, Motivo_Rechazo = ? WHERE ID = ?";
  db.query(
    query,
    [
      ID_Usuario,
      ID_MateriaPrima,
      Cantidad_Solicitada,
      Estado,
      Motivo_Rechazo,
      id,
    ],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: "Solicitud no encontrada" });
      } else {
        res.json({ message: "Solicitud actualizada correctamente" });
      }
    }
  );
});

/**
 * @swagger
 * /eliminar/solicitudes_materia_prima/{id}:
 *   delete:
 *     summary: Eliminar una solicitud de materia prima
 *     tags: [Solicitudes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Solicitud eliminada correctamente
 *       404:
 *         description: Solicitud no encontrada
 *       500:
 *         description: Error en el servidor
 */

// Eliminar una solicitud
router.delete("/eliminar/solicitudes_materia_prima/:id", (req, res) => {
  const { id } = req.params;
  db.query(
    "DELETE FROM solicitudes_materia_prima WHERE ID = ?",
    [id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: "Solicitud no encontrada" });
      } else {
        res.json({ message: "Solicitud eliminada correctamente" });
      }
    }
  );
});

/**
 * @swagger
 * /solicitudes/pendientes:
 *   get:
 *     summary: Obtener todas las solicitudes pendientes (Solo Admin)
 *     tags: [Solicitudes]
 *     responses:
 *       200:
 *         description: Lista de solicitudes pendientes obtenida exitosamente
 *       500:
 *         description: Error en el servidor
 */

// Endpoint para obtener solicitudes pendientes
router.get('/solicitudes/pendientes', (req, res) => {
    const query = "SELECT * FROM solicitudes_materia_prima WHERE Estado = 'pendiente'";
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json(results);
    });
});

/**
 * @swagger
 * /aprobar-solicitud:
 *   post:
 *     summary: Aprobar una solicitud de materia prima (Solo Admin)
 *     tags: [Solicitudes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_solicitud:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Solicitud aprobada correctamente
 *       400:
 *         description: ID de solicitud requerido
 *       500:
 *         description: Error en el servidor
 */

// Endpoint para aprobar solicitudes de los empleados
router.post("/aprobar-solicitud", async (req, res) => {
  try {
    const { ID } = req.body;

    if (!ID) {
      return res.status(400).json({ error: "ID de solicitud requerido" });
    }

    const [result] = await db.query("CALL AprobarSolicitud(?)", [ID]);

    res.json({
      message: "Solicitud aprobada correctamente",
      result,
    });
  } catch (error) {
    console.error("Error en la aprobación:", error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
});

/**
 * @swagger
 * /rechazar-solicitud:
 *   post:
 *     summary: Rechazar una solicitud de materia prima (Solo Admin)
 *     tags: [Solicitudes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_solicitud:
 *                 type: integer
 *               motivo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Solicitud rechazada correctamente
 *       400:
 *         description: ID de solicitud y motivo requeridos
 *       500:
 *         description: Error en el servidor
 */

// Endpoint para rechazar solicitudes de los empleados
router.post("/rechazar-solicitud", async (req, res) => {
  const { ID, Motivo_Rechazo } = req.body;

  console.log("Datos recibidos:", req.body); // 🔍 Verifica qué datos llegan

  if (!ID || !Motivo_Rechazo) {
    return res.status(400).json({ error: "ID de solicitud y motivo son requeridos" });
  }

  try {
    await db.query("CALL RechazarSolicitud(?, ?)", [ID, Motivo_Rechazo]);
    res.json({ message: "Solicitud rechazada correctamente" });
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ error: error.sqlMessage || "Error en el servidor" });
  }
});

module.exports = router;