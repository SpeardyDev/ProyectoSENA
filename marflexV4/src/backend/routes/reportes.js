const express = require("express");
const router = express.Router();
const db = require("../config/dbMysql");


/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: Endpoints para generar diversos reportes
 */

/**
 * @swagger
 * /reporte-ultima-compra-proveedores:
 *   get:
 *     summary: Reporte de última compra por proveedor
 *     tags: [Reportes]
 *     responses:
 *       200:
 *         description: Datos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Error del servidor
 */

// Endpoint para obtener el reporte de última compra por proveedor
router.get("/reporte-ultima-compra-proveedores", async (req, res) => {
  try {
    const [rows] = await db.query("CALL ReporteUltimaCompraProveedores()");
    const dataFormateada = rows[0].map((item) => ({
      ...item,
      UltimaCompra: item.UltimaCompra
        ? new Date(item.UltimaCompra).toISOString().split("T")[0]
        : null,
    }));

    res.json(dataFormateada);
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || "Error en el servidor" });
  }
});

/**
 * @swagger
 * /reporte-salidas-por-fecha:
 *   post:
 *     summary: Reporte de salidas de materia prima por fecha
 *     tags: [Reportes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fecha_inicio
 *               - fecha_fin
 *             properties:
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Reporte generado correctamente
 *       400:
 *         description: Fechas requeridas
 *       500:
 *         description: Error del servidor
 */

// Endpoint para obtener las salidas de materia prima por fecha
router.post("/reporte-salidas-por-fecha", async (req, res) => {
  const { fecha_inicio, fecha_fin } = req.body;

  if (!fecha_inicio || !fecha_fin) {
    return res
      .status(400)
      .json({ error: "Las fechas de inicio y fin son requeridas" });
  }

  try {
    const [rows] = await db.query("CALL ReporteSalidasPorFecha(?, ?)", [
      fecha_inicio,
      fecha_fin,
    ]);
    const datosFormateados = rows[0].map((item) => ({
      ...item,
      Fecha: item.Fecha ? item.Fecha.toISOString().split("T")[0] : null,
    }));

    res.json(datosFormateados);
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || "Error en el servidor" });
  }
});

/**
 * @swagger
 * /reporte-entradas-por-fecha:
 *   post:
 *     summary: Reporte de entradas de materia prima por fecha
 *     tags: [Reportes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fecha_inicio
 *               - fecha_fin
 *             properties:
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Reporte generado correctamente
 *       400:
 *         description: Fechas requeridas
 *       500:
 *         description: Error del servidor
 */

// Endpoint para obtener las entradas de materia prima por fecha
router.post("/reporte-entradas-por-fecha", async (req, res) => {
  const { fecha_inicio, fecha_fin } = req.body;

  if (!fecha_inicio || !fecha_fin) {
    return res
      .status(400)
      .json({ error: "Las fechas de inicio y fin son requeridas" });
  }

  try {
    const [rows] = await db.query("CALL ReporteEntradasPorFecha(?, ?)", [
      fecha_inicio,
      fecha_fin,
    ]);
    const datosFormateados = rows[0].map((item) => ({
      ...item,
      Fecha: item.Fecha ? item.Fecha.toISOString().split("T")[0] : null,
    }));

    res.json(datosFormateados);
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || "Error en el servidor" });
  }
});

/**
 * @swagger
 * /reporte-movimientos-materia-prima:
 *   post:
 *     summary: Reporte de movimientos por ID de materia prima
 *     tags: [Reportes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - materiaPrimaID
 *             properties:
 *               materiaPrimaID:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Reporte generado correctamente
 *       400:
 *         description: ID requerido
 *       500:
 *         description: Error del servidor
 */

// Endpoint para obtener los mivimientos por materia prima
router.post("/reporte-movimientos-materia-prima", async (req, res) => {
  const { materiaPrimaID } = req.body;

  if (!materiaPrimaID) {
    return res
      .status(400)
      .json({ error: "El ID de la materia prima es requerido" });
  }

  try {
    const [rows] = await db.query("CALL ReporteMovimientosPorMateriaPrima(?)", [
      materiaPrimaID,
    ]);
    const dataFormateada = rows[0].map((item) => ({
      ...item,
      Fecha: item.Fecha
        ? new Date(item.Fecha).toISOString().split("T")[0]
        : null,
    }));

    res.json(dataFormateada);
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || "Error en el servidor" });
  }
});

