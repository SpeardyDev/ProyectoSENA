import React, { useState, useEffect } from "react";
import { Table, Search } from "semantic-ui-react";
import axios from "axios";
import Pagination from "../Pagination";
import "./styles/solicitudes.css";

const SolicitudAdmin = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [materiasPrimas, setMateriasPrimas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
  
    useEffect(() => {
      mostrarSolicitudes();
      obtenerUsuarios();
      obtenerMateriasPrimas();
    }, []);
  
    const mostrarSolicitudes = () => {
      axios
        .get("http://localhost:3000/solicitudes_materia_prima")
        .then((response) => setSolicitudes(response.data))
        .catch((error) => console.error("Error al obtener las solicitudes:", error));
    };
  
    const obtenerUsuarios = () => {
      axios
        .get("http://localhost:3000/usuarios")
        .then((response) => {
          const opciones = response.data.map((usuario) => ({
            key: usuario.ID,
            text: usuario.Nombre,
            value: usuario.ID,
          }));
          setUsuarios(opciones);
        })
        .catch((error) => console.error("Error al obtener los usuarios:", error));
    };
  
    const obtenerMateriasPrimas = () => {
      axios
        .get("http://localhost:3000/materia_prima")
        .then((response) => {
          const opciones = response.data.map((materia) => ({
            key: materia.ID,
            text: materia.Nombre,
            value: materia.ID,
          }));
          setMateriasPrimas(opciones);
        })
        .catch((error) => console.error("Error al obtener las materias primas:", error));
    };
  
    const handlePageChange = (page) => setCurrentPage(page);
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = solicitudes.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div className="Titulo">
        <p>Solicitudes de Materia Prima</p>
      </div>
      <div className="Filtro">
        <div className="Contenedor-1">
          <Search placeholder="Código" />
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
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Usuario</Table.HeaderCell>
            <Table.HeaderCell>Materia Prima</Table.HeaderCell>
            <Table.HeaderCell>Cantidad Solicitada</Table.HeaderCell>
            <Table.HeaderCell>Fecha Solicitud</Table.HeaderCell>
            <Table.HeaderCell>Estado</Table.HeaderCell>
            <Table.HeaderCell>Motivo Rechazo</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentItems.map((solicitud) => (
            <Table.Row key={solicitud.ID}>
              <Table.Cell>{solicitud.ID}</Table.Cell>
              <Table.Cell>{usuarios.find((m) => m.value === solicitud.ID_Usuario)?.text || "Desconocido"}</Table.Cell>
              <Table.Cell>{materiasPrimas.find((m) => String(m.value) === String(solicitud.ID_MateriaPrima))?.text || "Desconocido"}</Table.Cell>
              <Table.Cell>{solicitud.Cantidad_Solicitada}</Table.Cell>
              <Table.Cell>{solicitud.Fecha_Solicitud}</Table.Cell>
              <Table.Cell>{solicitud.Estado}</Table.Cell>
              <Table.Cell>{solicitud.Motivo_Rechazo || "Nulo"}</Table.Cell>
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