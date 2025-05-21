import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Button, Form, Search, Table, Icon } from "semantic-ui-react";
import axios from "axios";
import socket from "../../socket";
import Pagination from "../Pagination";
import "./styles/MateriaPrima.css";

// Centraliza la URL del backend
const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

const MateriasPrimas = () => {
  const [materiasp, setMateriasp] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formularioDatos, setFormularioDatos] = useState({
    Nombre: "",
    Descripcion: "",
    Stock: "",
    Unidad: "",
  });
  const [editandoID, setEditandoID] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const socketListeners = [];

    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${backendUrl}/materia_prima`);
        if (isMounted) {
          setMateriasp(response.data);
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        if (isMounted) {
          Swal.fire({
            title: 'Error',
            text: 'No se pudieron cargar los datos',
            icon: 'error'
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const setupSocket = () => {
      const handlers = {
        connect: () => {
          console.log("🟢 Conectado al servidor Socket.IO", socket.id);
          if (isMounted) setIsConnected(true);
        },
        disconnect: (reason) => {
          console.log("🔴 Desconectado. Razón:", reason);
          if (isMounted) setIsConnected(false);
        },
        materia_prima_actualizada: (data) => {
          console.log("📦 Recibida actualización:", data);
          if (isMounted) {
            setMateriasp(prev => {
              const exists = prev.some(item => item.ID === data.ID);
              return exists 
                ? prev.map(item => item.ID === data.ID ? data : item)
                : [...prev, data];
            });
          }
        },
        materia_prima_eliminada: (id) => {
          console.log("🗑️ Recibida eliminación:", id);
          if (isMounted) {
            setMateriasp(prev => prev.filter(item => Number(item.ID) !== Number(id)));
          }
        }
      };

      Object.entries(handlers).forEach(([event, handler]) => {
        socket.on(event, handler);
        socketListeners.push({ event, handler });
      });

      return handlers;
    };

    setupSocket();
    loadInitialData();

    return () => {
      isMounted = false;
      socketListeners.forEach(({ event, handler }) => {
        socket.off(event, handler);
      });
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormularioDatos(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formularioDatos.Nombre || !formularioDatos.Unidad) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error',
        text: 'Nombre y Unidad son campos requeridos',
        showConfirmButton: true
      });
      setLoading(false);
      return;
    }

    const datosEnviar = {
      ...formularioDatos,
      Stock: Number(formularioDatos.Stock) || 0
    };

    try {
      const url = editandoID
        ? `${backendUrl}/actualizar/materia_prima/${editandoID}`
        : `${backendUrl}/agregar/materia_prima`;

      const requestMethod = editandoID ? axios.put : axios.post;

      const { data } = await requestMethod(url, datosEnviar);

      if (data.success) {
        setMostrarFormulario(false);
        setEditandoID(null);
        setFormularioDatos({
          Nombre: "",
          Descripcion: "",
          Stock: "",
          Unidad: "",
        });

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: data.message || (editandoID ? "Actualizado" : "Agregado"),
          showConfirmButton: false,
          timer: 1500,
          toast: true
        });
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error',
          text: data.message || "Operación fallida",
          showConfirmButton: true
        });
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      const errorMsg = error.response?.data?.message || "Error al procesar la solicitud";
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error',
        text: errorMsg,
        showConfirmButton: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axios.delete(`${backendUrl}/eliminar/materia_prima/${id}`);

          if (data.success) {
            Swal.fire({
              position: 'top-end',
              title: 'Eliminado!',
              text: data.message,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
              toast: true
            });
            // El socket se encarga de actualizar la lista
          } else {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error',
              text: data.message || "No se pudo eliminar",
              showConfirmButton: true
            });
          }
        } catch (error) {
          console.error("Error al eliminar:", error);
          const errorMsg = error.response?.data?.message || "Error al intentar eliminar el registro";
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error',
            text: errorMsg,
            showConfirmButton: true
          });
        }
      }
    });
  };

  const handleEditar = (id) => {
    const producto = materiasp.find((item) => item.ID === id);
    if (producto) {
      setFormularioDatos({
        Nombre: producto.Nombre,
        Descripcion: producto.Descripcion,
        Stock: producto.Stock,
        Unidad: producto.Unidad,
      });
      setEditandoID(id);
      setMostrarFormulario(true);
    }
  };

  const LimpiarFormulario = () => {
    setFormularioDatos({
      Nombre: "",
      Descripcion: "",
      Stock: "",
      Unidad: "",
    });
  };

  const handleSearchChange = (e, { value }) => {
    setSearchTerm(value.toLowerCase());
  };

  const filteredItems = materiasp.filter(
    (item) =>
      item.ID.toString().includes(searchTerm) ||
      item.Nombre.toLowerCase().includes(searchTerm) ||
      item.Descripcion.toLowerCase().includes(searchTerm)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      {isLoading ? (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Cargando materias primas...</p>
        </div>
      ) : (
        <>
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
          </div>
          <div className="Titulo">
            <p>Materias Primas</p>
          </div>

          {mostrarFormulario && (
            <Form className="RegistroNuevo_MateriaPrima" onSubmit={handleSubmit}>
              <Form.Group widths="equal">
                <Form.Input
                  label="Nombre"
                  name="Nombre"
                  value={formularioDatos.Nombre}
                  onChange={handleChange}
                  required
                />
                <Form.Input
                  label="Stock"
                  name="Stock"
                  value={formularioDatos.Stock}
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
                  label="Unidad"
                  name="Unidad"
                  value={formularioDatos.Unidad}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Button type="submit" color="green" loading={loading}>
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
                <i className="pi pi-plus" /> Materia Prima
              </Button>
            </div>
          </div>

          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>#</Table.HeaderCell>
                <Table.HeaderCell>Nombre</Table.HeaderCell>
                <Table.HeaderCell>Stock</Table.HeaderCell>
                <Table.HeaderCell>Unidad</Table.HeaderCell>
                <Table.HeaderCell>Descripción</Table.HeaderCell>
                <Table.HeaderCell>Acciones</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {currentItems.map((producto) => (
                <Table.Row key={producto.ID}>
                  <Table.Cell>{producto.ID}</Table.Cell>
                  <Table.Cell>{producto.Nombre}</Table.Cell>
                  <Table.Cell>{producto.Stock}</Table.Cell>
                  <Table.Cell>{producto.Unidad}</Table.Cell>
                  <Table.Cell>{producto.Descripcion}</Table.Cell>
                  <Table.Cell>
                    <Button icon color="blue" onClick={() => handleEditar(producto.ID)}>
                      <Icon name="edit" />
                    </Button>
                    <Button icon color="red" onClick={() => handleEliminar(producto.ID)}>
                      <Icon name="trash" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredItems.length / itemsPerPage)}
            handlePageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default MateriasPrimas;