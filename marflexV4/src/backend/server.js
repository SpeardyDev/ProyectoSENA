require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectMongoDB = require("./config/dbMongo"); // Conectar a MongoDB
const { swaggerDocs: V1SwaggerDocs } = require("./swagger");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const colchonesRoutes = require("./routes/colchonesRoutes");
const detalleRoutes = require("./routes/detalleRoutes");
const estadosRoutes = require("./routes/estadosRoutes");
const materiaprimaRoutes = require("./routes/materiaprimaRoutes");
const movimientosRoutes = require("./routes/movimientosRoutes");
const proveedoresRoutes = require("./routes/proveedoresRoutes");
const reportes = require("./routes/reportes");
const solicitudesRoutes = require("./routes/solicitudesRoutes");
const usuariosRoutes = require("./routes/userRoutes");

const app = express();
const puerto = process.env.PORT || 3000;

// Conectar a MongoDB
connectMongoDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use(authRoutes);
app.use(colchonesRoutes);
app.use(detalleRoutes);
app.use(estadosRoutes);
app.use(materiaprimaRoutes);
app.use(movimientosRoutes);
app.use(proveedoresRoutes);
app.use(reportes);
app.use(solicitudesRoutes);
app.use(usuariosRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(puerto, () => {
  console.log(`Servidor corriendo en el puerto ${puerto}`);
  V1SwaggerDocs(app, puerto);
});