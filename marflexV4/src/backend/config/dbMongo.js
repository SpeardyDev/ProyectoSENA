const mongoose = require("mongoose");
require("dotenv").config();

const connectMongoDB = async () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Conexión exitosa a MongoDB");
    })
    .catch((error) => {
      console.error("Error al conectar a MongoDB:", error);
    });
};

module.exports = connectMongoDB;