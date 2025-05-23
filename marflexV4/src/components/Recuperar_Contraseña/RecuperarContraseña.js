import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import personaImg from "../../img/persona-que-relaja-casa.png";
import "../styles/Login.css";
import "../styles/Recuperar_contraseña.css";

const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

function RecuperarContraseña() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleEnviarCodigo = useCallback(async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!username.trim() || username.length < 3) {
      setMessage({ type: "error", text: "Introduce un correo o usuario válido." });
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${backendUrl}/recuperar-password`, { username: username.trim() });
      localStorage.setItem("username", username.trim());
      setMessage({ type: "success", text: "Código enviado. Verifica tu correo o revisa tu spam." });
      setTimeout(() => navigate("/VerificarCodigo"), 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.response?.data?.msg || "Error al enviar el código. Intenta de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  }, [username, navigate]);

  return (
    <main className="contenedor" role="main" aria-label="Recuperar contraseña">
      <Helmet>
        <title>Recuperar Contraseña | Marflex</title>
        <meta name="description" content="Recupera el acceso a tu cuenta Marflex fácilmente. Ingresa tu correo o usuario para recibir el código de recuperación." />
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
              fontSize:"25px"
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <img
            className="img_presentacion_login"
            src={personaImg}
            alt="Persona relajada en casa"
            loading="lazy"
            width={220}
            height={220}
            decoding="async"
            fetchpriority="low"
          />
        </div>
        <div className="formulario">
          <div className="titulo-login">
            <h1 className="h1-Rcontraseña" tabIndex={0}>Recuperar Contraseña</h1>
          </div>
          <div className="content-input">
            <label htmlFor="recuperar-email" className="sr-only">
              Correo o usuario
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
                placeholder="Correo o usuario"
                type="text"
                value={username}
                required
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                minLength={3}
                aria-required="true"
                aria-label="Correo o usuario"
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
                  fontSize: "0.97em",
                  margin: "6px 0 2px 0",
                  minHeight: "18px",
                  textAlign: "center",
                }}
              >
                {message.text}
              </div>
            )}
            <span className="span">
              <button
                className="btn-iniciar"
                type="submit"
                disabled={loading}
                aria-disabled={loading}
                aria-busy={loading}
              >
                {loading ? "Enviando..." : "Enviar Código"}
              </button>
            </span>
          </div>
        </div>
      </form>
    </main>
  );
}

export default RecuperarContraseña;