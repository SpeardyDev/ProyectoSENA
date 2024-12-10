const express = require("express");
const mongoose = require("mongoose");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();

const app = express();
const puerto = 3000;

// Conexión a MongoDB (opcional si usas solo MySQL)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Conexión exitosa a MongoDB");
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error);
  });

// Conexión MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "marflex",
});

db.connect((err) => {
  if (err) {
    console.error("Error al conectarse a la base de datos MySQL:", err);
    return;
  }
  console.log("Conexión exitosa a MySQL.");
});

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas para la gestión de inventario y pedidos
// 1. Obtener inventario completo
app.get("/api/inventario", (req, res) => {
  const query = "SELECT * FROM producto";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// 2. Agregar producto al inventario
app.post("/api/inventario/agregar", (req, res) => {
  const { Nombre, Cantidad, Precio, Descripcion, Categoria, FechaIngreso, ProveedorID, StockMinimo, EstadoID } = req.body;
  const query =
    "INSERT INTO producto (Nombre, Cantidad, Precio, Descripcion, Categoria, FechaIngreso, ProveedorID, StockMinimo, EstadoID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [Nombre, Cantidad, Precio, Descripcion, Categoria, FechaIngreso, ProveedorID, StockMinimo, EstadoID],
    (err, results) => {
      if (err) {
        console.error("Error al agregar producto:", err);
        return res.status(500).send(err);
      }
      res.status(201).send("Producto agregado exitosamente");
    }
  );
});

// 3. Actualizar datos de un producto
app.put("/api/inventario/:id", (req, res) => {
  const { id } = req.params;
  const { Nombre, Cantidad, Precio, Descripcion, Categoria, FechaIngreso, ProveedorID, StockMinimo, EstadoID } = req.body;
  const query =
    "UPDATE producto SET Nombre = ?, Cantidad = ?, Precio = ?, Descripcion = ?, Categoria = ?, FechaIngreso = ?, ProveedorID = ?, StockMinimo = ?, EstadoID = ? WHERE ID = ?";
  db.query(
    query,
    [Nombre, Cantidad, Precio, Descripcion, Categoria, FechaIngreso, ProveedorID, StockMinimo, EstadoID, id],
    (err, results) => {
      if (err) {
        console.error("Error al actualizar producto:", err);
        return res.status(500).send(err);
      }
      res.status(200).send("Producto actualizado exitosamente");
    }
  );
});

// 4. Eliminar producto
app.delete("/api/inventario/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM producto WHERE ID = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error al eliminar producto:", err);
      return res.status(500).send(err);
    }
    res.status(200).send("Producto eliminado exitosamente");
  });
});

// 5. Gestionar pedidos (similares a productos)
app.get("/api/pedidos", (req, res) => {
  const query = "SELECT * FROM pedidos"; // Asumiendo que existe una tabla 'pedidos'
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.post("/api/pedidos/agregar", (req, res) => {
  const { ClienteID, Fecha, Estado } = req.body;
  const query =
    "INSERT INTO pedidos (ClienteID, Fecha, Estado) VALUES (?, ?, ?)";
  db.query(query, [ClienteID, Fecha, Estado], (err, results) => {
    if (err) {
      console.error("Error al agregar pedido:", err);
      return res.status(500).send(err);
    }
    res.status(201).send("Pedido agregado exitosamente");
  });
});

// Servidor activo
app.listen(puerto, () => {
  console.log(`El servidor se está ejecutando en el puerto: ${puerto}`);
});
