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

  const CerrarSesion = async () => {
    alert("Saliendo de la sesión");
    try {
      localStorage.clear();
      logout();
      navigate("/login");
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
        <div className="menu-dropdown">
          <button
            className="menu-item"
            onClick={() => toggleDropdown("profile")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") toggleDropdown("profile");
            }}
            style={{ all: "unset", cursor: "pointer" }}
          >
            <FiInfo className="menu-icon" />
            Configuración de Perfil
            {activeDropdown === "profile" ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {activeDropdown === "profile" && (
            <div className="dropdown-content">
              <p>Configuración de perfil contenido</p>
            </div>
          )}

          <button
            className="menu-item"
            onClick={() => toggleDropdown("account")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleDropdown("account");
              }
            }}
            style={{ all: "unset", cursor: "pointer" }}
          >
            <FiInfo className="menu-icon" />
            Información de Cuenta
            {activeDropdown === "account" ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {activeDropdown === "account" && (
            <div className="dropdown-content">
              <p>Los detalles de la cuenta</p>
            </div>
          )}

          <button
            className="menu-item"
            onClick={CerrarSesion}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                CerrarSesion();
              }
            }}
            style={{ all: "unset", cursor: "pointer" }}
          >
            <FiLogOut className="menu-icon" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuDePerfil;
