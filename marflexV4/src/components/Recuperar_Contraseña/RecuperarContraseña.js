import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../styles/Login.css";
import "../styles/Recuperar_contraseña.css";

// Centraliza la URL del backend
const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

function RecuperarContraseña() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEnviarCodigo = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${backendUrl}/recuperar-password`, {
        username,
      });
      localStorage.setItem("username", username);
      alert("Código enviado. Verifica tu correo.");
      navigate("/VerificarCodigo");
    } catch (error) {
      alert("Error al enviar código. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contenedor">
      <form className="mi-app-formulario" onSubmit={handleEnviarCodigo}>
        <div className="img-presentacion-recuperarContraseña">
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="icon-regresar"
            onClick={() => navigate("/login")}
            style={{
              cursor: "pointer",
              marginRight: "10px",
              height: "25px",
              position: "absolute",
              left: "0px",
              top: "13px",
              color: "#5a5a59",
            }}
          />
          <img
            className="img_presentacion_login"
            src="/img/persona-que-relaja-casa.png"
            alt="imagen de presentación"
          />
        </div>

        <div className="formulario">
          <div className="titulo-login">
            <h1 className="h1-Rcontraseña">Recuperar Contraseña</h1>
          </div>

          <div className="content-input">
            <span className="span-R">
              <FontAwesomeIcon
                className="icon"
                icon={faUsers}
                size="sm"
                style={{ color: "#646973" }}
              />
              <input
                className="input_login"
                placeholder="Correo o Username"
                type="email"
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </span>

            <span className="span">
              <button className="btn-iniciar" type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Enviar Código"}
              </button>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RecuperarContraseña;