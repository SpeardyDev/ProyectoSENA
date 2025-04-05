const express = require("express");
const router = express.Router();
const db = require("../config/dbMysql"); // Conexión a la base de datos
// const fs = require("fs");
// const path = require("path");

// Endpoint para obtener el reporte de última compra por proveedor
router.get("/reporte-ultima-compra-proveedores", async (req, res) => {
  try {
    const [rows] = await db.query("CALL ReporteUltimaCompraProveedores()");

    // Formatear la fecha correctamente
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

    // Formatear la fecha al estilo YYYY-MM-DD
    const datosFormateados = rows[0].map((item) => ({
      ...item,
      Fecha: item.Fecha ? item.Fecha.toISOString().split("T")[0] : null,
    }));

    res.json(datosFormateados);
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || "Error en el servidor" });
  }
});


// Endpoint para obtener las entradas de materia prima por fecha
router.post("/reporte-entradas-por-fecha", async (req, res) => {
  const { fecha_inicio, fecha_fin } = req.body;

  if (!fecha_inicio || !fecha_fin) {
    return res.status(400).json({ error: "Las fechas de inicio y fin son requeridas" });
  }

  try {
    const [rows] = await db.query("CALL ReporteEntradasPorFecha(?, ?)", [
      fecha_inicio,
      fecha_fin,
    ]);

    // Formatear la fecha antes de enviarla
    const datosFormateados = rows[0].map((item) => ({
      ...item,
      Fecha: item.Fecha ? item.Fecha.toISOString().split("T")[0] : null,
    }));

    res.json(datosFormateados);
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

    // Formatear fechas
    const dataFormateada = rows[0].map((item) => ({
      ...item,
      Fecha: item.Fecha ? new Date(item.Fecha).toISOString().split("T")[0] : null,
    }));

    res.json(dataFormateada);
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

    // Transformar fecha si existe el campo
    const dataFormateada = rows[0].map(item => {
      if (item.Fecha_Fabricacion) {
        item.Fecha_Fabricacion = item.Fecha_Fabricacion.toISOString().split("T")[0]; // yyyy-mm-dd
      }
      return item;
    });

    res.json(dataFormateada);
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || "Error en el servidor" });
  }
});


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
    // Formatear la fecha correctamente
    const dataFormateada = rows[0].map((item) => ({
      ...item,
      Fecha_Fabricacion: item.Fecha_Fabricacion
        ? new Date(item.Fecha_Fabricacion).toISOString().split("T")[0]
        : null,
    }));
    res.json(dataFormateada); // Tomamos la primera parte del resultado de MySQL
  } catch (error) {
    res.status(500).json({ error: error.sqlMessage || "Error en el servidor" });
  }
});

// backend/routes/reportes.js o donde esté tu router
const Usuario = require("../models/User.js"); // Importar el modelo de Mongo

router.get("/Todos", async (req, res) => {
  try {
    // Obtener usuarios desde MongoDB
    const usuariosMongo = await Usuario.find({}, "nombre username rol").lean();

    // Obtener proveedores y productos desde MySQL
    const [proveedores] = await db.query("SELECT ID, Nombre, Telefono, Direccion FROM proveedores");
    const [materia_prima] = await db.query("SELECT ID, Nombre, Stock, Unidad FROM materia_prima");

    // Enviar todo junto en la respuesta
    res.json({
      usuarios: usuariosMongo,
      proveedores,
      materia_prima,
    });
  } catch (error) {
    console.error("Error en el reporte 'Todos':", error);
    res.status(500).json({ error: "Error generando el reporte combinado" });
  }
});





module.exports = router;