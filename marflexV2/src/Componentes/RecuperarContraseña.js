import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import logo from '../img/LogoMarflex.png';
import './styles/Login.css';
import axios from 'axios';

function RecuperarContraseña() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/send', { email });
      alert('Se ha enviado un código a su correo electrónico');
      setStep(2);
    } catch (error) {
      console.error('Error al enviar el código:', error);
      alert('No se pudo enviar el código. Verifique su correo.');
    }
  };
  
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/verify', { email, code: verificationCode });
      if (response.data.success) {
        alert('Código verificado correctamente');
        setStep(3);
      } else {
        alert('El código ingresado es incorrecto');
      }
    } catch (error) {
      console.error('Error al verificar el código:', error);
    }
  };
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
  
    try {
      await axios.post('http://localhost:3000/api/reset-password', { email, newPassword });
      alert('Contraseña actualizada con éxito');
      setStep(1);
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      alert('No se pudo actualizar la contraseña');
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
        <div className="formulario" style={{ width: '242px'}}>
          <div className="titulo-login">
            <img className="img-logo" src={logo} alt="Logo de la empresa" />
            <h1 className="h1-login">LOGIN</h1>
          </div>
          <div className="content-input">
            {step === 1 && (
              <>
                <span className="span">
                  <FontAwesomeIcon className='icon' icon={faEnvelope} size="xl" style={{ color: "#646973" }} />
                  <input
                    className="input_login"
                    placeholder="Correo electrónico"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </span>
                <span className="span">
                  <button className="btn-iniciar" type="submit" onClick={handleSendCode}>
                    Enviar Código
                  </button>
                </span>
              </>
            )}

            {step === 2 && (
              <>
                <span className="span">
                  <FontAwesomeIcon className='icon' icon={faKey} size="xl" style={{ color: "#646973" }} />
                  <input
                    className="input_login"
                    placeholder="Código de verificación"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                  />
                </span>
                <span className="span">
                  <button className="btn-iniciar" type="submit" onClick={handleVerifyCode}>
                    Verificar Código
                  </button>
                </span>
              </>
            )}

            {step === 3 && (
              <>
                <span className="span">
                  <input
                    className="input_login"
                    placeholder="Nueva Contraseña"
                    type={passwordVisible ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <img
                    className="visibility_off"
                    src={
                      passwordVisible
                        ? "/img/visibility.png"
                        : "/img/visibility_off.png"
                    }
                    alt="icono del ojo"
                    onClick={togglePasswordVisibility}
                  />
                </span>
                <span className="span">
                  <input
                    className="input_login"
                    placeholder="Confirmar Nueva Contraseña"
                    type={passwordVisible ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </span>
                <span className="span">
                  <button className="btn-iniciar" type="submit" onClick={handleResetPassword}>
                    Cambiar Contraseña
                  </button>
                </span>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default RecuperarContraseña;