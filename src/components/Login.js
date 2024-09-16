import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Función para manejar el inicio de sesión
  const handleLogin = (e) => {
    e.preventDefault();

    // Obtener los usuarios del localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Buscar el usuario en localStorage
    const foundUser = storedUsers.find(user => user.username === username && user.password === password);

    if (foundUser) {
      setUser(foundUser);
      navigate("/dashboard"); // Redireccionar al dashboard si el login es exitoso
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Login Marflex</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit" className="btn btn-primary">Iniciar sesión</button>
      </form>
      <div className="mt-3 text-center">
        <p>¿No tienes una cuenta?</p>
        <Link to="/register" className="btn btn-link">Regístrate aquí</Link>
      </div>
    </div>
  );
}

export default Login;
