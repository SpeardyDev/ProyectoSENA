import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Button, Form, Search, Table, Icon } from "semantic-ui-react";
import axios from "axios";
import Pagination from "../Pagination";
import "./styles/colchones.css";

// Centraliza la URL del backend
const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

const Colchones = () => {
  const [colchones, setColchones] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formularioDatos, setFormularioDatos] = useState({
    Modelo: "",
    Descripcion: "",
    Fecha_Fabricacion: new Date().toISOString().slice(0, 10),
    Cantidad: "",
  });
  const [editandoID, setEditandoID] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    mostrarProductos();
    // eslint-disable-next-line
  }, []);

  const mostrarProductos = () => {
    axios
      .get(`${backendUrl}/colchones`)
      .then((response) => setColchones(response.data))
      .catch((error) => console.error("Error al obtener los datos:", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormularioDatos({ ...formularioDatos, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editandoID
      ? `${backendUrl}/actualizar/colchones/${editandoID}`
      : `${backendUrl}/agregar/colchones`;

    const method = editandoID ? axios.put : axios.post;

    method(url, formularioDatos)
      .then(() => {
        setMostrarFormulario(false);
        setEditandoID(null);
        mostrarProductos();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: editandoID
            ? "Registro actualizado con éxito."
            : "Registro guardado con éxito.",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => console.error("Error al guardar los datos:", error));
  };

  const handleEliminar = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${backendUrl}/eliminar/colchones/${id}`)
          .then(() => {
            mostrarProductos();
            Swal.fire(
              "Eliminado!",
              "El registro ha sido eliminado.",
              "success"
            );
          })
          .catch((error) => console.error("Error al eliminar:", error));
      }
    });
  };

  const handleEditar = (id) => {
    const colchon = colchones.find((item) => item.ID === id);
    if (colchon) {
      setFormularioDatos({
        Modelo: colchon.Modelo,
        Descripcion: colchon.Descripcion,
        Fecha_Fabricacion: colchon.Fecha_Fabricacion
          ? new Date(colchon.Fecha_Fabricacion).toISOString().slice(0, 10)
          : "",
        Cantidad: colchon.Cantidad,
      });
      setEditandoID(id);
      setMostrarFormulario(true);
    }
  };

  const LimpiarFormulario = () => {
    setFormularioDatos({
      Modelo: "",
      Descripcion: "",
      Fecha_Fabricacion: "",
      Cantidad: "",
    });
  };

  const handleSearchChange = (e, { value }) => {
    setSearchTerm(value.toLowerCase());
  };

  const filteredItems = colchones.filter(
    (item) =>
      item.ID.toString().includes(searchTerm) ||
      item.Modelo.toLowerCase().includes(searchTerm) ||
      item.Descripcion.toLowerCase().includes(searchTerm)
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div className="Titulo">
        <p>Colchones</p>
      </div>
      {mostrarFormulario && (
        <Form className="RegistroNuevo_Colchon" onSubmit={handleSubmit}>
          <Form.Group widths="equal">
            <Form.Input
              label="Modelo"
              name="Modelo"
              value={formularioDatos.Modelo}
              onChange={handleChange}
              required
            />
            <Form.Input
              label="Cantidad"
              type="number"
              name="Cantidad"
              value={formularioDatos.Cantidad}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Input
              label="Descripción"
              name="Descripcion"
              value={formularioDatos.Descripcion}
              onChange={handleChange}
              required
            />
            <Form.Input
              label="Fecha de fabricación"
              name="Fecha"
              type="date"
              value={formularioDatos.Fecha_Fabricacion}
              onChange={(e) =>
                setFormularioDatos({
                  ...formularioDatos,
                  Fecha_Fabricacion: e.target.value,
                })
              }
              required
            />
          </Form.Group>
          <Button type="submit" color="green">
            {editandoID ? "Actualizar" : "Registrar"}
          </Button>
          <Button
            type="button"
            color="red"
            onClick={() => {
              setMostrarFormulario(false);
              setEditandoID(null);
              LimpiarFormulario();
            }}
          >
            Cancelar
          </Button>
        </Form>
      )}

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
          <Button
            onClick={() => {
              setMostrarFormulario(!mostrarFormulario);
              LimpiarFormulario();
            }}
            color="green"
          >
            <i className="pi pi-plus" /> Colchón
          </Button>
        </div>
      </div>
      <article className="Dasboard"></article>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Modelo</Table.HeaderCell>
            <Table.HeaderCell>Descripción</Table.HeaderCell>
            <Table.HeaderCell>Fecha de Fabricación</Table.HeaderCell>
            <Table.HeaderCell>Cantidad</Table.HeaderCell>
            <Table.HeaderCell>Acciones</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentItems.map((colchon) => (
            <Table.Row key={colchon.ID}>
              <Table.Cell>{colchon.ID}</Table.Cell>
              <Table.Cell>{colchon.Modelo}</Table.Cell>
              <Table.Cell>{colchon.Descripcion}</Table.Cell>
              <Table.Cell>
                {new Date(colchon.Fecha_Fabricacion).toISOString().slice(0, 10)}
              </Table.Cell>
              <Table.Cell>{colchon.Cantidad}</Table.Cell>
              <Table.Cell>
                <Button
                  icon
                  color="blue"
                  onClick={() => handleEditar(colchon.ID)}
                >
                  <Icon name="edit" />
                </Button>
                <Button
                  icon
                  color="red"
                  onClick={() => handleEliminar(colchon.ID)}
                >
                  <Icon name="trash" />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(colchones.length / itemsPerPage)}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default Colchones;