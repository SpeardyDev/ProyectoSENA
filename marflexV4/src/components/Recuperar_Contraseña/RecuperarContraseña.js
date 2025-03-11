import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import logo from '../../img/LogoMarflex.png';
import '../styles/Login.css';

function RecuperarContraseña() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEnviarCodigo = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:3000/recuperar-password", { username });
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
        <div className="img-presentacion">
          <img
            className='img_presentacion_login'
            src="/img/persona-que-relaja-casa.png"
            alt="imagen de presentación"
          />
        </div>

        <div className="formulario">
          <div className="titulo-login">
            <img className="img-logo" src={logo} alt="Logo de la empresa" />
            <h1 className="h1-login">Recuperar Contraseña</h1>
          </div>

          <div className="content-input">
            <span className="span">
              <FontAwesomeIcon className='icon' icon={faUsers} size="xl" style={{ color: "#646973" }} />
              <input
                className='input_login'
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
