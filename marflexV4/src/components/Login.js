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
  const [formErrors, setFormErrors] = useState({});
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

  // Muestra los errores enviados por el backend
 // Muestra los errores enviados por el backend, incluyendo rate limit y mensajes personalizados
const showBackendErrors = (error) => {
  if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    // Si el backend manda un array de errores de validación, los mostramos todos como toast
    error.response.data.errors.forEach((err) => {
      toast.error(err.msg || "Error en los datos ingresados");
    });
  } else if (error?.response?.data?.message) {
    // Si el mensaje es de rate limiting, lo mostramos personalizado
    if (
      typeof error.response.data.message === "string" &&
      error.response.data.message.toLowerCase().includes("demasiados intentos")
    ) {
      toast.error(
        "Has excedido el número máximo de intentos. Por favor, espera unos minutos antes de volver a intentarlo."
      );
    } else {
      toast.error(error.response.data.message);
    }
  } else if (error?.message === "Network Error") {
    toast.error("No se pudo conectar con el servidor. Inténtalo más tarde.");
  } else if (error?.code === "ECONNABORTED") {
    toast.error("La solicitud ha tardado demasiado. Intenta de nuevo.");
  } else {
    toast.error("Ocurrió un error inesperado. Inténtalo más tarde.");
  }
};

  const validateFields = () => {
    const errors = {};
    if (!validateEmail(username.trim())) {
      errors.username = "Por favor, introduce un email válido.";
    }
    if (password.length < 8) {
      errors.password = "La contraseña debe tener al menos 8 caracteres.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const IniciarLogin = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateFields()) {
        Object.values(formErrors).forEach((msg) => toast.error(msg));
        return;
      }

      setLoading(true);
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://marflex.duckdns.org:3001";
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
        }, 1700);
      } catch (error) {
        showBackendErrors(error);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line
    [username, password, login, navigate, formErrors]
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
            <h1 className="h1-login">
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
                type="email"
                inputMode="email"
                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                value={username}
                required
                autoComplete="username"
                onChange={(e) => setUsername(e.target.value)}
                aria-required="true"
                aria-label="Correo electrónico"
                maxLength={80}
                style={formErrors.username ? { borderColor: "red" } : {}}
              />
            </span>
            <span className="span password-container">
              <label htmlFor="login-password" className="sr-only">
                Contraseña
              </label>
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
                minLength={8}
                maxLength={64}
                onChange={(e) => setPassword(e.target.value)}
                aria-required="true"
                aria-label="Contraseña"
                style={{
                  paddingLeft: "30px",
                  borderColor: formErrors.password ? "red" : undefined,
                }}
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