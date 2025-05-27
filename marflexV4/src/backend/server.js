require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const { swaggerDocs: V1SwaggerDocs } = require("./swagger");

// Importar rutas
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

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const puerto = process.env.PORT || 3001;

// SOLO UNA configuración de CORS para Express (REST)
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://frontend:3000",       // <--- PARA DOCKER COMPOSE
    "http://marflex.duckdns.org:3000", 
    "http://marflex.duckdns.org:3001"        
  ],
  credentials: true,
}));

app.use(express.json());

// Servir archivos estáticos (por ejemplo, para subidas)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configuración de Socket.IO (CORS para frontend)
const servidor = http.createServer(app);
const io = new Server(servidor, {
  cors: {
    origin: [
      "http://localhost:3000",     
      "http://127.0.0.1:3000",     
      "http://localhost:3001",
      "http://127.0.0.1:3001",
      "http://frontend:3000",       // <--- PARA DOCKER COMPOSE
      "http://marflex.duckdns.org:3000",
      "http://marflex.duckdns.org:3001"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
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
app.use(authRoutes);
app.use(colchonesRoutes);
app.use(detalleRoutes);
app.use(estadosRoutes);
app.use(materiaprimaRoutes);
app.use(movimientosRoutes);
app.use(proveedoresRoutes);
app.use(reportes);
app.use(solicitudesRoutes(io)); 
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