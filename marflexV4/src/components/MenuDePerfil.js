import { useState, useContext } from "react";
import { FiInfo, FiLogOut, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import defaultAvatar from "../backend/uploads/foto-perfil.jpg"; 
import "./styles/menuPerfil.css";

const MenuDePerfil = ({ avatar }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState("");

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? "" : dropdown);
  };

  // Función para cerrar sesión
  const CerrarSesion = async () => {
    alert("Saliendo de la sesión");
    try {
      // Limpiar almacenamiento local
      localStorage.clear();
      logout();
      navigate("/login"); // Evita volver atrás

    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="user-menu">
      <button onClick={toggleMenu} className="user-button">
        <img
          src={avatar || defaultAvatar}
          alt="Foto de perfil"
          className="user-avatar"
        />
        <span className="sr-only">Open user menu</span>
      </button>

      {isOpen && (
        <div className="menu-perfil">
          <div className="menu-item" onClick={() => toggleDropdown("profile")}>
            <FiInfo className="menu-icon" />
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

          <div className="menu-item" onClick={CerrarSesion}>
            <FiLogOut className="menu-icon" />
            Cerrar sesión
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuDePerfil;
