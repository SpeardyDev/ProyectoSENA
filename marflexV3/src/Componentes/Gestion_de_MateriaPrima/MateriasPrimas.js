import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { FormGroup, FormField, Button, Divider, Form, Search, TableRow, TableHeaderCell, TableHeader, TableCell, TableBody, Table, Select } from 'semantic-ui-react';
import 'primeicons/primeicons.css';
import axios from 'axios';
import Pagination from '../Pagination';

const MateriasPrimas = () => {
  const [Productos, setProductos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formularioDatos, setFormularioDato] = useState({
    Nombre: "",
    Descripcion: "",
    Cantidad: "",
    Categoria: "",
    TblProveedorID: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); 
  const [editandoID, setEditandoID] = useState(null);

  useEffect(() => {
    mostrarProductos();
  }, []);

  const [Proveedores, setProveedores] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:3000/api/proveedores')
      .then(response => setProveedores(response.data))
      .catch(error => console.error('Error al obtener los proveedores:', error));
  }, []);

  const mostrarProductos = () => {
    axios.get('http://localhost:3000/api/materiasprimas')
      .then(response => setProductos(response.data))
      .catch(error => console.error('Error al obtener los datos:', error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormularioDato({ ...formularioDatos, [name]: value });
  };

  const handleSelectChange = (e, { name, value }) => {
    setFormularioDato({ ...formularioDatos, [name]: value });
  };

  const AgregarMateriaPrima = (e) => {
    e.preventDefault();
    if (editandoID) {
      axios
        .put(`http://localhost:3000/api/materiasprimas/editar/${editandoID}`, formularioDatos)
        .then((response) => {
          console.log(response.data);
          setMostrarFormulario(false);
          mostrarProductos();
          Swal.fire({
            position: "top-center",
            icon: "success",
            title: "Registro actualizado con éxito.",
            showConfirmButton: false,
            timer: 1500,
          });
          setEditandoID(null); 
          limpiarFormulario(); 
        })
        .catch((error) => console.error("Error al editar los datos:", error));
    } else {
      axios
        .post("http://localhost:3000/api/materiasprimas/agregar", formularioDatos)
        .then((response) => {
          console.log(response.data);
          setMostrarFormulario(false);
          mostrarProductos();
          Swal.fire({
            position: "top-center",
            icon: "success",
            title: "Registro guardado con éxito.",
            showConfirmButton: false,
            timer: 1500,
          });
          limpiarFormulario(); 
        })
        .catch((error) => console.error("Error al insertar los datos:", error));
    }
  };

  const limpiarFormulario = () => {
    setFormularioDato({
      Nombre: "",
      Descripcion: "",
      Cantidad: "",
      Categoria: "",
      TblProveedorID: ""
    });
  };

  const Eliminar = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, elimínalo!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3000/api/materiasprimas/borrar/${id}`)
          .then(response => {
            console.log(response.data);
            mostrarProductos();
            Swal.fire({
              title: "¡Eliminado!",
              text: "Esta materia prima ha sido eliminada con éxito.",
              icon: "success"
            });
          })
          .catch(error => console.error('Error al eliminar los datos:', error));
      }
    });
  };

  const Editar = (id) => {
    const producto = Productos.find((item) => item.ID === id);
    if (producto) {
      setFormularioDato({
        Nombre: producto.Nombre,
        Descripcion: producto.Descripcion,
        Cantidad: producto.Cantidad,
        Categoria: producto.Categoria,
        TblProveedorID: producto.TblProveedorID,
      });
      setEditandoID(id);
      setMostrarFormulario(true); 
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Productos.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="contenedor-Productos">
      <div className='titulo'><p>Materias Primas</p></div>
      {mostrarFormulario && (
        <Form className='RegistroNuevoProveedor' onSubmit={AgregarMateriaPrima}>
          <div className='contenedor_formulario_Proveedores'>
            <FormGroup widths='equal'>
              <FormField
                value={formularioDatos.Nombre}
                onChange={handleChange}
                placeholder='Nombre'
                control='input'
                label='Nombre'
                name="Nombre"
                required
              />
              <FormField
                name="Cantidad"
                value={formularioDatos.Cantidad}
                onChange={handleChange}
                label='Cantidad'
                control='input'
                placeholder='Cantidad'
                required
              />
            </FormGroup>
            <FormGroup widths='equal'>
              <FormField
                name="Categoria"
                value={formularioDatos.Categoria}
                onChange={handleChange}
                label='Categoria'
                control='input'
                placeholder='Categoria'
                required
              />
              <FormField
                name="Descripcion"
                value={formularioDatos.Descripcion}
                onChange={handleChange}
                label='Descripcion'
                control='input'
                placeholder='Descripcion'
                required
              />
            </FormGroup>
            <FormGroup widths='equal'>
              <FormField required>
                <label>Proveedor</label>
                <Select placeholder='Selecciona Proveedor' onChange={handleSelectChange} name='TblProveedorID' value={formularioDatos.TblProveedorID} options={Proveedores.map(Proveedor => ({ key: Proveedor.ID, value: Proveedor.ID, text: Proveedor.Nombre }))} />
              </FormField>
            </FormGroup>
            <Button type='submit' color='green'>{editandoID ? 'Actualizar' : 'Registrar'}</Button>
            <button type="button" className="btn btn-danger" onClick={() => { setMostrarFormulario(false); setEditandoID(null); limpiarFormulario(); }}>Cancelar</button>
            <Divider hidden />
          </div>
        </Form>
      )}
      <div className="Filtro">
        <div className="contenedor-1">
          <Search placeholder="Código" />
          <span className="icon-text">
            <i className="pi pi-filter" style={{ fontSize: '1.5rem' }}></i>
            <span>Filtro</span>
          </span>
        </div>
        <div className="contenedor-2">
          <span className="icon-text">
            <i className="pi pi-tag" style={{ fontSize: '1.5rem' }}></i>
            <span>Categorías</span>
          </span>
          <span className="icon-text">
            <i className="pi pi-upload" style={{ fontSize: '1.5rem' }}></i>
            <span>Exportar</span>
          </span>
          <Button onClick={() => setMostrarFormulario(!mostrarFormulario)} color='green'><i className="pi pi-plus" /> Materia Prima</Button>
        </div>
      </div>
      <article className="dasboard-productos"></article>
      <Table celled>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>#</TableHeaderCell>
            <TableHeaderCell>Nombre</TableHeaderCell>
            <TableHeaderCell>Cantidad</TableHeaderCell>
            <TableHeaderCell>Categoria</TableHeaderCell>
            <TableHeaderCell>Descripcion</TableHeaderCell>
            <TableHeaderCell>Proveedor</TableHeaderCell>
            <TableHeaderCell></TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((producto, index) => (
            <TableRow key={producto.ID}>
              <TableCell>{producto.ID}</TableCell>
              <TableCell>{producto.Nombre}</TableCell>
              <TableCell>{producto.Cantidad}</TableCell>
              <TableCell>{producto.Categoria}</TableCell>
              <TableCell>{producto.Descripcion}</TableCell>
              <TableCell>{producto.TblProveedorID}</TableCell>
              <TableCell>
                <Button icon onClick={() => Editar(producto.ID)} color="blue"><FontAwesomeIcon icon={faPenToSquare} />Editar</Button>
                <Button icon onClick={() => Eliminar(producto.ID)} color="red"><FontAwesomeIcon icon={faTrashCan} />Eliminar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={Productos.length}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default MateriasPrimas;
