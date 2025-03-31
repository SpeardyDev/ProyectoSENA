import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from "sweetalert2"; 
import candado from '../../img/candado.png';
import { InputOtp} from 'primereact/inputotp';
import '../styles/Login.css';
import './VerificarCodigo.css'

function VerificarCodigo() {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      navigate('/RecuperarContraseña');
    }
  }, [navigate]);

  const handleVerificarCodigo = async () => {
    try {
      await axios.post('http://localhost:3000/verificar-otp', { username, otp });
      Swal.fire({
        title: "Codigo veficado con exito ✅",
        icon: "success",
        draggable: true
      });
      // alert('✅ Código correcto. Ahora cambia tu contraseña.');
      setStep(2);
    } catch (error) {
      Swal.fire({
        title: "⚠️ Código incorrecto o expirado. Inténtalo de nuevo.",
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
      });
      // alert('⚠️ Código incorrecto o expirado. Inténtalo de nuevo.');
    }
  };

  const handleRestablecerContraseña = async () => {
    try {
      await axios.post('http://localhost:3000/reset-password', { username, password });
      alert('✅ Contraseña cambiada con éxito.');
      localStorage.removeItem('username');
      navigate('/login');
    } catch (error) {
      alert('⚠️ Error al cambiar la contraseña. Inténtalo de nuevo.');
    }
  };

  const customInput = ({ events, props }) => {
    return (
      <>
        <input {...events} {...props} type="text" className="custom-otp-input-sample" />
        {props.id === 2 && (
          <div className="px-3">
            <i className="pi pi-minus" />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="contenedor">
      <form className="mi-app-formulario">
        <div className="img-presentacion">
          <img
            className="img_presentacion_login"
            src="/img/persona-que-relaja-casa.png"
            alt="imagen de presentación"
          />
        </div> 

        <div className="formulario">
          <div className="titulo-login">
         <img className="img-logo-candado" src={candado} alt="Logo de la empresa" /> 
            <h1 className="h1-login-verficar">
              {step === 1 ? 'Verificar Código' : 'Restablecer Contraseña'}
            </h1>
          </div>

          {step === 1 && (
            <>
               <p className="info-text">
                Introduce el código enviado a <strong>{username}</strong>
              </p>
              <div className="contenedor-input-verficar-contraseña">
              <InputOtp
                value={otp}
                onChange={(e) => setOtp(e.value)}
                length={6}
                inputTemplate={customInput}
                style={{ gap: 4 }}
              />
              </div>
              <div className='contenedor-Btns'>
              <button className="btn-verificar" type="button" onClick={handleVerificarCodigo}> Verificar Código </button> 
              </div>
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
