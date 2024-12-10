const express = require("express");
const mongoose = require("mongoose");
const mysql = require("mysql");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const recoveryRoutes = require("./routes/recoveryRoutes");
const models = require('./models/User')
const bcrypt = require('bcrypt');
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
  database: "bdmarflex",
});

db.connect((err) => {
  if (err) {
    console.error("Error al conectarse a la base de datos MySQL:", err);
    return;
  }
  console.log("Conexión exitosa a MySQL.");
});


//  obtener todos los usuarios 
app.get("/api/usuarios", async (req, res) => {
  try {
    const usuarios = await models.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error });
  }
});
// editar  usuarios
app.put("/api/editar/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;

    if (datosActualizados.password) {
      datosActualizados.password = await bcrypt.hash(datosActualizados.password, 10);
    }

    const usuarioActualizado = await models.findByIdAndUpdate(id, datosActualizados, {
      new: true,
    });

    if (!usuarioActualizado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario", error });
  }
});

// Endpoint para eliminar un usuario 
app.delete("/api/eliminar/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params; 
    const usuarioEliminado = await models.findByIdAndDelete(id);
    if (!usuarioEliminado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario", error });
  }
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
// Filtra los ultimos 4 Proveedores agregados para la tabla reportes
app.get("/api/ultimos/proveedores", (req, res) => {
  const query = "SELECT * FROM proveedor ORDER BY ID DESC LIMIT 4";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});
// Filtra los ultimos 4 Productos agregados para la tabla reportes
app.get("/api/ultimos/productos", (req, res) => {
  const query = "SELECT ID, Cantidad, Nombre,  Precio, Descripcion, Categoria, DATE_FORMAT(FechaIngreso, '%Y-%m-%d') as FechaIngreso, StockMinimo, EstadoID FROM producto ORDER BY ID DESC LIMIT 4";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});
app.get("/api/proveedores/consultar/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM proveedor WHERE ID = ?";
  db.query(query, [id], (err, resultado) => {
    if (err) {
      console.error("Error en la base de datos:", err);
      return res.status(500).send(err);
    }
    res.status(200).json(resultado);
  });
});
// SELECT QUE MUESTRA TODOS LOS DATOS DE LA TABLA PRODUCTOS
app.get("/api/productos", (req, res) => {
  db.query("SELECT ID, Cantidad, Nombre,  Precio, Descripcion, Categoria, DATE_FORMAT(FechaIngreso, '%Y-%m-%d') as FechaIngreso, StockMinimo, EstadoID FROM producto", (err, results) => {
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
//
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
  const { Nombre, Descripcion, Precio, Cantidad, StockMinimo, Categoria, FechaIngreso, EstadoID } = req.body;
  const query = `INSERT INTO producto (Nombre, Descripcion, Precio, Cantidad, StockMinimo, Categoria, FechaIngreso, EstadoID)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [
    Nombre, Descripcion, Precio, Cantidad, StockMinimo, Categoria, FechaIngreso, EstadoID ], (err, results) => {
      if (err) {
        console.error("Error en la base de datos:", err);
        return res.status(500).send(err);
      }
      res.status(201).send("Producto agregado exitosamente");
    }
  );
});


// ELIMINAR REGISTROS DE LA TABLA PROVEEDOR
app.delete("/api/proveedores/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM Proveedor WHERE ID = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error en la base de datos:", err); 
      return res.status(500).send(err);
    }
    res.status(200).send("Proveedor eliminado exitosamente");
  });
});
// ELIMINAR REGISTROS DE LA TABLA PRODUCTOS
app.delete("/api/eliminar/productos/:id", (req, res) => {
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
// GET para retornar todas las materias primas
app.get('/api/materiasprimas', (req, res) => {
  const query = 'SELECT * FROM materiaprimas';
  db.query(query, (error, resultados) => {
      if (error) {
          console.error(error);
          res.status(500).json({ mensaje: 'Error al obtener las materias primas' });
      } else {
          res.json(resultados);
      }
  });
});

// POST para agregar una nueva materia prima
app.post('/api/materiasprimas/agregar', (req, res) => {
  const  { Cantidad, Descripcion, Categoria, Nombre, TblProveedorID } = req.body;
  const query ="INSERT INTO materiaprimas ( Cantidad, Descripcion, Categoria, Nombre, TblProveedorID) VALUES (?, ?, ?, ?, ?)";
  db.query(query,[Cantidad, Descripcion, Categoria, Nombre, TblProveedorID],(err, results) => {
      if (err) {
        console.error("Error en la base de datos:", err); 
        return res.status(500).send(err);
      }else{
        res.status(201).send("Proveedor agregado exitosamente");
      }
    }
  );
});

//  modificar una materia prima  por ID
app.put("/api/materiasprimas/editar/:id", (req, res) => {
  const { id } = req.params; 
  const { Cantidad, Descripcion, Categoria, Nombre, TblProveedorID } = req.body;

  if (!Cantidad || !Descripcion || !Categoria || !Nombre || !TblProveedorID) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const query =
    "UPDATE materiaprimas SET Cantidad = ?, Descripcion = ?, Categoria = ?, Nombre = ?, TblProveedorID = ? WHERE ID = ?";

  db.query(
    query,
    [Cantidad, Descripcion, Categoria, Nombre, TblProveedorID, id],
    (err, results) => {
      if (err) {
        console.error("Error en la base de datos:", err);
        return res.status(500).json({ error: "Error al modificar la materia prima" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Materia prima no encontrada" });
      }
      res.status(200).json({ mensaje: "Materia prima editada exitosamente" });
    }
  );
});

// DELETE para eliminar una materia prima por ID
app.delete('/api/materiasprimas/borrar/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM materiaprimas WHERE ID = ?';
  db.query(query, [id], (error) => {
      if (error) {
          console.error(error);
          res.status(500).json({ mensaje: 'Error al borrar la materia prima' });
      } else {
          res.json({ mensaje: 'Materia prima eliminada correctamente' });
      }
  });
});
////////////////////////////////////////////////////////////////////////

app.listen(puerto, () => {
  console.log("El servidor se está ejecutando en el puerto:", puerto);
});
