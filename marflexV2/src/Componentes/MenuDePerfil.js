import { useState } from 'react';
import { FiUser, FiInfo, FiBell, FiLogOut, FiChevronDown, FiChevronUp } from "react-icons/fi";
import './styles/MenuPerfil.css'; 
import { useNavigate } from 'react-router-dom';

const MenuDePerfil = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState("");

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? "" : dropdown);
  };
  const CerarSesion = async () => {
    alert('seguro');
    try {
      const response = await fetch('http://localhost:3000/api/cerrarsesion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Response:', response);
  
      // Verificar si response.json es una función
      if (typeof response.json !== 'function') {
        throw new Error('La respuesta no es un objeto JSON válido');
      }
  
      const result = await response.json();
      console.log('Result:', result);
  
      if (response.ok) {
        console.log(result.message);
        navigate('/Login');
      } else {
        console.error('Error al cerrar sesión:', result.message);
      }
    } catch (error) {
      console.error('Error en el servidor:', error);
    }
  };


  return (
    <div className="user-menu">
      <button onClick={toggleMenu} className="user-button">
        <FiUser className="user-icon" />
        <span className="sr-only">Open user menu</span>
      </button>

      {isOpen && (
        <div className="menu-perfil">
          <div className="menu-item" onClick={() => toggleDropdown("profile")}>
            <FiUser className="menu-icon" />
            Configuración de Perfil
            {activeDropdown === "profile" ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {activeDropdown === "profile" && (
            <div className="dropdown-content">
              <p>Configuración de perfil contenido</p>
            </div>
          )}

          <div className="menu-item" onClick={() => toggleDropdown("account")}>
            <FiInfo className="menu-icon" />
            Información de Cuenta
            {activeDropdown === "account" ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {activeDropdown === "account" && (
            <div className="dropdown-content">
              <p>Los detalles de la cuenta</p>
            </div>
          )}

          <div className="menu-item" onClick={() => toggleDropdown("notifications")}>
            <FiBell className="menu-icon" />
            Notificaciones
            {activeDropdown === "notifications" ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {activeDropdown === "notifications" && (
            <div className="dropdown-content">
              <p>Configuración de notificación</p>
            </div>
          )}

          <div className="menu-item" onClick={CerarSesion}>
            <FiLogOut className="menu-icon" />
            Cerrar sesión
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuDePerfil;
