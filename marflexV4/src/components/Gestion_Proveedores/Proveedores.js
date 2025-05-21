import axios from "axios";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import "./styles/Proveedores.css";
import { Button, Form, Table, Search, Icon } from "semantic-ui-react";
import { InputMask } from "primereact/inputmask";
import Pagination from "../Pagination";

// Centraliza la URL del backend
const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ Nombre: "", Telefono: "", Direccion: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProveedores();
    // eslint-disable-next-line
  }, []);

  const fetchProveedores = () => {
    axios.get(`${backendUrl}/proveedores`)
      .then(({ data }) => setProveedores(data))
      .catch((error) => console.error("Error al obtener proveedores:", error));
  };

  const resetForm = () => {
    setFormData({ Nombre: "", Telefono: "", Direccion: "" });
    setEditingId(null);
    setFormVisible(false);
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const request = editingId
      ? axios.put(`${backendUrl}/actualizar/proveedores/${editingId}`, formData)
      : axios.post(`${backendUrl}/agregar/proveedores`, formData);

    request
      .then(() => {
        fetchProveedores();
        resetForm();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: editingId ? "Proveedor actualizado." : "Proveedor registrado.",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((err) => console.error("Error al guardar proveedor:", err));
  };

  const handleEdit = (id) => {
    const proveedor = proveedores.find((p) => p.ID === id);
    setEditingId(id);
    setFormData({ Nombre: proveedor.Nombre, Telefono: proveedor.Telefono, Direccion: proveedor.Direccion });
    setFormVisible(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "¡Sí, eliminar!",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${backendUrl}/eliminar/proveedores/${id}`)
          .then(() => {
            fetchProveedores();
            Swal.fire("Eliminado", "El proveedor fue eliminado exitosamente.", "success");
          })
          .catch((err) => console.error("Error al eliminar proveedor:", err));
      }
    });
  };

  const handleSearchChange = (_, { value }) => {
    setSearchTerm(value.toLowerCase());
  };

  const filteredProveedores = proveedores.filter(
    (p) =>
      p.ID.toString().includes(searchTerm) ||
      p.Nombre.toLowerCase().includes(searchTerm)
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredProveedores.slice(indexOfFirst, indexOfLast);

  return (
    <section>
      <div className="Titulo">
        <p>Proveedores</p>
      </div>

      {formVisible && (
        <Form className="RegistroNuevoProveedor" onSubmit={handleFormSubmit}>
          <div className="contenedor_formulario_Proveedores">
            <Form.Group widths="equal">
              <Form.Input
                label="Nombre"
                name="Nombre"
                placeholder="Nombre"
                value={formData.Nombre}
                onChange={handleInputChange}
                required
              />
              <Form.Field required>
                <label>Teléfono</label>
                <InputMask
                  mask="(999) 999-9999"
                  name="Telefono"
                  placeholder="(999) 999-9999"
                  value={formData.Telefono}
                  onChange={handleInputChange}
                />
              </Form.Field>
            </Form.Group>

            <Form.Input
              label="Dirección"
              name="Direccion"
              placeholder="Dirección"
              value={formData.Direccion}
              onChange={handleInputChange}
              required
            />

            <Button color="green" type="submit">
              {editingId ? "Actualizar" : "Registrar"}
            </Button>
            <Button color="red" type="button" onClick={resetForm}>
              Cancelar
            </Button>
          </div>
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
          <Button color="green" onClick={() => setFormVisible(!formVisible)}>
            <i className="pi pi-plus" /> Proveedor
          </Button>
        </div>
      </div>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Nombre</Table.HeaderCell>
            <Table.HeaderCell>Teléfono</Table.HeaderCell>
            <Table.HeaderCell>Dirección</Table.HeaderCell>
            <Table.HeaderCell>Acciones</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {currentItems.map((p, index) => (
            <Table.Row key={p.ID}>
              <Table.Cell>{index + 1 + indexOfFirst}</Table.Cell>
              <Table.Cell>{p.Nombre}</Table.Cell>
              <Table.Cell>{p.Telefono}</Table.Cell>
              <Table.Cell>{p.Direccion}</Table.Cell>
              <Table.Cell>
                <Button icon color="blue" onClick={() => handleEdit(p.ID)}>
                  <Icon name="edit" />
                </Button>
                <Button icon color="red" onClick={() => handleDelete(p.ID)}>
                  <Icon name="trash" />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredProveedores.length / itemsPerPage)}
        handlePageChange={setCurrentPage}
      />
    </section>
  );
}

export default Proveedores;