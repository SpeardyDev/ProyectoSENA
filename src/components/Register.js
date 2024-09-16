import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Administrador"); // Rol por defecto
  const navigate = useNavigate();

  // Función para registrar al usuario en localStorage
  const handleRegister = (e) => {
    e.preventDefault();

    // Obtener los usuarios actuales del localStorage o inicializar un array vacío
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Verificar si el usuario ya existe
    const userExists = storedUsers.some(user => user.username === username);

    if (userExists) {
      alert("El usuario ya existe.");
      return;
    }

    // Agregar el nuevo usuario
    const newUser = { username, password, role };
    storedUsers.push(newUser);

    // Guardar los usuarios actualizados en localStorage
    localStorage.setItem("users", JSON.stringify(storedUsers));

    alert(`Usuario ${username} registrado exitosamente.`);

    // Redirigir a la página de login
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Registro Marflex</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Usuario</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Rol</label>
          <select
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="Administrador">Administrador</option>
            <option value="Costurero">Costurero</option>
            <option value="Parrillero">Parrillero</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
