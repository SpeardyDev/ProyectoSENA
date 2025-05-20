import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Table, Form, Search, Select, Icon } from "semantic-ui-react";
import { InputMask } from "primereact/inputmask";
import Pagination from "../Pagination";
import Swal from "sweetalert2";

const Estados = [
  { value: 1, text: "Activo" },
  { value: 2, text: "Inactivo" },
];

const Roles = [
  { value: "Empleado", text: "Empleado" },
  { value: "Administrador", text: "Administrador" },
];

const initialFormState = {
  documento: "",
  nombre: "",
  username: "",
  password: "",
  telefono: "",
  ID_Estado: 1, 
  rol: "Empleado", 
};

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [formularioDatos, setFormularioDatos] = useState(initialFormState);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editarUsuario, setEditarUsuario] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/usuarios");
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  const handleChange = (e, data) => {
    if (data) {
      const { name, value } = data;
      setFormularioDatos((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      const { name, value } = e.target;
      setFormularioDatos((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editarUsuario) {
        const datosAEnviar = { ...formularioDatos };
        if (!formularioDatos.password.trim()) delete datosAEnviar.password;
        await axios.put(
          `http://localhost:3000/api/editar/usuarios/${editarUsuario}`,
          datosAEnviar
        );
        Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
      } else {
        await axios.post("http://localhost:3000/registrar", formularioDatos);
        Swal.fire("Éxito", "Usuario registrado correctamente", "success");
      }
      cerrarFormulario();
      obtenerUsuarios();
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
    }
  };

  const cerrarFormulario = () => {
    setFormularioDatos(initialFormState);
    setMostrarFormulario(false);
    setEditarUsuario(null);
  };

  const handleEditar = (id) => {
    const usuario = usuarios.find((item) => item.id === id);
    if (usuario) {
      setFormularioDatos({
        documento: usuario.documento || "",
        nombre: usuario.nombre || "",
        username: usuario.username || "",
        password: "",
        telefono: usuario.telefono || "",
        ID_Estado: usuario.ID_Estado || 1,
        rol: usuario.rol || "Empleado",
      });
      setEditarUsuario(id);
      setMostrarFormulario(true);
    }
  };

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede revertir.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/eliminar/usuarios/${id}`);
        obtenerUsuarios();
        Swal.fire("Eliminado", "Usuario eliminado correctamente", "success");
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
      }
    }
  };

  const LimpiarFormulario = () => {
    setFormularioDatos(initialFormState);
  };

  const handleSearchChange = (e, { value }) => {
    setSearchTerm(value.toLowerCase());
  };

  const filteredItems = usuarios.filter(
    (item) =>
      (item.documento ?? "").toString().toLowerCase().includes(searchTerm) ||
      (item.nombre ?? "").toString().toLowerCase().includes(searchTerm) ||
      (item.username ?? "").toString().toLowerCase().includes(searchTerm) ||
      (item.ID_Estado
        ? Estados.find((estado) => estado.value === item.ID_Estado)?.text.toLowerCase() || ""
        : ""
      ).includes(searchTerm) ||
      (item.rol ?? "").toString().toLowerCase().includes(searchTerm)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <section>
      <div className="titulo">
        <p>Usuarios</p>
      </div>
      {mostrarFormulario && (
        <Form className="RegistroNuevo_Usuario" onSubmit={handleSubmit}>
          <Form.Group widths="equal">
            <Form.Input
              label="Documento"
              name="documento"
              value={formularioDatos.documento}
              onChange={handleChange}
              required
            />
            <Form.Input
              label="Nombre"
              name="nombre"
              value={formularioDatos.nombre}
              onChange={handleChange}
              required
            />
            <Form.Input
              label="Usuario"
              name="username"
              value={formularioDatos.username}
              onChange={handleChange}
              type="email"
              required
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Input
              label="Password"
              name="password"
              type="password"
              value={formularioDatos.password}
              onChange={handleChange}
            />
            <Form.Field required>
              <label>Teléfono</label>
              <InputMask
                mask="(999) 999-9999"
                name="telefono"
                placeholder="(999) 999-9999"
                value={formularioDatos.telefono}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Estado</label>
              <Select
                options={Estados}
                name="ID_Estado"
                value={formularioDatos.ID_Estado}
                onChange={(e, data) => handleChange(null, data)}
                required
              />
            </Form.Field>
            <Form.Field>
              <label>Rol</label>
              <Select
                options={Roles}
                name="rol"
                value={formularioDatos.rol}
                onChange={(e, data) => handleChange(null, data)}
                required
              />
            </Form.Field>
          </Form.Group>
          <Button type="submit" color="green">
            {editarUsuario ? "Actualizar" : "Registrar"}
          </Button>
          <Button
            type="button"
            color="red"
            onClick={() => {
              setMostrarFormulario(false);
              setEditarUsuario(null);
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
            <i className="pi pi-plus" /> Usuario
          </Button>
        </div>
      </div>
      <article className="Dasboard"></article>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Documento</Table.HeaderCell>
            <Table.HeaderCell>Nombre</Table.HeaderCell>
            <Table.HeaderCell>Usuario</Table.HeaderCell>
            <Table.HeaderCell>Rol</Table.HeaderCell>
            <Table.HeaderCell>Estado</Table.HeaderCell>
            <Table.HeaderCell>Teléfono</Table.HeaderCell>
            <Table.HeaderCell>Acciones</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentItems.map((usuario, index) => (
            <Table.Row key={usuario.id}>
              <Table.Cell>{index + 1 + indexOfFirstItem}</Table.Cell>
              <Table.Cell>{usuario.documento}</Table.Cell>
              <Table.Cell>{usuario.nombre}</Table.Cell>
              <Table.Cell>{usuario.username}</Table.Cell>
              <Table.Cell>{usuario.rol}</Table.Cell>
              <Table.Cell>
                {
                  Estados.find((estado) => estado.value === usuario.ID_Estado)
                    ?.text || "Desconocido"
                }
              </Table.Cell>
              <Table.Cell>{usuario.telefono}</Table.Cell>
              <Table.Cell>
                <Button
                  icon
                  color="blue"
                  onClick={() => handleEditar(usuario.id)}
                >
                  <Icon name="edit" />
                </Button>
                <Button
                  icon
                  color="red"
                  onClick={() => handleEliminar(usuario.id)}
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
        totalPages={Math.ceil(usuarios.length / itemsPerPage)}
        handlePageChange={setCurrentPage}
      />
    </section>
  );
}

export default Usuarios;