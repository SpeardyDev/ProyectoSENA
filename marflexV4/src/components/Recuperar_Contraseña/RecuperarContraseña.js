import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import personaImg from "../../img/persona-que-relaja-casa.png";
import "../styles/Login.css";
import "../styles/Recuperar_contraseña.css";

// Usa el puerto correcto de tu backend
const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://marflex.duckdns.org:3001";

function RecuperarContraseña() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [counter, setCounter] = useState(0); // segundos restantes para reenviar
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  // SEO y accesibilidad mejorados
  const pageTitle = "Recuperar Contraseña | Marflex";
  const pageDescription =
    "Recupera el acceso a tu cuenta Marflex fácilmente. Ingresa tu correo para recibir el código de recuperación.";

  // Función para iniciar contador de espera antes de reenviar
  const startCounter = useCallback(() => {
    setCounter(60);
    intervalRef.current = setInterval(() => {
      setCounter(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Validar email simple
  const validateEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Maneja envío de código
  const handleEnviarCodigo = useCallback(
    async (e) => {
      e.preventDefault();
      setMessage({ type: "", text: "" });

      if (!username.trim() || !validateEmail(username.trim())) {
        setMessage({ type: "error", text: "Introduce un correo electrónico válido." });
        return;
      }
      setLoading(true);
      try {
        const { data } = await axios.post(`${backendUrl}/recuperar-password`, { username: username.trim() });
        localStorage.setItem("username", username.trim());
        setMessage({ type: "success", text: data.message || "Código enviado. Verifica tu correo o revisa tu spam." });
        startCounter();
        setTimeout(() => navigate("/VerificarCodigo"), 1800);
      } catch (error) {
        if (error.response) {
          if (error.response.data?.errors) {
            // Mensaje de validación de backend
            const msg = error.response.data.errors.map(err => err.msg).join(" ");
            setMessage({ type: "error", text: msg });
          } else if (error.response.data?.message) {
            setMessage({ type: "error", text: error.response.data.message });
          } else {
            setMessage({ type: "error", text: "Error desconocido. Intenta de nuevo." });
          }
        } else {
          setMessage({ type: "error", text: "No se pudo conectar con el servidor." });
        }
      } finally {
        setLoading(false);
      }
    },
    [username, navigate, startCounter]
  );

  // Limpiar intervalos al desmontar
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <main className="contenedor" role="main" aria-label="Recuperar contraseña">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href="https://www.marflex.com/recuperar-contraseña" />
      </Helmet>
      <form
        className="mi-app-formulario"
        onSubmit={handleEnviarCodigo}
        autoComplete="off"
        aria-label="Formulario para recuperar contraseña"
        noValidate
      >
        <div className="img-presentacion-recuperarContraseña">
          <button
            type="button"
            className="icon-regresar"
            aria-label="Regresar al inicio de sesión"
            onClick={() => navigate("/login")}
            tabIndex={0}
            style={{
              cursor: "pointer",
              marginRight: "10px",
              height: "25px",
              position: "absolute",
              left: "0px",
              top: "13px",
              color: "#5a5a59",
              background: "none",
              border: "none",
              padding: 0,
              fontSize: "25px",
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <img
            className="img_presentacion_login"
            src={personaImg}
            alt="Recuperación de contraseña"
            loading="lazy"
            width={220}
            height={220}
            decoding="async"
            fetchpriority="low"
          />
        </div>
        <div className="formulario">
          <div className="titulo-login">
            <h1 className="h1-Rcontraseña">Recuperar Contraseña</h1>
          </div>
          <div className="content-input">
            <label htmlFor="recuperar-email" className="sr-only">
              Correo electrónico
            </label>
            <span className="span-R">
              <FontAwesomeIcon
                className="icon"
                icon={faUsers}
                size="lg"
                style={{ color: "#646973" }}
                aria-hidden="true"
              />
              <input
                id="recuperar-email"
                className="input_login"
                placeholder="Correo electrónico"
                type="email"
                value={username}
                required
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                minLength={5}
                aria-required="true"
                aria-label="Correo electrónico"
                maxLength={80}
                spellCheck="false"
                inputMode="email"
              />
            </span>
            {message.text && (
              <div
                className={`msg-feedback ${message.type}`}
                role={message.type === "error" ? "alert" : "status"}
                aria-live={message.type === "error" ? "assertive" : "polite"}
                style={{
                  color: message.type === "error" ? "#c00" : "#2e7d32",
                  fontSize: "0.98em",
                  margin: "6px 0 2px 0",
                  minHeight: "18px",
                  textAlign: "center",
                  fontWeight: 500,
                  letterSpacing: "0.03em"
                }}
              >
                {message.text}
              </div>
            )}
            <span className="span" style={{ marginBottom: "0.5rem" }}>
              <button
                className="btn-iniciar"
                type="submit"
                disabled={loading || counter > 0}
                aria-disabled={loading || counter > 0}
                aria-busy={loading}
              >
                {loading
                  ? "Enviando..."
                  : counter > 0
                  ? `Reenviar código en ${counter}s`
                  : "Enviar Código"}
              </button>
            </span>
            <span className="span" style={{ fontSize: "0.9em", color: "#595959" }}>
              ¿No llega el correo? Revisa tu bandeja de spam.
            </span>
          </div>
        </div>
      </form>
    </main>
  );
}

export default RecuperarContraseña;