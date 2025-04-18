require("dotenv").config();
const express = require("express");
const cors = require("cors");
<<<<<<< HEAD
const connectMongoDB = require("./config/dbMongo"); 
const { swaggerDocs: V1SwaggerDocs } = require("./swagger");
const path = require("path");

// Importar rutas
=======
const connectMongoDB = require("./config/dbMongo"); // Conectar a MongoDB
const { swaggerDocs: V1SwaggerDocs } = require("./swagger");
const path = require("path");
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
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

<<<<<<< HEAD
const http = require("http");
const { Server } = require("socket.io");

=======
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
const app = express();
const puerto = process.env.PORT || 3000;

// Conectar a MongoDB
<<<<<<< HEAD
connectMongoDB().then(() => {
  console.log("Conexión a MongoDB exitosa");
}).catch((err) => {
  console.error("Error al conectar a MongoDB:", err);
});

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (por ejemplo, para subidas)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configuración de Socket.IO
const servidor = http.createServer(app);
const io = new Server(servidor, {
  cors: {
    origin: ["http://localhost:3001", "http://127.0.0.1:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutos
    skipMiddlewares: true,
  },
});

// Middleware para asignar la instancia `io` a cada solicitud
app.set("io", io);
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Montar rutas (incluyendo la instancia `io` en aquellas que lo necesiten)
=======
connectMongoDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
app.use(authRoutes);
app.use(colchonesRoutes);
app.use(detalleRoutes);
app.use(estadosRoutes);
app.use(materiaprimaRoutes);
app.use(movimientosRoutes);
app.use(proveedoresRoutes);
app.use(reportes);
<<<<<<< HEAD
app.use(solicitudesRoutes(io)); // Pasar `io` como parámetro para su uso en rutas
app.use(usuariosRoutes);

// Configuración de eventos de Socket.IO
io.on("connection", (socket) => {
  console.log(`🟢 Cliente conectado: ${socket.id}`);
  socket.on("disconnect", (reason) => {
    console.log(`🔴 Cliente desconectado (${reason}): ${socket.id}`);
  });
});

// Iniciar el servidor
servidor.listen(puerto, () => {
  console.log(`Servidor corriendo en el puerto ${puerto}`);
  V1SwaggerDocs(app, puerto); // Documentación de Swagger
});

module.exports = { app, servidor, io };
=======
app.use(solicitudesRoutes);
app.use(usuariosRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(puerto, () => {
  console.log(`Servidor corriendo en el puerto ${puerto}`);
  V1SwaggerDocs(app, puerto);
});
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
