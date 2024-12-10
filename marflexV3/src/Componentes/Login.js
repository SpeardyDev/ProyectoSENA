import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import logo from '../img/LogoMarflex.png';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './styles/Login.css'; // Archivo CSS para estilos específicos de Login
import axios from 'axios';




function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const IniciarLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        username,
        password,
      });
      const { token, rol } = response.data; localStorage.setItem('token', token);
      if (rol==='administrador') {
      alert("Login exitoso");
      navigate("/HomeAdmin");
      }else if (rol==='Jefe de Bodega') {
        alert("Login exitoso jefe de bodega");
      navigate("/HomeJefeBodega");
      }
    } catch (error) {
      console.error("Error en el login:", error);
      alert("Usuario o contraseña incorrectos");
    }
  };

  const PasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="contenedor">
      <form className="mi-app-formulario" onSubmit={IniciarLogin} method="post">
        <div className="img-presentacion">
          <img
            className='img_presentacion_login'
            src="img/persona-que-relaja-casa.png"
            alt="imagen de presentación"
          />
        </div>
        <div className="formulario">
          <div className="titulo-login">
            <img className="img-logo" src={logo} alt="Logo de la empresa" />
            <h1 className="h1-login">LOGIN</h1>
          </div>
          <div className="content-input">
            <span className="span">
              <FontAwesomeIcon className='icon' icon={faUsers} size="xl" style={{ color: "#646973" }}/>
              <input
              className='input_login'
                placeholder="Nombre de usuario"
                type="email"
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </span>

            <span className="span password-container">
              <img
                className="icon"
                src="/img/password.png"
                alt="icono de password"
              />
              <input
                className="input_login"
                placeholder="Contraseña"
                type={passwordVisible ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
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
                onClick={PasswordVisibility}
              />
            </span>

            <span className="span">
              <button className="btn-iniciar" type="submit">
                Iniciar Sesión
              </button>
            </span>
            <span className="span">
              <a href="0">¿Has olvidado tu contraseña?</a>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
