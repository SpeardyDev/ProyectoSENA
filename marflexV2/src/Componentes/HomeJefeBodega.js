import React from "react";
import logo from "../img/LogoMarflex.png";
import avatar from "../img/IMG_20240617_223005.jpg";
import icono from "../img/forklift_30dp_DA954B_FILL0_wght400_GRAD0_opsz24.png";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./styles/HomeAdmin.css";
import Inventario from "./Gestion_de_inventario/Inventario.js";
import Pedidos from "./Gestion_de_pedidos/Pedidos.js";
// import Categoria from './Gestion_de_productos/Categoria';
// import Productos from './Gestion_de_productos/Productos';
// import Proveedores from './Gestion_de_productos/Proveedores';
import MenuDePerfil from "./MenuDePerfil.js";

const HomeJefeBodega = () => {
  const [visibleComponents, setVisibleComponents] = useState({
    dashboard: true,
    inventario: false,
    pedidos: false,
  });

  const handleButtonClick = (componentName) => {
    setVisibleComponents((prevState) => ({
      ...prevState,
      dashboard: componentName === "dashboard",
      inventario: componentName === "inventario",
      pedidos: componentName === "pedidos",
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
                <li onClick={() => handleButtonClick("inventario")}>
                  <i className="fas fa-cubes"></i> Inventario
                </li>
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
            {visibleComponents.inventario && (
              <section className="cont-inventario">
                <Inventario />
              </section>
            )}
            {visibleComponents.pedidos && (
              <section className="cont-pedidos">
                <Pedidos />
              </section>
            )}
          </section>
        </section>
      </div>
    </div>
  );
};

export default HomeJefeBodega;
