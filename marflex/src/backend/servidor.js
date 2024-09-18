const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); 
require('dotenv').config(); 

const app = express();

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conexion exitosa');
  })
  .catch((error) => {
    console.error('Error al conectar tipo de error:', error);
  });

app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);

app.listen(3000, () => {
  console.log('El servidor se está ejecutando en el puerto 3000');
});