/**
 * @swagger
 * /reporte-bajo-stock:
 *   get:
 *     summary: Reporte de materias primas con bajo stock
 *     tags: [Reportes]
 *     responses:
 *       200:
 *         description: Lista de materias primas con bajo stock
 *       500:
 *         description: Error del servidor
 */

// Endpoint para obtener las materias primas con bajo stock
router.get("/reporte-bajo-stock", async (req, res) => {
  try {
    const [rows] = await db.query("CALL ReporteBajoStock()");
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || "Error en el servidor" });
  }
});

/**
 * @swagger
 * /reporte-inventario-stock:
 *   get:
 *     summary: Reporte de inventario actual de materias primas
 *     tags: [Reportes]
 *     responses:
 *       200:
 *         description: Reporte generado correctamente
 *       500:
 *         description: Error del servidor
 */

// Endpoint para obtener el inventario de las materias primas con stock actual
router.get("/reporte-inventario-stock", async (req, res) => {
  try {
    const [rows] = await db.query("CALL ReporteInventarioStockActual()");
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || "Error en el servidor" });
  }
});

/**
 * @swagger
 * /reporte-materia-prima-usada:
 *   get:
 *     summary: Reporte de materias primas utilizadas
 *     tags: [Reportes]
 *     responses:
 *       200:
 *         description: Reporte generado correctamente
 *       500:
 *         description: Error del servidor
 */

// Endpoint para obtener la materia prima usada
router.get("/reporte-materia-prima-usada", async (req, res) => {
  try {
    const [rows] = await db.query("CALL ReporteMateriaPrimaUsada()");
    const dataFormateada = rows[0].map((item) => {
      if (item.Fecha_Fabricacion) {
        item.Fecha_Fabricacion =
          item.Fecha_Fabricacion.toISOString().split("T")[0]; // yyyy-mm-dd
      }
      return item;
    });

    res.json(dataFormateada);
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || "Error en el servidor" });
  }
});

/**
 * @swagger
 * /reporte-produccion-fechas:
 *   post:
 *     summary: Reporte de producción entre fechas
 *     tags: [Reportes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fecha_inicio
 *               - fecha_fin
 *             properties:
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Reporte generado correctamente
 *       400:
 *         description: Fechas requeridas
 *       500:
 *         description: Error del servidor
 */

// Endpoint para obtener información de producción por fechas
router.post("/reporte-produccion-fechas", async (req, res) => {
  const { fecha_inicio, fecha_fin } = req.body;

  if (!fecha_inicio || !fecha_fin) {
    return res
      .status(400)
      .json({ error: "Las fechas de inicio y fin son requeridas" });
  }

  try {
    const [rows] = await db.query("CALL ReporteProduccionPorFechas(?, ?)", [
      fecha_inicio,
      fecha_fin,
    ]);
    const dataFormateada = rows[0].map((item) => ({
      ...item,
      Fecha_Fabricacion: item.Fecha_Fabricacion
        ? new Date(item.Fecha_Fabricacion).toISOString().split("T")[0]
        : null,
    }));
    res.json(dataFormateada);
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || "Error en el servidor" });
  }
});

/**
 * @swagger
 * /Todos:
 *   get:
 *     summary: Reporte combinado de usuarios, proveedores y materias primas
 *     tags: [Reportes]
 *     responses:
 *       200:
 *         description: Datos combinados obtenidos correctamente
 *       500:
 *         description: Error generando el reporte
 */

router.get("/Todos", async (req, res) => {
  try {
    // Obtener usuarios de MySQL
    const [usuarios] = await db.query(
      "SELECT id, nombre, username, rol FROM users"
    );

    // Obtener proveedores
    const [proveedores] = await db.query(
      "SELECT ID, Nombre, Telefono, Direccion FROM proveedores"
    );

    // Obtener materia prima
    const [materia_prima] = await db.query(
      "SELECT ID, Nombre, Stock, Unidad FROM materia_prima"
    );

    res.json({
      usuarios,
      proveedores,
      materia_prima,
    });
  } catch (error) {
    console.error("Error en el reporte 'Todos':", error);
    res.status(500).json({ error: "Error generando el reporte combinado" });
  }
});

module.exports = router;
