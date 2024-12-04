const express = require("express");
const mongoose = require("mongoose");
const mysql = require("mysql");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const recoveryRoutes = require("./routes/recoveryRoutes");
require("dotenv").config();
const app = express();
const puerto = 3000;

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Conexión exitosa a MongoDB");
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error);
  });

app.use(cors());
app.use(express.json());
app.use("/api", authRoutes, recoveryRoutes);

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

// SELECT QUE MUESTRA TODOS LOS DATOS DE LA TABLA PROVEEDORES
app.get("/api/proveedores", (req, res) => {
  db.query("SELECT * FROM proveedor", (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// SELECT QUE MUESTRA TODOS LOS DATOS DE LA TABLA PRODUCTOS
app.get("/api/productos", (req, res) => {
  db.query("SELECT Cantidad, Nombre,  Precio, Descripcion, Categoria, DATE_FORMAT(FechaIngreso, '%Y-%m-%d') as FechaIngreso, ProveedorID, StockMinimo, EstadoID FROM producto", (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

//Estados
app.get('/api/estados', (req, res) => {
  db.query('SELECT ID, Estado FROM estado', (error, results) => {
    if (error) {
      return res.status(500).send('Error al obtener los estados: ' + error);
    }
    res.json(results);
  });
});

//INSERTAR DATOS EN LA TABLA PROVEEDORES
app.post("/api/agregar", (req, res) => {
  const { Nombre, Telefono1, Telefono2, Direccion, Barrio, Ciudad } = req.body;
  console.log("Datos recibidos:", req.body); 
  const query =
    "INSERT INTO Proveedor (Nombre, Telefono1, Telefono2, Direccion, Barrio, Ciudad) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [Nombre, Telefono1, Telefono2, Direccion, Barrio, Ciudad],
    (err, results) => {
      if (err) {
        console.error("Error en la base de datos:", err); 
        return res.status(500).send(err);
      }
      res.status(201).send("Proveedor agregado exitosamente");
    }
  );
});

//INSERTAR DATOS EN LA TABLA PRODUCTOS
app.post("/api/agregar/productos", (req, res) => {
  const { Nombre, Descripcion, Precio, Cantidad, StockMinimo, Categoria, FechaIngreso, ProveedorID, EstadoID } = req.body;
  console.log("Datos recibidos:", req.body); 
  const query =
    "INSERT INTO producto( Cantidad, Nombre, Precio, Descripcion, Categoria, FechaIngreso, ProveedorID, StockMinimo, EstadoID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(query,[Nombre, Descripcion, Precio, Cantidad, StockMinimo, Categoria, FechaIngreso, ProveedorID, EstadoID],(err, results) => {
      if (err) {
        console.error("Error en la base de datos:", err); 
        return res.status(500).send(err);
      }
      res.status(201).send("Proveedor agregado exitosamente");
    }
  );
});

// ELIMINAR REGISTROS DE LA TABLA PROVEEDOR
app.delete("/api/proveedores/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM Proveedor WHERE ID = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error en la base de datos:", err); // Detalles del error
      return res.status(500).send(err);
    }
    res.status(200).send("Proveedor eliminado exitosamente");
  });
});

// ELIMINAR REGISTROS DE LA TABLA PRODUCTOS
app.delete("/api/productos/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM producto WHERE ID = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error en la base de datos:", err);
      return res.status(500).send(err);
    }
    res.status(200).send("Producto eliminado exitosamente");
  });
});

//  EDITAR  REGISTROS DE LA TABLA PROVEEDOR
app.post("/api/editar/:id", (req, res) => {
  const { id } = req.params;
  const { Nombre, Telefono1, Telefono2, Direccion, Barrio, Ciudad } = req.body;
  const query =
    "UPDATE proveedor SET Nombre = ?, Telefono1 = ?, Telefono2 = ?, Direccion = ?, Barrio = ?, Ciudad = ? WHERE ID = ?";
  db.query(query,[Nombre, Telefono1, Telefono2, Direccion, Barrio, Ciudad, id],(err, results) => {
      if (err) {
        console.error("Error en la base de datos:", err);
        return res.status(500).send(err);
      }
      res.status(200).send("Proveedor editado exitosamente");
    }
  );
});

////////////////////////////////////////////////////////////////////////

app.listen(puerto, () => {
  console.log("El servidor se está ejecutando en el puerto:", puerto);
});
