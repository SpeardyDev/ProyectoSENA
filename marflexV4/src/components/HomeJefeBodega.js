import React from "react";
import logo from "../img/LogoMarflex.png";
import avatar from "../img/jefe.jpg";
import icono from "../img/forklift_30dp_DA954B_FILL0_wght400_GRAD0_opsz24.png";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./styles/HomeAdmin.css";
import Colchones from "./Gestion_Colchones/Colchones.js";
import Detalle from "./Gestion_Colchones/Detalle.js";
import MenuDePerfil from "./MenuDePerfil.js";

const HomeJefeBodega = () => {
  const [visibleComponents, setVisibleComponents] = useState({
    dashboard: true,
    colchones: false,
    detalle: false,
  });

  const handleButtonClick = (componentName) => {
    setVisibleComponents((prevState) => ({
      ...prevState,
      dashboard: componentName === "dashboard",
      colchones: componentName === "colchones",
      detalle: componentName === "detalle",
    }));
  };

  return (
    <div className="App">
      <div className="App-body">
        <header className="App-header">
          <nav className="barra-navegacion">
            <div className="logo">
              <img src={icono} alt="Logo de marflex" />
              <h1 className="h1-nav">Bodega</h1>
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
          <FontAwesomeIcon className="menu-amburguesa" icon={faBars} />
          <section className="menu">
            <div className="contenido-usuario">
              <img
                id="profile-pic"
                src={avatar}
                alt="Foto de perfil"
                className="profile-pic"
              />
              <div className="perfil-nombre">
                <p id="Nombre">SANDRA VIVIANA RUIZ MENESES</p>
              </div>
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
                <li onClick={() => handleButtonClick("pedidos")}>
                  <i className="fa-solid fa-dolly"></i> Pedidos
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
        className={`fa-regular ${
          isOpen ? "fa-square-minus" : "fa-square-plus"
        }`}
        style={{ float: "right" }}
      ></i>
      {isOpen && <ul className="submenu">{children}</ul>}
    </li>
  );
};

export default HomeJefeBodega;