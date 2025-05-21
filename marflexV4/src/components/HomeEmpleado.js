import React, { useState, useEffect } from "react";
import logo from "../img/LogoMarflex.png";
import icono from "../img/forklift_30dp_DA954B_FILL0_wght400_GRAD0_opsz24.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./styles/HomeAdmin.css";
import Colchones from "./Gestion_Colchones/Colchones.js";
import Detalle from "./Gestion_Detalles/Detalle.js";
import MenuDePerfil from "./MenuDePerfil.js";
import Solicitud from "./Gestion_Solicitudes/solicitudesEmp.js";
import Reportes from "./Gestion_de_Reportes/Reportes.js";
import { Button } from "semantic-ui-react";

// Centraliza la URL del backend
const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

const HomeEmpleado = () => {
  const [visibleComponents, setVisibleComponents] = useState({
    dashboard: true,
    colchones: false,
    detalle: false,
    solicitud: false,
    reportes: false,
  });

  const handleButtonClick = (componentName) => {
    setVisibleComponents((prevState) => ({
      ...prevState,
      dashboard: componentName === "dashboard",
      colchones: componentName === "colchones",
      detalle: componentName === "detalle",
      solicitud: componentName === "solicitud",
      reportes: componentName === "reportes",
    }));
  };

  const [BtnMenu, setBtnMenu] = useState(false);
  const defaultAvatar = require("../backend/uploads/foto-perfil.jpg");
  const [avatar, setAvatar] = useState(defaultAvatar);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("fotoPerfil", file);

      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${backendUrl}/usuarios/foto`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await res.json();

        if (data.fotoPerfil) {
          setAvatar(`${backendUrl}/uploads/${data.fotoPerfil}`);
        } else {
          console.error("No se recibió fotoPerfil:", data);
        }
      } catch (error) {
        console.error("Error subiendo la foto:", error);
      }
    }
  };

  // Trae el nombre de usuario 
  const [nombre, setNombre] = useState(""); 

  useEffect(() => {
    const storedNombre = localStorage.getItem("nombre");
    if (storedNombre) {
      setNombre(storedNombre);
    }
  }, []);

  useEffect(() => {
    const storedFoto = localStorage.getItem("fotoPerfil");

    if (storedFoto) {
      setAvatar(`${backendUrl}/uploads/${storedFoto}`);
    } else {
      setAvatar(require("../backend/uploads/foto-perfil.jpg"));
    }
    // eslint-disable-next-line
  }, []);

  const eliminarFoto = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${backendUrl}/eliminar/usuarios/foto`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        localStorage.setItem("fotoPerfil", "foto-perfil.jpg");
        setAvatar(require("../backend/uploads/foto-perfil.jpg"));
        alert("Foto de perfil eliminada");
      } else {
        alert("No se pudo eliminar la foto");
      }
    } catch (error) {
      console.error("Error al eliminar foto:", error);
      alert("Error al eliminar la foto");
    }
  };

  return (
    <div className="App">
      <div className="App-body">
        <header className="App-header">
          <nav className="barra-navegacion">
            <div className="logo">
              <img src={icono} alt="Logo de marflex" />
              <h1 className="h1-nav">Inventario</h1>
            </div>
            <div className="lista">
              <img src={logo} alt="Logo de marflex" />
              <h1 className="h1-nav">Marflex</h1>
            </div>
            <div>
              <MenuDePerfil />
            </div>
          </nav>
        </header>
        <section className="mayor">
          <FontAwesomeIcon
            onClick={() => setBtnMenu(!BtnMenu)}
            className="menu-amburguesa"
            icon={faBars}
          />
          <section
            className="menu"
            style={{ display: BtnMenu ? "none" : "block" }}
          >
            <div className="contenido-usuario">
              <FontAwesomeIcon
                onClick={() => setBtnMenu(!BtnMenu)}
                className="Btn_ocultar"
                icon={faXmark}
              />

              <div className="profile-container">
                <img
                  id="profile-pic"
                  src={avatar || require("../backend/uploads/foto-perfil.jpg")}
                  alt="Foto de perfil"
                  className="profile-pic"
                />
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <button
                  onClick={() => document.getElementById("fileInput").click()}
                  className="btn-upload"
                >
                  <i className="fa-solid fa-camera"></i>
                </button>
              </div>

              {avatar !== defaultAvatar && (
                <Button
                  icon
                  color="red"
                  style={{ marginTop: "25px" }}
                  onClick={eliminarFoto}
                >
                  Eliminar Foto
                </Button>
              )}
              <p id="Nombre">{nombre}</p>
            </div>
            <div className="contenido-menu">
              <div className="texto-menu">
                <h6>NAVEGACIÓN PRINCIPAL</h6>
              </div>
            </div>
            <div className="sidebar">
              <ul>
                <li onClick={() => handleButtonClick("dashboard")}>
                  <i className="fa-solid fa-chart-line"></i>Dashboard
                </li>
                <MenuItem title="Gestión de Colchones" icon="fas fa-cubes">
                  <li
                    className="li-desplegable"
                    onClick={() => handleButtonClick("colchones")}
                  >
                    <a href className="item">
                      Colchones
                    </a>
                  </li>
                  <li
                    className="li-desplegable"
                    onClick={() => handleButtonClick("detalle")}
                  >
                    <a href className="item">
                      Detalle Colchones
                    </a>
                  </li>
                </MenuItem>
                <MenuItem
                  title="Gestión de Solicitudes"
                  icon="fa-solid fa-bullhorn"
                >
                  <li
                    className="li-desplegable"
                    onClick={() => handleButtonClick("solicitud")}
                  >
                    <a href className="item">
                      Mis Solicitudes
                    </a>
                  </li>
                </MenuItem>
                <li onClick={() => handleButtonClick("reportes")}>
                  <i className="fas fa-chart-bar"></i> Reportes
                </li>
              </ul>
            </div>
          </section>
          <section className="contenedor-universal">
            {visibleComponents.dashboard && (
              <article className="Dashboard">
                <div className="titulo">
                  <p>Dashboard</p>
                </div>
                <div className="card green">
                  <div className="contenedor-icono users">
                    <i id="icono" className="fa-solid fa-users"></i>
                  </div>
                  <div className="contenedor-span">
                    <span className="label">Clientes</span>
                    <span className="numero">16</span>
                  </div>
                </div>
                <div className="card orange">
                  <div className="contenedor-icono dolly">
                    <i id="icono" className="fa-solid fa-dolly"></i>
                  </div>
                  <div className="contenedor-span">
                    <span className="label">Proveedores</span>
                    <span className="numero">10</span>
                  </div>
                </div>
                <div className="card red">
                  <div className="contenedor-icono cajas">
                    <i id="icono" className="fas fa-cubes"></i>
                  </div>
                  <div className="contenedor-span">
                    <span className="label">Productos</span>
                    <span className="numero">185</span>
                  </div>
                </div>
                <div className="card purple">
                  <div className="contenedor-icono Factura">
                    <i
                      id="icono"
                      className="fa-solid fa-file-invoice-dollar"
                    ></i>
                  </div>
                  <div className="contenedor-span">
                    <span className="label">Facturas</span>
                    <span className="numero">$ 413</span>
                  </div>
                </div>
                <div className="card blue">
                  <div className="contenedor-icono Caja">
                    <i id="icono" className="fa-solid fa-cube"></i>
                  </div>
                  <div className="contenedor-span">
                    <span className="label">Existencia total</span>
                    <span className="numero">148</span>
                  </div>
                </div>
                <div className="card pink">
                  <div className="contenedor-icono Camion">
                    <i id="icono" className="fa-solid fa-truck-fast"></i>
                  </div>
                  <div className="contenedor-span">
                    <span className="label">Existencia vendida</span>
                    <span className="numero">33</span>
                  </div>
                </div>
                <div className="card teal">
                  <div className="contenedor-icono Bodega">
                    <i id="icono" className="fa-solid fa-warehouse"></i>
                  </div>
                  <div className="contenedor-span">
                    <span className="label">Existencia actual</span>
                    <span className="numero">115</span>
                  </div>
                </div>
                <div className="card brown">
                  <div className="contenedor-icono Cartera">
                    <i id="icono" className="fa-solid fa-wallet"></i>
                  </div>
                  <div className="contenedor-span">
                    <span className="label">Importe vendido</span>
                    <span className="numero">$ 413</span>
                  </div>
                </div>
                <div className="card blue-2">
                  <div className="contenedor-icono signo-dolar">
                    <i id="icono" className="fa-solid fa-dollar-sign"></i>
                  </div>
                  <div className="contenedor-span">
                    <span className="label">Importe pago</span>
                    <span className="numero">$ 413</span>
                  </div>
                </div>
                <div className="card pink-2">
                  <div className="contenedor-icono Mano">
                    <i
                      id="icono"
                      className="fa-solid fa-hand-holding-dollar"
                    ></i>
                  </div>
                  <div className="contenedor-span">
                    <span className="label">Importe restante</span>
                    <span className="numero">$ 0</span>
                  </div>
                </div>
                <div className="card teal-2">
                  <div className="contenedor-icono Billete">
                    <i id="icono" className="fa-solid fa-money-bill-1"></i>
                  </div>
                  <div className="contenedor-span">
                    <span className="label">Beneficio bruto</span>
                    <span className="numero">115</span>
                  </div>
                </div>
                <div className="card blue-cielo">
                  <div className="contenedor-icono Monedas">
                    <i id="icono" className="fa-solid fa-coins"></i>
                  </div>
                  <div className="contenedor-span">
                    <span className="label">Beneficio neto</span>
                    <span className="numero">$413</span>
                  </div>
                </div>
              </article>
            )}
            {visibleComponents.colchones && (
              <section className="cont-inventario">
                <Colchones />
              </section>
            )}
            {visibleComponents.detalle && (
              <section className="cont-pedidos">
                <Detalle />
              </section>
            )}
            {visibleComponents.solicitud && (
              <section className="cont-pedidos">
                <Solicitud />
              </section>
            )}
            {visibleComponents.reportes && (
              <section className="cont-pedidos">
                <Reportes />
              </section>
            )}
          </section>
        </section>
      </div>
    </div>
  );
};

const MenuItem = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState("");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setColor(isOpen ? "" : "#ff9f00");
  };

  return (
    <li onClick={toggleMenu} style={{ color }}>
      <i className={icon}></i> {title}
      <i
        className={`fa-regular ${isOpen ? "fa-square-minus" : "fa-square-plus"}`}
        style={{ float: "right" }}
      ></i>
      {isOpen && <ul className="submenu">{children}</ul>}
    </li>
  );
};

export default HomeEmpleado;