const mysql = require("mysql2/promise");
require("dotenv").config(); // Cargar variables de entorno

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "bdmarflex",
  waitForConnections: true,
  connectionLimit: 10, // Número máximo de conexiones
  queueLimit: 0
});

// Verificar la conexión con un mensaje en consola
(async () => {
  try {
    const connection = await db.getConnection();
    console.log(" Conexión exitosa a MySQL");
    connection.release(); // Liberar la conexión
  } catch (error) {
    console.error(" Error al conectar con MySQL:", error);
  }
})();

module.exports = db;
