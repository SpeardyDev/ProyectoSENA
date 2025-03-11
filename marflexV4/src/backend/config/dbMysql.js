const mysql = require("mysql");
require("dotenv").config(); // Para usar variables de entorno

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "bdmarflex",
});

db.connect((err) => {
  if (err) {
    console.error("Error al conectarse a MySQL:", err);
    return;
  }
  console.log("Conexión exitosa a MySQL");
});

module.exports = db;