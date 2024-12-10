const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  documento:{type: String, required: true },
  nombre:{type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol:{type: String, required: true },
  estado:{type: String, required: true },
  telefono:{type: String, required: true },
});

// Encriptar la contraseña antes de guardar el usuario
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
