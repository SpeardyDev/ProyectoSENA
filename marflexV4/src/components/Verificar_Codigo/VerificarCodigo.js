import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from '../../img/LogoMarflex.png';
import '../styles/Login.css';

function VerificarCodigo() {
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      navigate("/RecuperarContraseña");
    }
  }, [navigate]);

  const handleVerificarCodigo = async () => {
    try {
      await axios.post("http://localhost:3000/verificar-otp", { username, otp });
      alert("✅ Código correcto. Ahora cambia tu contraseña.");
      setStep(2);
    } catch (error) {
      alert("⚠️ Código incorrecto o expirado. Inténtalo de nuevo.");
    }
  };

  const handleRestablecerContraseña = async () => {
    try {
      await axios.post("http://localhost:3000/reset-password", { username, password });
      alert("✅ Contraseña cambiada con éxito.");
      localStorage.removeItem("username");
      navigate("/login");
    } catch (error) {
      alert("⚠️ Error al cambiar la contraseña. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="contenedor">
      <form className="mi-app-formulario">
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
            <h1 className="h1-login">{step === 1 ? "Verificar Código" : "Restablecer Contraseña"}</h1>
          </div>

          {step === 1 && (
            <>
              <p className="info-text">
                Introduce el código enviado a <strong>{username}</strong>:
              </p>
              <input
                className="input_login"
                type="text"
                placeholder="Código de 6 dígitos"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button className="btn-iniciar" type="button" onClick={handleVerificarCodigo}>
                Verificar Código
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="info-text">Introduce tu nueva contraseña:</p>
              <input
                className="input_login"
                type="password"
                placeholder="Nueva Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button className="btn-iniciar" type="button" onClick={handleRestablecerContraseña}>
                Cambiar Contraseña
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default VerificarCodigo;
