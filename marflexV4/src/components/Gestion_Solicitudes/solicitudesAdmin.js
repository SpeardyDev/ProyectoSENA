import React, { useState, useEffect } from "react";
import { Table, Search, Icon } from "semantic-ui-react";
import axios from "axios";
import Pagination from "../Pagination";
import "./styles/solicitudes.css";
import 'primeicons/primeicons.css';
import { Avatar } from 'primereact/avatar';

// Centraliza la URL del backend
const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://marflex.duckdns.org:3000";

const SolicitudAdmin = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    Promise.all([obtenerUsuarios(), obtenerMateriasPrimas()]).then(() =>
      mostrarSolicitudes()
    );
    // eslint-disable-next-line
  }, []);

  const mostrarSolicitudes = () => {
    axios
      .get(`${backendUrl}/solicitudes_materia_prima`)
      .then((response) => {
        const solicitudesConNombres = response.data.map((solicitud) => {
          const usuario = usuarios.find(
            (u) => u.value === solicitud.ID_Usuario
          );
          const materiaPrima = materiasPrimas.find(
            (mp) => mp.value === solicitud.ID_MateriaPrima
          );

          return {
            ...solicitud,
            NombreUsuario: usuario ? usuario.text : "Desconocido",
            NombreMateriaPrima: materiaPrima
              ? materiaPrima.text
              : "Desconocido",
          };
        });

        setSolicitudes(solicitudesConNombres);
      })
      .catch((error) =>
        console.error("Error al obtener las solicitudes:", error)
      );
  };

  const obtenerUsuarios = () => {
    return axios
      .get(`${backendUrl}/api/usuarios`)
      .then((response) => {
        const opciones = response.data.map((usuario) => ({
          key: usuario.id,
          text: usuario.nombre,
          value: usuario.id,
        }));
        setUsuarios(opciones);
      })
      .catch((error) => console.error("Error al obtener los usuarios:", error));
  };

  const obtenerMateriasPrimas = () => {
    return axios
      .get(`${backendUrl}/materia_prima`)
      .then((response) => {
        const opciones = response.data.map((materia) => ({
          key: materia.ID,
          text: materia.Nombre,
          value: materia.ID,
        }));
        setMateriasPrimas(opciones);
      })
      .catch((error) =>
        console.error("Error al obtener las materias primas:", error)
      );
  };

  const handleSearchChange = (e, { value }) => {
    setSearchTerm(value.toLowerCase());
  };

  const filteredItems = solicitudes.filter(
    (item) =>
      item.ID.toString().includes(searchTerm) ||
      item.NombreUsuario.toLowerCase().includes(searchTerm) ||
      item.NombreMateriaPrima.toLowerCase().includes(searchTerm) ||
      item.Estado.toLowerCase().includes(searchTerm)
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div className="Titulo">
        <p>Solicitudes de Materia Prima</p>
      </div>
      <div className="Filtro">
        <div className="Contenedor-1">
          <Search
            placeholder="Buscar"
            onSearchChange={handleSearchChange}
            showNoResults={false}
          />
          <span className="icon-text">
            <i className="pi pi-filter" style={{ fontSize: "1.5rem" }}></i>
            <span>Filtro</span>
          </span>
        </div>
        <div className="Contenedor-2">
          <span className="icon-text">
            <i className="pi pi-tag" style={{ fontSize: "1.5rem" }}></i>
            <span>Categorías</span>
          </span>
          <span className="icon-text">
            <i className="pi pi-upload" style={{ fontSize: "1.5rem" }}></i>
            <span>Exportar</span>
          </span>
        </div>
      </div>
      <article className="Dasboard"></article>
      <Table celled className="solicitudes-table" style={{ marginTop: '20px' }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={1}>#</Table.HeaderCell>
            <Table.HeaderCell width={4}><Icon name="user" />Usuario</Table.HeaderCell>
            <Table.HeaderCell width={2}>Materia Prima</Table.HeaderCell>
            <Table.HeaderCell width={1}>Cantidad</Table.HeaderCell>
            <Table.HeaderCell width={2}>Fecha</Table.HeaderCell>
            <Table.HeaderCell width={2}>Estado</Table.HeaderCell>
            <Table.HeaderCell width={3}><i className="pi pi-ban" style={{ fontSize: '1.1rem', marginRight:'5px' }}></i>Motivo Rechazo</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentItems.map((solicitud) => (
            <Table.Row key={solicitud.ID}>
              <Table.Cell className="text-center">{solicitud.ID}</Table.Cell>
              <Table.Cell>
                <div className="user-cell">
                  <Avatar image={solicitud.FotoPerfilUrl || `${backendUrl}/uploads/foto-perfil.jpg`} size="large" shape="circle" />
                  {usuarios.find((m) => m.value === solicitud.ID_Usuario)?.text || "Desconocido"}
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className="materia-cell">
                  <Icon name="box" />
                  {materiasPrimas.find((m) => String(m.value) === String(solicitud.ID_MateriaPrima))?.text || "Desconocido"}
                </div>
              </Table.Cell>
              <Table.Cell className="quantity-cell">
                <div className="quantity-bubble">
                  {solicitud.Cantidad_Solicitada}
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className="date-cell">
                  <Icon name="calendar alternate" />
                  {solicitud.Fecha_Solicitud_Date}
                  <div className="time-text">
                    {solicitud.Fecha_Solicitud_Time}
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell className="text-center">
                <div className="status-indicator">
                  <div
                    className={`status-dot ${solicitud.Estado.toLowerCase()}`}
                    title={solicitud.Estado}
                  />
                  <span className="status-label">{solicitud.Estado}</span>
                </div>
              </Table.Cell>
              <Table.Cell>
                {solicitud.Motivo_Rechazo ? (
                  <div className="rechazo-cell">
                    <Icon name="exclamation circle" />
                    {solicitud.Motivo_Rechazo}
                  </div>
                ) : (
                  <span className="no-rechazo">N/A</span>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(solicitudes.length / itemsPerPage)}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default SolicitudAdmin;