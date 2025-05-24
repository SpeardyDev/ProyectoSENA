import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../../img/LogoMarflex.png";
import { InputOtp } from "primereact/inputotp";
import "../styles/Login.css";
import "./VerificarCodigo.css";
import { Helmet } from "react-helmet-async";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

function VerificarCodigo() {
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [counter, setCounter] = useState(0);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  // SEO
  const pageTitle = step === 1 ? "Verificar Código | Marflex" : "Restablecer Contraseña | Marflex";
  const pageDescription = step === 1
    ? "Verifica tu identidad ingresando el código enviado a tu correo."
    : "Cambia tu contraseña de manera segura.";

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      navigate("/RecuperarContraseña");
    }
  }, [navigate]);

  // Inicia o reinicia contador de reenvío de código
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

  // Limpia el intervalo al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Validación de contraseña fuerte
  const isStrongPassword = (pwd) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(pwd);

  // Maneja la verificación del código OTP
  const handleVerificarCodigo = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      await axios.post(`${backendUrl}/verificar-otp`, { username, otp });
      toast.success("Código verificado con éxito ✅", {
        position: "top-right",
        autoClose: 1600,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setStep(2);
      setOtp("");
      setMessage({ type: "", text: "" });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "⚠️ Código incorrecto o expirado. Inténtalo de nuevo.",
        {
          position: "top-right",
          autoClose: 3400,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
      // No actualices message, porque ahora el feedback es con toast
    } finally {
      setLoading(false);
    }
  };

  // Maneja el restablecimiento de contraseña
  const handleRestablecerContraseña = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    if (!isStrongPassword(password)) {
      setMessage({
        type: "error",
        text: "La contraseña debe tener al menos 8 caracteres, incluir letras y números."
      });
      setLoading(false);
      return;
    }
    try {
      await axios.post(`${backendUrl}/reset-password`, {
        username,
        password,
      });
      toast.success("¡Contraseña cambiada con éxito!", {
        position: "top-right",
        autoClose: 1600,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      localStorage.removeItem("username");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "⚠️ Error al cambiar la contraseña. Inténtalo de nuevo.",
        {
          position: "top-right",
          autoClose: 3400,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // Reenvía código OTP
  const handleReenviarCodigo = async () => {
    setMessage({ type: "", text: "" });
    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/recuperar-password`, { username });
      toast.success(data.message || "Código reenviado. Verifica tu correo.", {
        position: "top-right",
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      startCounter();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "No se pudo reenviar el código. Intenta más tarde.",
        {
          position: "top-right",
          autoClose: 3400,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // Personaliza los inputs del OTP
  const customInput = ({ events, props }) => (
    <input
      {...events}
      {...props}
      type="text"
      className="verificar-otp-custom-input"
      inputMode="numeric"
      pattern="[0-9]*"
      autoFocus={props.id === 0}
      aria-label={`Dígito ${props.id + 1} del código`}
      maxLength={1}
      style={{ fontSize: "1.18em", textAlign: "center", width: 32, height: 38 }}
    />
  );

  return (
    <div className="verificar-codigo-contenedor">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={step === 1 ? "https://www.marflex.com/verificar-codigo" : "https://www.marflex.com/restablecer-contraseña"} />
      </Helmet>
      <ToastContainer />
      <form className="verificar-codigo-formulario" autoComplete="off" aria-label="Formulario de verificación" noValidate>
        <div className="verificar-codigo-formulario-inner">
          <div className="verificar-codigo-titulo-login">
            <img
              className="verificar-codigo-img-logo"
              src={Logo}
              alt="Logo de marflex"
              loading="lazy"
            />
            <h1 className="verificar-codigo-h1">
              {step === 1 ? "Verificar Código" : "Restablecer Contraseña"}
            </h1>
          </div>
          {step === 1 && (
            <>
              <p className="verificar-codigo-info-text">
                Introduce el código enviado a <strong>{username}</strong>
              </p>
              <div className="verificar-codigo-contenedor-input-otp">
                <InputOtp
                  value={otp}
                  onChange={(e) => setOtp(e.value)}
                  length={6}
                  inputTemplate={customInput}
                  style={{ gap: 4 }}
                  autoFocus
                  aria-label="Código de verificación"
                  disabled={loading}
                />
              </div>
              <div className="verificar-codigo-contenedor-btns" style={{ flexDirection: "column", alignItems: "center" }}>
                <button
                  className="verificar-codigo-btn-verificar"
                  type="button"
                  onClick={handleVerificarCodigo}
                  disabled={loading || otp.length !== 6}
                  aria-disabled={loading || otp.length !== 6}
                  aria-busy={loading}
                >
                  {loading ? "Verificando..." : "Verificar Código"}
                </button>
                <button
                  className="verificar-codigo-btn-reenviar"
                  type="button"
                  onClick={handleReenviarCodigo}
                  disabled={loading || counter > 0}
                  aria-disabled={loading || counter > 0}
                  style={{
                    marginTop: "0.7em",
                    background: "#e5e5e5",
                    color: "#444",
                    fontWeight: 500,
                    borderRadius: 5,
                    padding: "0.4em 1.2em",
                    cursor: loading || counter > 0 ? "not-allowed" : "pointer"
                  }}
                >
                  {counter > 0 ? `Reenviar código en ${counter}s` : "Reenviar Código"}
                </button>
              </div>
              <div className="verificar-codigo-info-secundaria">
                ¿No encuentras el correo? Revisa tu carpeta de spam.
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <p className="verificar-codigo-info-text">Introduce tu nueva contraseña:</p>
              <input
                className="verificar-codigo-input-password"
                type="password"
                placeholder="Nueva Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                maxLength={64}
                required
                aria-required="true"
                aria-label="Nueva contraseña"
                autoFocus
              />
              {message.text && (
                <div
                  className={`verificar-codigo-msg-feedback ${message.type}`}
                  role={message.type === "error" ? "alert" : "status"}
                  aria-live={message.type === "error" ? "assertive" : "polite"}
                  style={{
                    color: "#c00",
                    fontSize: "0.97em",
                    margin: "6px 0 2px 0",
                    minHeight: "18px",
                    textAlign: "center",
                  }}
                >
                  {message.text}
                </div>
              )}
              <button
                className="verificar-codigo-btn-iniciar"
                type="button"
                onClick={handleRestablecerContraseña}
                disabled={loading || password.length < 8}
                aria-disabled={loading || password.length < 8}
                aria-busy={loading}
                style={{ marginTop: "1em" }}
              >
                {loading ? "Cambiando..." : "Cambiar Contraseña"}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default VerificarCodigo;