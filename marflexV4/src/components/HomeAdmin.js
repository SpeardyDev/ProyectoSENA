/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect, useRef, Suspense, lazy, memo, useCallback } from "react";
import logo from "../img/LogoMarflex.png";
import icono from "../img/forklift_30dp_DA954B_FILL0_wght400_GRAD0_opsz24.png";
import "./styles/HomeAdmin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import MenuDePerfil from "./MenuDePerfil";
import NotificationIcon from "./Gestion_Solicitudes/NotificationIcon";
import { Button } from "semantic-ui-react";
import axios from "axios";
import { io } from "socket.io-client";

// Lazy load components for faster initial load
const Proveedores = lazy(() => import("./Gestion_Proveedores/Proveedores"));
const Usuarios = lazy(() => import("./Gestion_Usuarios/Usuarios"));
const MateriasPrimas = lazy(() => import("./Gestion_MateriaPrima/MateriaPrima"));
const Reportes = lazy(() => import("./Gestion_de_Reportes/Reportes"));
const Movimientos = lazy(() => import("./Gestion_Movimientos/Movimientos"));
const SolicitudesP = lazy(() => import("./Gestion_Solicitudes/solicitudesPendientes"));
const Solicitudes = lazy(() => import("./Gestion_Solicitudes/solicitudesAdmin"));

// Centraliza la URL del backend
const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
const defaultAvatar = `${backendUrl}/uploads/foto-perfil.jpg`;

const MENU_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "fa-solid fa-chart-line" },
  { key: "Reportes", label: "Reportes", icon: "fas fa-chart-bar" },
  {
    key: "gestionMaterias",
    label: "Gestión de Materias Primas",
    icon: "fas fa-cubes",
    children: [
      { key: "Mprima", label: "Materias Primas" },
      { key: "Proveedores", label: "Proveedores" },
    ],
  },
  {
    key: "gestionMovimientos",
    label: "Gestión de Movimientos",
    icon: "fas fa-down-left-and-up-right-to-center",
    children: [{ key: "Movimientos", label: "Movimientos" }],
  },
  {
    key: "gestionSolicitudes",
    label: "Gestión de Solicitudes",
    icon: "fas fa-users",
    children: [
      { key: "SolicitudesP", label: "Solicitudes Pendientes" },
      { key: "Solicitudes", label: "Solicitudes de Materia Prima" },
    ],
  },
  {
    key: "gestionUsuarios",
    label: "Gestión de Usuarios",
    icon: "fas fa-users",
    children: [{ key: "Usuarios", label: "Usuarios" }],
  },
  {
    key: "configuracion",
    label: "Configuración",
    icon: "fa-solid fa-gear",
    children: [{ key: "cambiarPassword", label: "Cambiar contraseña" }],
  },
];

