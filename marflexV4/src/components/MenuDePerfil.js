import { useState } from "react";
import {FiInfo, FiLogOut, FiChevronDown, FiChevronUp} from "react-icons/fi";
import "./styles/menuPerfil.css";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../backend/uploads/foto-perfil.jpg"; 

const MenuDePerfil = ({ avatar }) => {
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
      const response = await fetch("http://localhost:3000/cerrarsesion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (typeof response.json !== "function") {
        throw new Error("La respuesta no es un objeto JSON válido");
      }

      const result = await response.json();

      if (response.ok) {
        console.log(result.message);
        navigate("/Login");
      } else {
        console.error("Error al cerrar sesión:", result.message);
      }
    } catch (error) {
      console.error("Error en el servidor:", error);
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
