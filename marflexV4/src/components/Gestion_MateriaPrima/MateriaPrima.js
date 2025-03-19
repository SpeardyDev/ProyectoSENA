import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Button, Form, Search, Table, Icon } from 'semantic-ui-react';
import "../Gestion_MateriaPrima/styles/MateriaPrima.css";
import axios from 'axios';
import Pagination from '../Pagination';
import './styles/MateriaPrima.css'

const MateriasPrimas = () => {
  const [materiasp, setMateriasp] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formularioDatos, setFormularioDatos] = useState({
    Nombre: "",
    Descripcion: "",
    Stock: "",
    Unidad: ""
  });
  const [editandoID, setEditandoID] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  useEffect(() => {
    mostrarProductos();
  }, []);

  const mostrarProductos = () => {
    axios.get('http://localhost:3000/materia_prima')
      .then(response => setMateriasp(response.data))
      .catch(error => console.error('Error al obtener los datos:', error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormularioDatos({ ...formularioDatos, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editandoID
      ? `http://localhost:3000/actualizar/materia_prima/${editandoID}`
      : "http://localhost:3000/agregar/materia_prima";

    const method = editandoID ? axios.put : axios.post;

    method(url, formularioDatos)
      .then(() => {
        setMostrarFormulario(false);
        setEditandoID(null);
        mostrarProductos();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: editandoID ? "Registro actualizado con éxito." : "Registro guardado con éxito.",
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
      confirmButtonText: "Sí, eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3000/eliminar/materia_prima/${id}`)
          .then(() => {
            mostrarProductos();
            Swal.fire("Eliminado!", "El registro ha sido eliminado.", "success");
          })
          .catch(error => console.error('Error al eliminar:', error));
      }
    });
  };

  const handleEditar = (id) => {
    const producto = materiasp.find(item => item.ID === id);
    if (producto) {
      setFormularioDatos({
        Nombre: producto.Nombre,
        Descripcion: producto.Descripcion,
        Stock: producto.Stock,
        Unidad: producto.Unidad
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
      Unidad: ""
    });
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = materiasp.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div className='Titulo'><p>Materias Primas</p></div>
      {mostrarFormulario && (
        <Form className='RegistroNuevo_MateriaPrima' onSubmit={handleSubmit}>
          <Form.Group widths='equal'>
            <Form.Input label='Nombre' name="Nombre" value={formularioDatos.Nombre} onChange={handleChange} required />
            <Form.Input label='Stock' name="Stock" value={formularioDatos.Stock} onChange={handleChange} required />
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Input label='Descripción' name="Descripcion" value={formularioDatos.Descripcion} onChange={handleChange} required />
            <Form.Input label='Unidad' name="Unidad" value={formularioDatos.Unidad} onChange={handleChange} required />
          </Form.Group>
          <Button type='submit' color='green'>{editandoID ? 'Actualizar' : 'Registrar'}</Button>
          <Button type='button' color='red' onClick={() => { setMostrarFormulario(false); setEditandoID(null); LimpiarFormulario();}}>Cancelar</Button>
        </Form>
      )}
      <div className="Filtro">
        <div className="Contenedor-1">
          <Search placeholder="Código" />
          <span className="icon-text">
            <i className="pi pi-filter" style={{ fontSize: '1.5rem' }}></i>
            <span>Filtro</span>
          </span>
        </div>
        <div className="Contenedor-2">
          <span className="icon-text">
            <i className="pi pi-tag" style={{ fontSize: '1.5rem' }}></i>
            <span>Categorías</span>
          </span>
          <span className="icon-text">
            <i className="pi pi-upload" style={{ fontSize: '1.5rem' }}></i>
            <span>Exportar</span>
          </span>
          <Button onClick={() => {setMostrarFormulario(!mostrarFormulario); LimpiarFormulario();}} color='green'><i className="pi pi-plus" /> Materia Prima</Button>
        </div>
      </div>
      <article className="Dasboard"></article>
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
          {currentItems.map(producto => (
            <Table.Row key={producto.ID}>
              <Table.Cell>{producto.ID}</Table.Cell>
              <Table.Cell>{producto.Nombre}</Table.Cell>
              <Table.Cell>{producto.Stock}</Table.Cell>
              <Table.Cell>{producto.Unidad}</Table.Cell>
              <Table.Cell>{producto.Descripcion}</Table.Cell>
              <Table.Cell>
                <Button icon color="blue" onClick={() => handleEditar(producto.ID)}>
                  <Icon name='edit' />
                </Button>
                <Button icon color="red" onClick={() => handleEliminar(producto.ID)}>
                  <Icon name='trash' />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(materiasp.length / itemsPerPage)}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default MateriasPrimas;