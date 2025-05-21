import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import logo from "../img/LogoMarflex.png";
import personaImg from "../img/persona-que-relaja-casa.png";
import passwordIcon from "../img/password.png";
import visibilityImg from "../img/visibility.png";
import visibilityOffImg from "../img/visibility_off.png";
import { useNavigate, Link } from "react-router-dom";
import { useState, useContext, useEffect, useCallback } from "react";
import "./styles/Login.css"; 
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ROL_ROUTES = {
  Administrador: "/HomeAdmin",
  Empleado: "/HomeEmpleado",
};

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, login } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      const rol = localStorage.getItem("rol");
      if (rol && ROL_ROUTES[rol]) {
        navigate(ROL_ROUTES[rol], { replace: true });
      }
    }
  }, [isAuthenticated, navigate]);

  const IniciarLogin = useCallback(async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const { data } = await axios.post(`${backendUrl}/login`, {
        username: username.trim().toLowerCase(),
        password,
      });

      const { token, rol, userId, nombre, fotoPerfil, username: usuario } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("username", usuario); 
      localStorage.setItem("userId", userId);
      localStorage.setItem("nombre", nombre);
      localStorage.setItem("rol", rol);
      localStorage.setItem("fotoPerfil", fotoPerfil || "foto-perfil.jpg");

      login(token);

      if (ROL_ROUTES[rol]) {
        navigate(ROL_ROUTES[rol]);
      }
    } catch (error) {
      setErrorMsg("Usuario o contraseña incorrectos");
    }
  }, [username, password, login, navigate]);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible(v => !v);
  }, []);

  return (
    <div className="contenedor">
      <form className="mi-app-formulario" onSubmit={IniciarLogin} method="post" autoComplete="on">
        <div className="img-presentacion">
          <img
            className="img_presentacion_login"
            src={personaImg}
            alt="imagen de presentación"
          />
        </div>

        <div className="formulario">
          <div className="titulo-login">
            <img className="img-logo" src={logo} alt="Logo de la empresa" />
            <h1 className="h1-login">LOGIN</h1>
          </div>

          <div className="content-input">
            <span className="span">
              <FontAwesomeIcon
                className="icon"
                icon={faUsers}
                size="xl"
                style={{ color: "#646973" }}
              />
              <input
                className="input_login"
                placeholder="Nombre de usuario"
                type="email"
                value={username}
                required
                autoComplete="username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </span>

            <span className="span password-container">
              <img
                className="icon"
                src={passwordIcon}
                alt="icono de password"
              />
              <input
                className="input_login"
                placeholder="Contraseña"
                type={passwordVisible ? "text" : "password"}
                value={password}
                required
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                className="visibility_off"
                src={passwordVisible ? visibilityImg : visibilityOffImg}
                alt={passwordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer" }}
              />
            </span>

            {errorMsg && (
              <span className="span" style={{ color: "red", fontSize: "0.9em" }}>
                {errorMsg}
              </span>
            )}

            <span className="span">
              <button className="btn-iniciar" type="submit">
                Iniciar Sesión
              </button>
            </span>

            <span className="span">
              <Link to="/RecuperarContraseña">
                ¿Has olvidado tu contraseña?
              </Link>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;