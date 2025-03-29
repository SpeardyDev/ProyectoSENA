import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Button, Form, Table, Dropdown, Search, Icon } from 'semantic-ui-react';
import axios from 'axios';
import Pagination from '../Pagination';
import './styles/Movimientos.css';

const Movimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formularioDatos, setFormularioDatos] = useState({
    ID_MateriaPrima: "",
    Tipo: "",
    Cantidad: "",
    ID_Proveedor: "",
    Fecha: new Date().toISOString().slice(0, 10)
  });
  const [editandoID, setEditandoID] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    mostrarMovimientos();
    obtenerMateriasPrimas();
    obtenerProveedores();
  });

  const mostrarMovimientos = () => {
    axios
      .get("http://localhost:3000/movimientos")
      .then((response) => {
        const movimientosConNombres = response.data.map(movimiento => {
          const materiaPrima = materiasPrimas.find(mp => mp.value === movimiento.ID_MateriaPrima);
          const proveedor = proveedores.find(p => p.value === movimiento.ID_Proveedor);
  
          return {
            ...movimiento,
            NombreMateriaPrima: materiaPrima ? materiaPrima.text : "Desconocido",
            NombreProveedor: proveedor ? proveedor.text : "Desconocido"
          };
        });
  
        setMovimientos(movimientosConNombres);
      })
      .catch((error) => console.error("Error al obtener los movimientos:", error));
  };

  const obtenerMateriasPrimas = () => {
    axios.get('http://localhost:3000/materia_prima')
      .then(response => setMateriasPrimas(response.data))
      .catch(error => console.error('Error al obtener las materias primas:', error));
  };

  const obtenerProveedores = () => {
    axios.get('http://localhost:3000/proveedores')
      .then(response => setProveedores(response.data))
      .catch(error => console.error('Error al obtener los proveedores:', error));
  };

  const handleChange = (e, { name, value }) => {
    setFormularioDatos(prevState => ({
      ...prevState,
      [name]: e.target ? e.target.value : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editandoID
      ? `http://localhost:3000/actualizar/movimientos/${editandoID}`
      : "http://localhost:3000/agregar/movimientos";

    const method = editandoID ? axios.put : axios.post;

    method(url, formularioDatos)
      .then(() => {
        setMostrarFormulario(false);
        setEditandoID(null);
        mostrarMovimientos();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: editandoID ? "Movimiento actualizado con éxito." : "Movimiento registrado con éxito.",
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
        axios.delete(`http://localhost:3000/eliminar/movimientos/${id}`)
          .then(() => {
            mostrarMovimientos();
            Swal.fire("Eliminado!", "El registro ha sido eliminado.", "success");
          })
          .catch(error => console.error('Error al eliminar:', error));
      }
    });
  };

  const handleEditar = (id) => {
    const movimiento = movimientos.find(item => item.ID === id);
    if (movimiento) {
      setFormularioDatos({
        ID_MateriaPrima: movimiento.ID_MateriaPrima,
        Tipo: movimiento.Tipo,
        Cantidad: movimiento.Cantidad,
        ID_Proveedor: movimiento.ID_Proveedor,
        Fecha: movimiento.Fecha ? new Date(movimiento.Fecha).toISOString().slice(0, 10) : ""
      });
      setEditandoID(id);
      setMostrarFormulario(true);
    }
  };

  const LimpiarFormulario = () => {
    setFormularioDatos({
      ID_MateriaPrima: "",
      Tipo: "",
      Cantidad: "",
      ID_Proveedor: "",
      Fecha: ""
    });
  };

  const handleSearchChange = (e, { value }) => {
    setSearchTerm(value.toLowerCase());
  };

  const filteredItems = movimientos.filter(item =>
    item.ID.toString().includes(searchTerm) ||
    item.NombreMateriaPrima.toLowerCase().includes(searchTerm) || // Buscar por nombre de materia prima
    item.Tipo.toLowerCase().includes(searchTerm) ||
    item.NombreProveedor.toLowerCase().includes(searchTerm) // Buscar por nombre del proveedor
  );

  const handlePageChange = (page) => setCurrentPage(page);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);


  return (
    <div>
      <div className='Titulo'><p>Movimientos</p></div>
      {mostrarFormulario && (
        <Form className='RegistroNuevo_Movimiento' onSubmit={handleSubmit}>
        <Form.Group widths='equal'>
          <Form.Field>
          <label>Materia Prima</label>
          <Dropdown
            placeholder='Selecciona Materia Prima'
            fluid
            selection
            options={materiasPrimas.map(mp => ({ key: mp.ID, text: mp.Nombre, value: mp.ID }))}
            name='ID_MateriaPrima'
            onChange={handleChange}
            value={formularioDatos.ID_MateriaPrima}
            required
          />
          </Form.Field>
          <Form.Field>
          <label>Tipo Movimiento</label>
          <Dropdown
            placeholder='Tipo de Movimiento'
            fluid
            selection
            options={[{ key: 'entrada', text: 'Entrada', value: 'entrada' }, { key: 'salida', text: 'Salida', value: 'salida' }]}
            name='Tipo'
            onChange={handleChange}
            value={formularioDatos.Tipo}
            required
          />
          </Form.Field>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Input label='Cantidad' name='Cantidad' type='number' value={formularioDatos.Cantidad} onChange={handleChange} required />
          <Form.Field>
          <label>Proveedor</label>
          <Dropdown
            placeholder='Selecciona Proveedor'
            fluid
            selection
            options={proveedores.map(p => ({ key: p.ID, text: p.Nombre, value: p.ID }))}
            name='ID_Proveedor'
            onChange={handleChange}
            value={formularioDatos.ID_Proveedor}
          />
          </Form.Field>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Input label='Fecha' name='Fecha' type='date' value={formularioDatos.Fecha} onChange={(e) => setFormularioDatos({ ...formularioDatos, Fecha: e.target.value })} required />
        </Form.Group>
        <Button type='submit' color='green'>{editandoID ? 'Actualizar' : 'Registrar'}</Button>
        <Button type='button' color='red' onClick={() => { setMostrarFormulario(false); setEditandoID(null); LimpiarFormulario(); }}>Cancelar</Button>
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
            <Table.HeaderCell>Materia Prima</Table.HeaderCell>
            <Table.HeaderCell>Tipo</Table.HeaderCell>
            <Table.HeaderCell>Cantidad</Table.HeaderCell>
            <Table.HeaderCell>Proveedor</Table.HeaderCell>
            <Table.HeaderCell>Fecha</Table.HeaderCell>
            <Table.HeaderCell>Acciones</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentItems.map(mov => (
            <Table.Row key={mov.ID}>
              <Table.Cell>{mov.ID}</Table.Cell>
              <Table.Cell>{materiasPrimas.find(mp => mp.ID === mov.ID_MateriaPrima)?.Nombre || 'Desconocido'}</Table.Cell>
              <Table.Cell>{mov.Tipo}</Table.Cell>
              <Table.Cell>{mov.Cantidad}</Table.Cell>
              <Table.Cell>{proveedores.find(prov => prov.ID === mov.ID_Proveedor)?.Nombre || 'N/A'}</Table.Cell>
              <Table.Cell>{new Date(mov.Fecha).toISOString().slice(0, 10)}</Table.Cell>
              <Table.Cell>
                <Button icon color="blue" onClick={() => handleEditar(mov.ID)}><Icon name="edit" /></Button>
                <Button icon color="red" onClick={() => handleEliminar(mov.ID)}>
                  <Icon name='trash' />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(movimientos.length / itemsPerPage)}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default Movimientos;