import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Button, Form, Table, Icon, Dropdown, Search } from "semantic-ui-react";
import axios from "axios";
import Pagination from "../Pagination";
import "./styles/solicitudes.css";

const SolicitudEmp = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formularioDatos, setFormularioDatos] = useState({
    ID_Usuario: "",
    ID_MateriaPrima: "",
    Cantidad_Solicitada: "",
    Estado: "Pendiente",
    Motivo_Rechazo: "",
  });
  const [editandoID, setEditandoID] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const usuarioLogueado = localStorage.getItem("nombre");
const opcionesUsuario = [
  {
    key: 1,
    text: usuarioLogueado,
    value: usuarioLogueado, 
  }
];


  useEffect(() => {
    mostrarSolicitudes();
    obtenerUsuarios();
    obtenerMateriasPrimas();
  }, []);

  const mostrarSolicitudes = () => {
    axios
      .get("http://localhost:3000/solicitudes_materia_prima")
      .then((response) => {
        setSolicitudes(response.data);
      })
      .catch((error) =>
        console.error("Error al obtener las solicitudes:", error)
      );
  };

  const obtenerUsuarios = async () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormularioDatos({ ...formularioDatos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userData = {
      Nombre: localStorage.getItem("nombre")?.trim() || "",
      Username: localStorage.getItem("username")?.trim() || "",
      Rol: localStorage.getItem("rol")?.trim() || "",
      FotoPerfil: localStorage.getItem("fotoPerfil")?.trim() || ""
    };
    
  
    try {
      const response = await axios.post("http://localhost:3000/verificar-o-registrar", userData);
      const userID = response.data.ID;
  
      const updatedData = {
        ...formularioDatos,
        ID_Usuario: userID
      };
  
      const url = editandoID
        ? `http://localhost:3000/actualizar/solicitudes_materia_prima/${editandoID}`
        : "http://localhost:3000/agregar/solicitudes_materia_prima";
  
      const method = editandoID ? axios.put : axios.post;
      await method(url, updatedData);
  
      setMostrarFormulario(false);
      setEditandoID(null);
      mostrarSolicitudes();
  
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: editandoID ? "Registro actualizado con éxito." : "Registro guardado con éxito.",
        showConfirmButton: false,
        timer: 1500,
      });
      mostrarSolicitudes();
    } catch (error) {
      console.error("Error en el proceso:", error);
    }
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
          .delete(
            `http://localhost:3000/eliminar/solicitudes_materia_prima/${id}`
          )
          .then(() => {
            mostrarSolicitudes();
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
    const solicitud = solicitudes.find((item) => item.ID === id);
    if (solicitud) {
      setFormularioDatos({
        ID_Usuario: solicitud.ID_Usuario,
        ID_MateriaPrima: solicitud.ID_MateriaPrima,
        Cantidad_Solicitada: solicitud.Cantidad_Solicitada,
        Estado: solicitud.Estado,
        Motivo_Rechazo: solicitud.Motivo_Rechazo,
      });
      setEditandoID(id);
      setMostrarFormulario(true);
    }
  };

  const LimpiarFormulario = () => {
    setFormularioDatos({
      ID_Usuario: "",
      ID_MateriaPrima: "",
      Cantidad_Solicitada: "",
      Estado: "Pendiente",
      Motivo_Rechazo: "",
    });
  };

  const handleSearchChange = (e, { value }) => {
    setSearchTerm(value.toLowerCase());
  };

  const filteredItems = solicitudes.filter(item =>
    item.ID.toString().includes(searchTerm) 
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div className="Titulo">
        <p>Mis Solicitudes</p>
      </div>
      {mostrarFormulario && (
        <Form className="RegistroNuevo_Solicitud" onSubmit={handleSubmit}>
          <Form.Group widths="equal">
            <Form.Field>
              <label>Usuario</label>
              <Dropdown
                placeholder="Seleccionar Usuario"
                fluid
                selection
                options={opcionesUsuario}
                name="ID_Usuario"
                value={usuarioLogueado}
                disabled
              />
            </Form.Field>

            <Form.Field>
              <label>Materia Prima</label>
              <Dropdown
                placeholder="Seleccionar Materia Prima"
                fluid
                selection
                options={materiasPrimas}
                name="ID_MateriaPrima"
                value={formularioDatos.ID_MateriaPrima}
                onChange={(e, { name, value }) =>
                  setFormularioDatos({ ...formularioDatos, [name]: value })
                }
                required
              />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Input
              label="Cantidad Solicitada"
              type="number"
              name="Cantidad_Solicitada"
              value={formularioDatos.Cantidad_Solicitada}
              onChange={handleChange}
              required
            />
            <Form.Input
              label="Estado"
              type="text"
              name="Estado"
              value={formularioDatos.Estado}
              readOnly
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
            <i className="pi pi-plus" /> Solicitud
          </Button>
        </div>
      </div>
      <article className="Dasboard"></article>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Usuario</Table.HeaderCell>
            <Table.HeaderCell>Materia Prima</Table.HeaderCell>
            <Table.HeaderCell>Cantidad</Table.HeaderCell>
            <Table.HeaderCell>Estado</Table.HeaderCell>
            <Table.HeaderCell>Motivo Rechazo</Table.HeaderCell>
            <Table.HeaderCell>Acciones</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentItems.map((solicitud) => (
            <Table.Row key={solicitud.ID}>
              <Table.Cell>{solicitud.ID}</Table.Cell>
              <Table.Cell>
                {usuarios.find((m) => m.value === solicitud.ID_Usuario)?.text ||
                  "Desconocido"}
              </Table.Cell>
              <Table.Cell>
                {materiasPrimas.find(
                  (m) => String(m.value) === String(solicitud.ID_MateriaPrima)
                )?.text || "Desconocido"}
              </Table.Cell>
              <Table.Cell>{solicitud.Cantidad_Solicitada}</Table.Cell>
              <Table.Cell>{solicitud.Estado}</Table.Cell>
              <Table.Cell>{solicitud.Motivo_Rechazo || "Nulo"}</Table.Cell>
              <Table.Cell>
                <Button
                  icon
                  color="blue"
                  onClick={() => handleEditar(solicitud.ID)}
                >
                  <Icon name="edit" />
                </Button>
                <Button
                  icon
                  color="red"
                  onClick={() => handleEliminar(solicitud.ID)}
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
        totalPages={Math.ceil(solicitudes.length / itemsPerPage)}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default SolicitudEmp;