import axios from "axios";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import "./styles/Proveedores.css";
import { Button, Form, Table, Search, Icon } from 'semantic-ui-react';
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
      .post(
        "http://localhost:3000/agregar/proveedores",
        formularioDatos
      )
      .then(() => {
        setMostrarFormulario(false);
        mostrarProveedores();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Registro guardado con éxito.",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => console.error("Error al insertar los datos:", error));
  };

  const handleEditar = (id) => {
    const proveedor = proveedores.find(item => item.ID === id);
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
      }
    });
  };

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

  const filteredItems = proveedores.filter(item =>
    item.ID.toString().includes(searchTerm) ||
    item.Nombre.toLowerCase().includes(searchTerm) 
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <section>
      <div className="Titulo">
        <p>Proveedores</p>
      </div>

      {mostrarFormulario && (
        <Form className="RegistroNuevoProveedor" onSubmit={proveedorEditando ? handleActualizar : handleSubmit}>
          <div className="contenedor_formulario_Proveedores">
            <Form.Group widths="equal">
              <Form.Field
                value={formularioDatos.Nombre}
                onChange={handleChange}
                placeholder="Nombre"
                control="input"
                label="Nombre"
                name="Nombre"
                required
              />
              <Form.Field required>
                <label>Teléfono</label>
                <InputMask
                  mask="(999) 999-9999"
                  name="Telefono"
                  placeholder="(999) 999-9999"
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

            <Button type='submit' color='green'>{proveedorEditando ? 'Actualizar' : 'Registrar'}</Button>
            <Button type='button' color='red' onClick={() => { setMostrarFormulario(false); setProveedorEditando(null); LimpiarFormulario();}}>Cancelar</Button>
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
          <Button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            color="green"
          >
            <i className="pi pi-plus" /> Proveedor
          </Button>
        </div>
      </div>
      <article className="Dasboard-Proveedores"></article>
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
          {currentItems.map((proveedor, index) => (
            <Table.Row key={proveedor.ID}>
              <Table.Cell>{index + 1 + indexOfFirstItem}</Table.Cell>
              <Table.Cell>{proveedor.Nombre}</Table.Cell>
              <Table.Cell>{proveedor.Telefono}</Table.Cell>
              <Table.Cell>{proveedor.Direccion}</Table.Cell>
              <Table.Cell>
              <Button icon color="blue" onClick={() => handleEditar(proveedor.ID)}>
                  <Icon name='edit' />
                </Button>
                <Button icon color="red" onClick={() => BtnEliminar(proveedor.ID)}>
                  <Icon name='trash' />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(proveedores.length / itemsPerPage)}
        handlePageChange={handlePageChange}
      />
    </section>
  );
}

export default Proveedores;