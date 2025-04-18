import axios from "axios";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import "./styles/Proveedores.css";
import { Button, Form, Table, Search, Icon } from "semantic-ui-react";
<<<<<<< HEAD
import { InputMask } from "primereact/inputmask";
import Pagination from "../Pagination";

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
  }, []);

  const fetchProveedores = () => {
    axios.get("http://localhost:3000/proveedores")
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
      ? axios.put(`http://localhost:3000/actualizar/proveedores/${editingId}`, formData)
      : axios.post("http://localhost:3000/agregar/proveedores", formData);

    request
      .then(() => {
        fetchProveedores();
        resetForm();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: editingId ? "Proveedor actualizado." : "Proveedor registrado.",
=======
import Pagination from "../Pagination";
import { InputMask } from "primereact/inputmask";

function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [proveedorEditando, setProveedorEditando] = useState(null);
  const [formularioDatos, setFormularioDato] = useState({
    Nombre: "",
    Telefono: "",
    Direccion: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    mostrarProveedores();
  }, []);

  const mostrarProveedores = () => {
    axios
      .get("http://localhost:3000/proveedores")
      .then((respuesta) => setProveedores(respuesta.data))
      .catch((error) => console.error("Error al obtener los datos:", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormularioDato({ ...formularioDatos, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/agregar/proveedores", formularioDatos)
      .then(() => {
        setMostrarFormulario(false);
        mostrarProveedores();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Registro guardado con éxito.",
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
          showConfirmButton: false,
          timer: 1500,
        });
      })
<<<<<<< HEAD
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
        axios.delete(`http://localhost:3000/eliminar/proveedores/${id}`)
          .then(() => {
            fetchProveedores();
            Swal.fire("Eliminado", "El proveedor fue eliminado exitosamente.", "success");
          })
          .catch((err) => console.error("Error al eliminar proveedor:", err));
=======
      .catch((error) => console.error("Error al insertar los datos:", error));
  };

  const handleEditar = (id) => {
    const proveedor = proveedores.find((item) => item.ID === id);
    setProveedorEditando(proveedor.ID);
    setFormularioDato({
      Nombre: proveedor.Nombre,
      Telefono: proveedor.Telefono,
      Direccion: proveedor.Direccion,
    });
    setMostrarFormulario(true);
  };

  const handleActualizar = (e) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:3000/actualizar/proveedores/${proveedorEditando}`,
        formularioDatos
      )
      .then(() => {
        setMostrarFormulario(false);
        setProveedorEditando(null);
        mostrarProveedores();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Proveedor actualizado con éxito.",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => console.error("Error al actualizar los datos:", error));
  };

  const BtnEliminar = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, elimínalo!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3000/eliminar/proveedores/${id}`)
          .then(() => {
            mostrarProveedores();
            Swal.fire({
              title: "¡Eliminado!",
              text: "Este proveedor ha sido eliminado con éxito.",
              icon: "success",
            });
          })
          .catch((error) =>
            console.error("Error al eliminar los datos:", error)
          );
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
      }
    });
  };

<<<<<<< HEAD
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
=======
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const LimpiarFormulario = () => {
    setFormularioDato({
      Nombre: "",
      Telefono: "",
      Direccion: "",
    });
  };

  const handleSearchChange = (e, { value }) => {
    setSearchTerm(value.toLowerCase());
  };

  const filteredItems = proveedores.filter(
    (item) =>
      item.ID.toString().includes(searchTerm) ||
      item.Nombre.toLowerCase().includes(searchTerm)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033

  return (
    <section>
      <div className="Titulo">
        <p>Proveedores</p>
      </div>

<<<<<<< HEAD
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
=======
      {mostrarFormulario && (
        <Form
          className="RegistroNuevoProveedor"
          onSubmit={proveedorEditando ? handleActualizar : handleSubmit}
        >
          <div className="contenedor_formulario_Proveedores">
            <Form.Group widths="equal">
              <Form.Field
                value={formularioDatos.Nombre}
                onChange={handleChange}
                placeholder="Nombre"
                control="input"
                label="Nombre"
                name="Nombre"
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
                required
              />
              <Form.Field required>
                <label>Teléfono</label>
                <InputMask
                  mask="(999) 999-9999"
                  name="Telefono"
                  placeholder="(999) 999-9999"
<<<<<<< HEAD
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
=======
                  value={formularioDatos.Telefono}
                  onChange={handleChange}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                name="Direccion"
                value={formularioDatos.Direccion}
                onChange={handleChange}
                label="Dirección"
                control="input"
                placeholder="Dirección"
                required
              />
            </Form.Group>

            <Button type="submit" color="green">
              {proveedorEditando ? "Actualizar" : "Registrar"}
            </Button>
            <Button
              type="button"
              color="red"
              onClick={() => {
                setMostrarFormulario(false);
                setProveedorEditando(null);
                LimpiarFormulario();
              }}
            >
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
              Cancelar
            </Button>
          </div>
        </Form>
      )}
<<<<<<< HEAD

=======
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
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
<<<<<<< HEAD
          <Button color="green" onClick={() => setFormVisible(!formVisible)}>
=======
          <Button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            color="green"
          >
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
            <i className="pi pi-plus" /> Proveedor
          </Button>
        </div>
      </div>
<<<<<<< HEAD

=======
      <article className="Dasboard-Proveedores"></article>
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
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
<<<<<<< HEAD
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
=======
          {currentItems.map((proveedor, index) => (
            <Table.Row key={proveedor.ID}>
              <Table.Cell>{index + 1 + indexOfFirstItem}</Table.Cell>
              <Table.Cell>{proveedor.Nombre}</Table.Cell>
              <Table.Cell>{proveedor.Telefono}</Table.Cell>
              <Table.Cell>{proveedor.Direccion}</Table.Cell>
              <Table.Cell>
                <Button
                  icon
                  color="blue"
                  onClick={() => handleEditar(proveedor.ID)}
                >
                  <Icon name="edit" />
                </Button>
                <Button
                  icon
                  color="red"
                  onClick={() => BtnEliminar(proveedor.ID)}
                >
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
                  <Icon name="trash" />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
<<<<<<< HEAD

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredProveedores.length / itemsPerPage)}
        handlePageChange={setCurrentPage}
=======
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(proveedores.length / itemsPerPage)}
        handlePageChange={handlePageChange}
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
      />
    </section>
  );
}

<<<<<<< HEAD
export default Proveedores;
=======
export default Proveedores;
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
