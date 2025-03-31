const express = require("express");
const router = express.Router();
const db = require("../config/dbMysql"); // Conexión a la base de datos
const fs = require("fs");
const path = require("path");

// Endpoint para obtener el reporte de última compra por proveedor
router.get("/reporte-ultima-compra-proveedores", async (req, res) => {
  try {
    const [rows] = await db.query("CALL ReporteUltimaCompraProveedores()");
    res.json(rows[0]); // Tomamos la primera parte del resultado de MySQL
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || "Error en el servidor" });
  }
});

// Endpoint para obtener las salidas de materia prima por fecha
router.post("/reporte-salidas-por-fecha", async (req, res) => {
  const { fechaInicio, fechaFin } = req.body;

  if (!fechaInicio || !fechaFin) {
    return res
      .status(400)
      .json({ error: "Las fechas de inicio y fin son requeridas" });
  }

  try {
    const [rows] = await db.query("CALL ReporteSalidasPorFecha(?, ?)", [
      fechaInicio,
      fechaFin,
    ]);
    res.json(rows[0]); // Tomamos la primera parte del resultado de MySQL
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || "Error en el servidor" });
  }
});

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
    res.json(rows[0]); // Tomamos la primera parte del resultado de MySQL
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || "Error en el servidor" });
  }
});

// Endpoint para obtener los mivimientos de materias primas por ID
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
    res.json(rows[0]); // Tomamos la primera parte del resultado de MySQL
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || "Error en el servidor" });
  }
});

// Endpoint para obtener las materias primas con bajo stock
router.get("/reporte-bajo-stock", async (req, res) => {
  try {
    const [rows] = await db.query("CALL ReporteBajoStock()");
    res.json(rows[0]); // MySQL devuelve un array de resultados, tomamos el primero
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || "Error en el servidor" });
  }
});

// Endpoint para obtener todo el inventario de las materias primas con stock actual
router.get("/reporte-inventario-stock", async (req, res) => {
  try {
    const [rows] = await db.query("CALL ReporteInventarioStockActual()");
    res.json(rows[0]); // MySQL devuelve un array de resultados, tomamos el primero
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || "Error en el servidor" });
  }
});

// Endpoint para obtener las materias primas usadas
router.get("/reporte-materia-prima-usada", async (req, res) => {
  try {
    const [rows] = await db.query("CALL ReporteMateriaPrimaUsada()");
    res.json(rows[0]); // Tomamos la primera parte del resultado de MySQL
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || "Error en el servidor" });
  }
});

// Endpoint para obtener información de producción por fechas
router.post("/reporte-produccion-fechas", async (req, res) => {
  const { fechaInicio, fechaFin } = req.body;

  if (!fechaInicio || !fechaFin) {
    return res
      .status(400)
      .json({ error: "Las fechas de inicio y fin son requeridas" });
  }

  try {
    const [rows] = await db.query("CALL ReporteProduccionPorFechas(?, ?)", [
      fechaInicio,
      fechaFin,
    ]);
    res.json(rows[0]); // Tomamos la primera parte del resultado de MySQL
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || "Error en el servidor" });
  }
});

// router.post("/generar-reporte", async (req, res) => {
//   try {
//       const { tipoReporte } = req.body;
//       const doc = new PDFDocument();
//       const fileName = `reporte-${tipoReporte}.pdf`;
//       const filePath = path.join(__dirname, `../public/reportes/${fileName}`);

//       // Asegurar que la carpeta "public/reportes" existe
//       if (!fs.existsSync(path.join(__dirname, "../public/reportes"))) {
//           fs.mkdirSync(path.join(__dirname, "../public/reportes"), { recursive: true });
//       }

//       // Crear el PDF y guardarlo
//       const writeStream = fs.createWriteStream(filePath);
//       doc.pipe(writeStream);

//       doc.fontSize(18).text(`Reporte: ${tipoReporte}`, { align: "center" });
//       doc.moveDown();
//       doc.fontSize(14).text("Aquí irían los datos del reporte seleccionado...");

//       doc.end();

//       writeStream.on("finish", () => {
//           res.json({ success: true, filePath: `/reportes/${fileName}` });
//       });

//   } catch (error) {
//       console.error("Error generando el reporte:", error);
//       res.status(500).json({ success: false, message: "Error generando el reporte" });
//   }
// });

module.exports = router;