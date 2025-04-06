import React, { useState, useEffect } from "react";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import {
  Button,
  Table,
  Icon,
  Dropdown,
  Input,
  Search,
} from "semantic-ui-react";
import axios from "axios";
import Pagination from "../Pagination";
import Swal from "sweetalert2";

const SolicitudPendientes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [editingSolicitud, setEditingSolicitud] = useState(null);
  const [newEstado, setNewEstado] = useState("");
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    obtenerSolicitudesPendientes();
    obtenerUsuarios();
    obtenerMateriasPrimas();
  }, []);

  const obtenerSolicitudesPendientes = () => {
    axios
      .get("http://localhost:3000/solicitudes/pendientes")
      .then((response) => setSolicitudes(response.data))
      .catch((error) =>
        console.error("Error al obtener las solicitudes pendientes:", error)
      );
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
      .catch((error) =>
        console.error("Error al obtener las materias primas:", error)
      );
  };

  const handleEditClick = (id, estadoActual) => {
    setEditingSolicitud(id);
    setNewEstado(estadoActual);
    setMotivoRechazo(""); // Resetear motivo de rechazo
  };

  const handleSaveClick = async (id) => {
    try {
      if (newEstado === "Aprobada") {
        const response = await axios.post(
          "http://localhost:3000/aprobar-solicitud",
          { ID: id }
        );

        await Swal.fire({
          title: "Solicitud aprobada",
          text: "La solicitud ha sido aprobada con éxito.",
          icon: "success",
          confirmButtonText: "OK",
        });

        console.log("Solicitud aprobada:", response.data);
      } else if (newEstado === "Rechazada" && motivoRechazo.trim()) {
        const response = await axios.post(
          "http://localhost:3000/rechazar-solicitud",
          {
            ID: id,
            Motivo_Rechazo: motivoRechazo.trim(),
          }
        );

        await Swal.fire({
          title: "Solicitud rechazada",
          text: "Motivo: " + motivoRechazo.trim(),
          icon: "error",
          confirmButtonText: "OK",
        });

        console.log("Solicitud rechazada:", response.data);
      } else {
        console.warn("Estado inválido o motivo de rechazo vacío.");
        return;
      }

      obtenerSolicitudesPendientes();
      setEditingSolicitud(null);
    } catch (error) {
      console.error("Error al actualizar la solicitud:", error);

      if (error.response?.data) {
        const { error: errorMessage, stockDisponible } = error.response.data;

        if (errorMessage === "Stock insuficiente") {
          await Swal.fire({
            title: "Stock insuficiente",
            text: `No hay suficiente stock para aprobar esta solicitud. Stock disponible: ${stockDisponible}`,
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else {
          await Swal.fire({
            title: "Error",
            text: errorMessage || "Algo salió mal",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } else {
        await Swal.fire({
          title: "Error",
          text: "No se recibió respuesta del servidor. Intenta nuevamente.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleSearchChange = (e, { value }) => {
    setSearchTerm(value.toLowerCase());
  };

  const filteredItems = solicitudes.filter((item) =>
    item.ID.toString().includes(searchTerm)
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div className="Titulo">
        <p>Solicitudes Pendientes</p>
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
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Usuario</Table.HeaderCell>
            <Table.HeaderCell>Materia Prima</Table.HeaderCell>
            <Table.HeaderCell>Cantidad Solicitada</Table.HeaderCell>
            <Table.HeaderCell>Fecha de Solicitud</Table.HeaderCell>
            <Table.HeaderCell>Estado</Table.HeaderCell>
            <Table.HeaderCell>Motivo de Rechazo</Table.HeaderCell>
            <Table.HeaderCell>Acciones</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentItems.map((solicitud) => {
            const usuario = usuarios.find(
              (u) => u.value === solicitud.ID_Usuario
            );
            const materiaPrima = materiasPrimas.find(
              (m) => m.value === solicitud.ID_MateriaPrima
            );

            return (
              <Table.Row key={solicitud.ID}>
                <Table.Cell>{solicitud.ID}</Table.Cell>
                <Table.Cell>
                  {usuario ? usuario.text : "Desconocido"}
                </Table.Cell>
                <Table.Cell>
                  {materiaPrima ? materiaPrima.text : "Desconocido"}
                </Table.Cell>
                <Table.Cell>{solicitud.Cantidad_Solicitada}</Table.Cell>
                <Table.Cell>{solicitud.Fecha_Solicitud}</Table.Cell>
                <Table.Cell>
                  {editingSolicitud === solicitud.ID ? (
                    <Dropdown
                      selection
                      options={[
                        {
                          key: "pendiente",
                          text: "Pendiente",
                          value: "Pendiente",
                        },
                        {
                          key: "aprobada",
                          text: "Aprobada",
                          value: "Aprobada",
                        },
                        {
                          key: "rechazada",
                          text: "Rechazada",
                          value: "Rechazada",
                        },
                      ]}
                      value={newEstado}
                      onChange={(e, { value }) => setNewEstado(value)}
                    />
                  ) : (
                    solicitud.Estado
                  )}
                </Table.Cell>
                <Table.Cell>
                  {editingSolicitud === solicitud.ID &&
                  newEstado === "Rechazada" ? (
                    <Input
                      placeholder="Motivo de rechazo"
                      value={motivoRechazo}
                      onChange={(e) => setMotivoRechazo(e.target.value)}
                    />
                  ) : (
                    solicitud.Motivo_Rechazo || "N/A"
                  )}
                </Table.Cell>
                <Table.Cell>
                  {editingSolicitud === solicitud.ID ? (
                    <Button
                      icon
                      color="green"
                      onClick={() => handleSaveClick(solicitud.ID)}
                    >
                      <Icon name="save" />
                    </Button>
                  ) : (
                    <Button
                      icon
                      color="blue"
                      onClick={() =>
                        handleEditClick(solicitud.ID, solicitud.Estado)
                      }
                    >
                      <Icon name="edit" />
                    </Button>
                  )}
                </Table.Cell>
              </Table.Row>
            );
          })}
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

export default SolicitudPendientes;