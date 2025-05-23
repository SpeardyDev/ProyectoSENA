import React, { useState, useContext, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import logo from "../img/LogoMarflex.png";
import personaImg from "../img/persona-que-relaja-casa.png";
import passwordIcon from "../img/password.png";
import visibilityImg from "../img/visibility.png";
import visibilityOffImg from "../img/visibility_off.png";
import { useNavigate, Link } from "react-router-dom";
import "./styles/Login.css";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ROL_ROUTES = {
  Administrador: "/HomeAdmin",
  Empleado: "/HomeEmpleado",
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Login = React.memo(() => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, login } = useContext(AuthContext);

  useEffect(() => {
    document.title = "Iniciar sesión | Marflex";
    if (isAuthenticated) {
      const rol = localStorage.getItem("rol");
      if (rol && ROL_ROUTES[rol]) {
        navigate(ROL_ROUTES[rol], { replace: true });
      }
    }
  }, [isAuthenticated, navigate]);

  const IniciarLogin = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateEmail(username.trim())) {
        toast.error("Por favor, introduce un email válido.");
        return;
      }
      if (password.length < 6) {
        toast.warn("La contraseña debe tener al menos 6 caracteres.");
        return;
      }

      setLoading(true);
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        const { data } = await axios.post(
          `${backendUrl}/login`,
          {
            username: username.trim().toLowerCase(),
            password: password,
          },
          { headers: { "Content-Type": "application/json" }, timeout: 10000 }
        );

        const { token, rol, userId, nombre, fotoPerfil } = data;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("nombre", nombre);
        localStorage.setItem("rol", rol);
        localStorage.setItem("fotoPerfil", fotoPerfil || "foto-perfil.jpg");
        login(token);

        toast.success("¡Bienvenido!", { autoClose: 1500 });
        setTimeout(() => {
          if (ROL_ROUTES[rol]) navigate(ROL_ROUTES[rol]);
        }, 1700); // delay para que se vea el toast
      } catch (error) {
        toast.error("Credenciales inválidas. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    },
    [username, password, login, navigate]
  );

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible((v) => !v);
  }, []);

  return (
    <main
      className="contenedor"
      role="main"
      aria-label="Página de inicio de sesión"
    >
      <ToastContainer position="top-right" closeOnClick pauseOnHover />
      <form
        className="mi-app-formulario"
        onSubmit={IniciarLogin}
        method="post"
        autoComplete="off"
        aria-label="Formulario de inicio de sesión"
        noValidate
      >
        <div className="img-presentacion">
          <img
            className="img_presentacion_login"
            src={personaImg}
            alt="Persona relajada en casa"
            loading="lazy"
            width={300}
            height={300}
          />
        </div>
        <div className="formulario">
          <div className="titulo-login">
            <img
              className="img-logo"
              src={logo}
              alt="Logo Marflex"
              width={90}
              height={50}
              loading="lazy"
            />
            <h1 className="h1-login" tabIndex={0}>
              Iniciar sesión
            </h1>
          </div>
          <div className="content-input">
            <span className="span">
              <label htmlFor="login-username" className="sr-only">
                Correo electrónico
              </label>
              <FontAwesomeIcon
                className="icon"
                icon={faUsers}
                size="xl"
                style={{ color: "#646973" }}
                aria-hidden="true"
              />
              <input
                className="input_login"
                id="login-username"
                name="username"
                placeholder="Correo electrónico"
                type="text"
                inputMode="email"
                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                value={username}
                required
                autoComplete="username"
                onChange={(e) => setUsername(e.target.value)}
                aria-required="true"
                aria-label="Correo electrónico"
                maxLength={80}
              />
            </span>
            <span className="span password-container">
  <label htmlFor="login-password" className="sr-only">
    Contraseña
  </label>
  {/* Botón de visibilidad a la izquierda */}
  <button
    type="button"
    className="visibility_off"
    onClick={togglePasswordVisibility}
    aria-label={
      passwordVisible ? "Ocultar contraseña" : "Mostrar contraseña"
    }
    tabIndex={0}
    style={{
      cursor: "pointer",
      background: "none",
      border: "none",
      padding: 0,
      marginRight: 6,
    }}
  >
    <img
      src={passwordVisible ? visibilityImg : visibilityOffImg}
      alt={
        passwordVisible
          ? "Ocultar contraseña"
          : "Mostrar contraseña"
      }
      width={24}
      height={24}
      loading="lazy"
    />
  </button>
  {/* Icono de la contraseña */}
  <img
    className="icon"
    src={passwordIcon}
    alt="Icono de contraseña"
    width={26}
    height={26}
    loading="lazy"
    aria-hidden="true"
    style={{ marginRight: 5 }}
  />
  <input
    className="input_login"
    id="login-password"
    name="password"
    placeholder="Contraseña"
    type={passwordVisible ? "text" : "password"}
    value={password}
    required
    autoComplete="current-password"
    minLength={6}
    maxLength={64}
    onChange={(e) => setPassword(e.target.value)}
    aria-required="true"
    aria-label="Contraseña"
    style={{ paddingLeft: "30px" }} 
  />
</span>
            <span className="span">
              <button
                className="btn-iniciar"
                type="submit"
                disabled={loading}
                aria-disabled={loading}
                aria-busy={loading}
              >
                {loading ? "Entrando..." : "Iniciar Sesión"}
              </button>
            </span>
            <span className="span">
              <Link to="/RecuperarContraseña" tabIndex={0}>
                ¿Has olvidado tu contraseña?
              </Link>
            </span>
          </div>
        </div>
      </form>
    </main>
  );
});

export default Login;
