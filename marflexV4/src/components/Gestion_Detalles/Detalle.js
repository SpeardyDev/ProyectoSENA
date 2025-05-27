import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Button, Form, Table, Icon, Dropdown, Search } from "semantic-ui-react";
import axios from "axios";
import Pagination from "../Pagination";
import "./styles/detalles.css";

// Centraliza la URL del backend
const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://marflex.duckdns.org:3000";

const Detalle = () => {
  const [detalles, setDetalles] = useState([]);
  const [colchones, setColchones] = useState([]);
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formularioDatos, setFormularioDatos] = useState({
    ID_Colchon: "",
    ID_MateriaPrima: "",
    Cantidad_Usada: "",
  });
  const [editandoID, setEditandoID] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    Promise.all([obtenerColchones(), obtenerMateriasPrimas()]).then(() =>
      mostrarDetalles()
    );
    // eslint-disable-next-line
  }, []);

  const mostrarDetalles = () => {
    axios
      .get(`${backendUrl}/detalle_colchon`)
      .then((response) => {
        const detallesConNombres = response.data.map((detalle) => {
          const materiaPrima = materiasPrimas.find(
            (mp) => mp.value === detalle.ID_MateriaPrima
          );
          const colchon = colchones.find((c) => c.value === detalle.ID_Colchon);

          return {
            ...detalle,
            NombreMateriaPrima: materiaPrima
              ? materiaPrima.text
              : "Desconocido",
            NombreColchon: colchon ? colchon.text : "Desconocido",
          };
        });

        setDetalles(detallesConNombres);
      })
      .catch((error) => console.error("Error al obtener los detalles:", error));
  };

  const obtenerColchones = () => {
    return axios
      .get(`${backendUrl}/colchones`)
      .then((response) => {
        const opciones = response.data.map((colchon) => ({
          key: colchon.ID,
          text: colchon.Modelo,
          value: colchon.ID,
        }));
        setColchones(opciones);
      })
      .catch((error) =>
        console.error("Error al obtener los colchones:", error)
      );
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

  const handleChange = (e, { name, value }) => {
    setFormularioDatos({ ...formularioDatos, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editandoID
      ? `${backendUrl}/actualizar/detalle_colchon/${editandoID}`
      : `${backendUrl}/agregar/detalle_colchon`;

    const method = editandoID ? axios.put : axios.post;

    method(url, formularioDatos)
      .then(() => {
        setMostrarFormulario(false);
        setEditandoID(null);
        mostrarDetalles();
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
          .delete(`${backendUrl}/eliminar/detalle_colchon/${id}`)
          .then(() => {
            mostrarDetalles();
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
    const detalle = detalles.find((item) => item.ID === id);
    if (detalle) {
      setFormularioDatos({
        ID_Colchon: detalle.ID_Colchon,
        ID_MateriaPrima: detalle.ID_MateriaPrima,
        Cantidad_Usada: detalle.Cantidad_Usada,
      });
      setEditandoID(id);
      setMostrarFormulario(true);
    }
  };

  const LimpiarFormulario = () => {
    setFormularioDatos({
      ID_Colchon: "",
      ID_MateriaPrima: "",
      Cantidad_Usada: "",
    });
  };

  const handleSearchChange = (e, { value }) => {
    setSearchTerm(value.toLowerCase());
  };

  const filteredItems = detalles.filter(
    (item) =>
      item.ID.toString().includes(searchTerm) ||
      item.NombreColchon.toLowerCase().includes(searchTerm) ||
      item.NombreMateriaPrima.toLowerCase().includes(searchTerm)
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div className="Titulo">
        <p>Detalle Colchones</p>
      </div>
      {mostrarFormulario && (
        <Form className="RegistroNuevo_Colchon" onSubmit={handleSubmit}>
          <Form.Group widths="equal">
            <Form.Field>
              <label>ID Colchón</label>
              <Dropdown
                placeholder="Seleccionar Colchón"
                fluid
                selection
                scrolling
                options={colchones}
                name="ID_Colchon"
                value={formularioDatos.ID_Colchon}
                onChange={handleChange}
                required
              />
            </Form.Field>
            <Form.Field>
              <label>ID Materia Prima</label>
              <Dropdown
                placeholder="Seleccionar Materia Prima"
                fluid
                selection
                scrolling
                options={materiasPrimas}
                name="ID_MateriaPrima"
                value={formularioDatos.ID_MateriaPrima}
                onChange={handleChange}
                required
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Input
              label="Cantidad Usada"
              type="number"
              name="Cantidad_Usada"
              value={formularioDatos.Cantidad_Usada}
              onChange={handleChange}
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
            <i className="pi pi-plus" /> Detalle
          </Button>
        </div>
      </div>
      <article className="Dasboard"></article>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>ID Colchón</Table.HeaderCell>
            <Table.HeaderCell>ID Materia Prima</Table.HeaderCell>
            <Table.HeaderCell>Cantidad Usada</Table.HeaderCell>
            <Table.HeaderCell>Acciones</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentItems.map((detalle) => {
            const colchon = colchones.find(
              (c) => c.value === detalle.ID_Colchon
            );
            const materiaPrima = materiasPrimas.find(
              (m) => m.value === detalle.ID_MateriaPrima
            );

            return (
              <Table.Row key={detalle.ID}>
                <Table.Cell>{detalle.ID}</Table.Cell>
                <Table.Cell>
                  {colchon ? colchon.text : "Desconocido"}
                </Table.Cell>
                <Table.Cell>
                  {materiaPrima ? materiaPrima.text : "Desconocido"}
                </Table.Cell>
                <Table.Cell>{detalle.Cantidad_Usada}</Table.Cell>
                <Table.Cell>
                  <Button
                    icon
                    color="blue"
                    onClick={() => handleEditar(detalle.ID)}
                  >
                    <Icon name="edit" />
                  </Button>
                  <Button
                    icon
                    color="red"
                    onClick={() => handleEliminar(detalle.ID)}
                  >
                    <Icon name="trash" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(detalles.length / itemsPerPage)}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default Detalle;