const MenuItem = memo(function MenuItem({
  title,
  icon,
  children,
  isOpen,
  onClick,
  childrenList,
  onChildClick,
  selectedKey,
}) {
  const color = isOpen ? "#ff9f00" : "";
  return (
    <li onClick={onClick} style={{ color }}>
      <i className={icon}></i> {title}
      {childrenList && (
        <i
          className={`fa-regular ${
            isOpen ? "fa-square-minus" : "fa-square-plus"
          }`}
          style={{ float: "right" }}
        />
      )}
      {isOpen && childrenList && (
        <ul className="submenu">
          {childrenList.map((child) => (
            <li
              className="li-desplegable"
              key={child.key}
              onClick={(e) => {
                e.stopPropagation();
                onChildClick(child.key);
              }}
              style={{
                fontWeight: selectedKey === child.key ? "bold" : "normal",
                background: selectedKey === child.key ? "#f3f3f3" : "none",
              }}
            >
              <a className="item">{child.label}</a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
});

function HomeAdmin() {
  // Un solo estado para el componente visible
  const [selectedComponent, setSelectedComponent] = useState("dashboard");
  // Estado de menús desplegables
  const [openMenus, setOpenMenus] = useState({});
  // Estado para notificaciones
  const [notificaciones, setNotificaciones] = useState({ cantidad: 0, tiene: false });

  // Socket solo una vez
  const socketRef = useRef();

  // Avatar y nombre de usuario
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [nombre, setNombre] = useState("");

  // Menú hamburguesa responsive
  const [BtnMenu, setBtnMenu] = useState(false);

  // Inicializa socket y listeners solo una vez
  useEffect(() => {
    socketRef.current = io(backendUrl);
    obtenerSolicitudesPendientes();

    socketRef.current.on("nueva_solicitud", () => {
      setNotificaciones((prev) => ({
        cantidad: prev.cantidad + 1,
        tiene: true,
      }));
    });

    // Si alguna solicitud cambia, vuelve a obtener pendientes
    socketRef.current.on("solicitud_aprobada", obtenerSolicitudesPendientes);
    socketRef.current.on("solicitud_rechazada", obtenerSolicitudesPendientes);

    return () => {
      socketRef.current.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  // Obtener nombre de usuario de localStorage
  useEffect(() => {
    const storedNombre = localStorage.getItem("nombre");
    if (storedNombre) setNombre(storedNombre);

    const storedFoto = localStorage.getItem("fotoPerfil");
    setAvatar(storedFoto ? `${backendUrl}/uploads/${storedFoto}` : defaultAvatar);
    // eslint-disable-next-line
  }, []);

  // Obtener solicitudes pendientes
  const obtenerSolicitudesPendientes = useCallback(() => {
    axios
      .get(`${backendUrl}/solicitudes/pendientes`)
      .then((response) => {
        const cantidad = response.data.length;
        setNotificaciones({ cantidad, tiene: cantidad > 0 });
      })
      .catch((error) =>
        console.error("Error al obtener las solicitudes pendientes:", error)
      );
  }, []);

  // Cambiar foto de perfil
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("fotoPerfil", file);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${backendUrl}/usuarios/foto`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.fotoPerfil) {
        setAvatar(`${backendUrl}/uploads/${data.fotoPerfil}`);
        localStorage.setItem("fotoPerfil", data.fotoPerfil);
      } else {
        console.error("No se recibió fotoPerfil:", data);
      }
    } catch (error) {
      console.error("Error subiendo la foto:", error);
    }
  };

  // Eliminar foto de perfil
  const eliminarFoto = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${backendUrl}/eliminar/usuarios/foto`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        localStorage.setItem("fotoPerfil", "foto-perfil.jpg");
        setAvatar(defaultAvatar);
        alert("Foto de perfil eliminada");
      } else {
        alert("No se pudo eliminar la foto");
      }
    } catch (error) {
      console.error("Error al eliminar foto:", error);
      alert("Error al eliminar la foto");
    }
  };

  // Manejo de menú lateral (expandibles)
  const handleMenuClick = (key) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Renderizado de componentes principales
  const renderComponent = () => {
    switch (selectedComponent) {
      case "dashboard":
        return <Dashboard />;
      case "Proveedores":
        return (
          <Suspense fallback={<div>Cargando Proveedores...</div>}>
            <section className="cont-productos">
              <Proveedores />
            </section>
          </Suspense>
        );
      case "Usuarios":
        return (
          <Suspense fallback={<div>Cargando Usuarios...</div>}>
            <section className="cont-productos">
              <Usuarios />
            </section>
          </Suspense>
        );
      case "Reportes":
        return (
          <Suspense fallback={<div>Cargando Reportes...</div>}>
            <section className="cont-productos">
              <Reportes />
            </section>
          </Suspense>
        );
      case "Mprima":
        return (
          <Suspense fallback={<div>Cargando Materias Primas...</div>}>
            <section className="cont-productos">
              <MateriasPrimas />
            </section>
          </Suspense>
        );
      case "Movimientos":
        return (
          <Suspense fallback={<div>Cargando Movimientos...</div>}>
            <section className="cont-productos">
              <Movimientos />
            </section>
          </Suspense>
        );
      case "SolicitudesP":
        return (
          <Suspense fallback={<div>Cargando Solicitudes Pendientes...</div>}>
            <section className="cont-productos">
              <SolicitudesP />
            </section>
          </Suspense>
        );
      case "Solicitudes":
        return (
          <Suspense fallback={<div>Cargando Solicitudes de Materia Prima...</div>}>
            <section className="cont-productos">
              <Solicitudes />
            </section>
          </Suspense>
        );
      default:
        return null;
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
            <div className="contenedor-user-notificacion">
              <NotificationIcon
                count={notificaciones.cantidad}
                hasNotification={notificaciones.tiene}
              />
              <MenuDePerfil />
            </div>
          </nav>
        </header>
        <section className="mayor">
          <FontAwesomeIcon
            onClick={() => setBtnMenu((prev) => !prev)}
            className="menu-amburguesa"
            icon={faBars}
          />
          <section
            className="menu"
            style={{ display: BtnMenu ? "none" : "block" }}
          >
            <div className="contenido-usuario">
              <FontAwesomeIcon
                onClick={() => setBtnMenu((prev) => !prev)}
                className="Btn_ocultar"
                icon={faXmark}
              />
              <div className="profile-container">
                <img
                  id="profile-pic"
                  src={avatar || defaultAvatar}
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
                {MENU_ITEMS.map((item) =>
                  item.children ? (
                    <MenuItem
                      key={item.key}
                      title={item.label}
                      icon={item.icon}
                      isOpen={!!openMenus[item.key]}
                      onClick={() => handleMenuClick(item.key)}
                      childrenList={item.children}
                      onChildClick={(childKey) => setSelectedComponent(childKey)}
                      selectedKey={selectedComponent}
                    />
                  ) : (
                    <li
                      key={item.key}
                      onClick={() => setSelectedComponent(item.key)}
                      style={{
                        fontWeight: selectedComponent === item.key ? "bold" : "normal",
                        background: selectedComponent === item.key ? "#f3f3f3" : "none",
                      }}
                    >
                      <i className={item.icon}></i>
                      {item.label}
                    </li>
                  )
                )}
              </ul>
            </div>
          </section>
          <section className="contenedor-universal">{renderComponent()}</section>
        </section>
      </div>
    </div>
  );
}

// Dashboard card layout extraído a componente para claridad 
function Dashboard() {
  const cards = [
    {
      color: "green",
      icon: "fa-solid fa-users",
      label: "Usuarios",
      numero: 16,
    },
    {
      color: "orange",
      icon: "fa-solid fa-dolly",
      label: "Proveedores",
      numero: 10,
    },
    {
      color: "red",
      icon: "fas fa-cubes",
      label: "Productos",
      numero: 185,
    },
    {
      color: "purple",
      icon: "fa-solid fa-file-invoice-dollar",
      label: "Facturas",
      numero: "$ 413",
    },
    {
      color: "blue",
      icon: "fa-solid fa-cube",
      label: "Existencia total",
      numero: 148,
    },
    {
      color: "pink",
      icon: "fa-solid fa-truck-fast",
      label: "Existencia vendida",
      numero: 33,
    },
    {
      color: "teal",
      icon: "fa-solid fa-warehouse",
      label: "Existencia actual",
      numero: 115,
    },
    {
      color: "brown",
      icon: "fa-solid fa-wallet",
      label: "Importe vendido",
      numero: "$ 413",
    },
    {
      color: "blue-2",
      icon: "fa-solid fa-dollar-sign",
      label: "Importe pago",
      numero: "$ 413",
    },
    {
      color: "pink-2",
      icon: "fa-solid fa-hand-holding-dollar",
      label: "Importe restante",
      numero: "$ 0",
    },
    {
      color: "teal-2",
      icon: "fa-solid fa-money-bill-1",
      label: "Beneficio bruto",
      numero: 115,
    },
    {
      color: "blue-cielo",
      icon: "fa-solid fa-coins",
      label: "Beneficio neto",
      numero: "$413",
    },
  ];

  return (
    <article className="Dashboard">
      <div className="titulo">
        <p>Dashboard</p>
      </div>
      {cards.map((card, idx) => (
        <div key={idx} className={`card ${card.color}`}>
          <div className={`contenedor-icono ${card.label.replace(/\s/g, "")}`}>
            <i id="icono" className={card.icon}></i>
          </div>
          <div className="contenedor-span">
            <span className="label">{card.label}</span>
            <span className="numero">{card.numero}</span>
          </div>
        </div>
      ))}
    </article>
  );
}

export default HomeAdmin;