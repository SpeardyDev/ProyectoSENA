import axios from 'axios';
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import './styles/Proveedores.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPenToSquare} from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormField, Button, Divider, Form, Search, TableRow, TableHeaderCell, TableHeader, TableCell, TableBody, Table } from 'semantic-ui-react';
import Pagination from '../Pagination';
import { InputMask } from "primereact/inputmask";

function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formularioDatos, setFormularioDato] = useState({
    Nombre: '',
    Telefono1: '',
    Telefono2: 'N/A',
    Direccion: '',
    Barrio: '',
    Ciudad: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); 

  useEffect(() => {
    mostrarProveedores();
  }, []);

  const mostrarProveedores = () => {
    axios.get('http://localhost:3000/api/proveedores')
      .then(respuesta => setProveedores(respuesta.data))
      .catch(error => console.error('Error al obtener los datos:', error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormularioDato({ ...formularioDatos, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/api/agregar', formularioDatos)
      .then(response => {
        console.log(response.data);
        setMostrarFormulario(false);
        mostrarProveedores(); 
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Registro ha sido guardado con éxito.",
          showConfirmButton: false,
          timer: 1500
        });
      })
      .catch(error => console.error('Error al insertar los datos:', error));
  };

  const BtnEliminar = (id) => {
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
        axios.delete(`http://localhost:3000/api/proveedores/${id}`)
          .then(response => {
            console.log(response.data);
            mostrarProveedores(); 
            Swal.fire({
              title: "¡Eliminado!",
              text: "Este proveedor ha sido eliminado con éxito.",
              icon: "success"
            });
          })
          .catch(error => console.error('Error al eliminar los datos:', error));
      }
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = proveedores.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <section>
      <div className='titulo'>
        <p>Proveedores</p>
      </div>

      {mostrarFormulario && (
        <Form className='RegistroNuevoProveedor' onSubmit={handleSubmit}>
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
              <FormField required>
              <label>Telefono 1</label>
              <InputMask id="phone" mask="(999) 999-9999" name="Telefono1" placeholder="(999) 999-9999" value={formularioDatos.Telefono1} onChange={handleChange}></InputMask>
              </FormField>
               
            </FormGroup>
            <FormGroup widths='equal'>
            <FormField>
              <label>Telefono 2</label>
              <InputMask id="phone" mask="(999) 999-9999" name="Telefono2" placeholder="(999) 999-9999" value={formularioDatos.Telefono2} onChange={handleChange}></InputMask>
              </FormField>
              <FormField
                name="Direccion" 
                value={formularioDatos.Direccion} 
                onChange={handleChange}
                label='Dirección'
                control='input'
                placeholder='Dirección'
                required
              />
            </FormGroup>
            <FormGroup widths='equal'>
              <FormField
                name="Barrio" 
                value={formularioDatos.Barrio} 
                onChange={handleChange}
                label='Barrio'
                control='input'
                placeholder='Barrio'
                required
              />
              <FormField
                name="Ciudad" 
                value={formularioDatos.Ciudad} 
                onChange={handleChange}
                label='Ciudad'
                control='input'
                placeholder='Ciudad'
              />
            </FormGroup>
            <Button type='submit' color='green'>Registrar</Button>
            <button type="button" className="btn btn-danger" onClick={() => setMostrarFormulario(!mostrarFormulario)}>Cancelar</button>
            <Divider hidden />
          </div>
        </Form>
      )}
       

      <div className="Filtro">
      <div className="contenedor-1">
      <Search placeholder="Codigo"/>
      <span className="icon-text">
        <i className="pi pi-filter" style={{ fontSize: '1.5rem' }}></i>
        <span className='texto-filtro'>Filtro</span>
    </span>
      </div>
      <div className="contenedor-2">
      <span className="icon-text">
        <i className="pi pi-tag" style={{ fontSize: '1.5rem'}}></i>
        <span>Categorías</span>
    </span>
    <span className="icon-text">
        <i className="pi pi-upload" style={{ fontSize: '1.5rem' }}></i>
        <span>Exportar</span>
    </span>
    <Button onClick={() => setMostrarFormulario(!mostrarFormulario)} color='green'><i className="pi pi-plus" /> Proveedor</Button>
      </div>
    </div>
    <article className="dasboard-productos"></article>
    <Table celled>
    <TableHeader>
      <TableRow>
      <TableHeaderCell>#</TableHeaderCell>
        <TableHeaderCell>Nombre</TableHeaderCell>
        <TableHeaderCell>Teléfono 1</TableHeaderCell>
        <TableHeaderCell>Teléfono 2</TableHeaderCell>
        <TableHeaderCell>Dirección</TableHeaderCell>
        <TableHeaderCell>Barrio</TableHeaderCell>
        <TableHeaderCell>Ciudad</TableHeaderCell>
        <TableHeaderCell></TableHeaderCell>
      </TableRow>
    </TableHeader>

    <TableBody>
    {currentItems.map((proveedor, index) => (
          <TableRow key={proveedor.ID}>
            <TableCell className='ID_tabla'>{index + 1 + indexOfFirstItem}</TableCell>
            <TableCell>{proveedor.Nombre}</TableCell>
            <TableCell>{proveedor.Telefono1}</TableCell>
            <TableCell>{proveedor.Telefono2}</TableCell>
            <TableCell>{proveedor.Direccion}</TableCell>
            <TableCell>{proveedor.Barrio}</TableCell>
            <TableCell>{proveedor.Ciudad}</TableCell>
            <TableCell className='conten-Btn'>
            <button type="button" className="btn btn-primary"><FontAwesomeIcon className='Icon' icon={faPenToSquare} /> <p className='texto-p'>Editar</p></button>
            <button type="button" className="btn btn-danger" onClick={() => BtnEliminar(proveedor.ID)}><FontAwesomeIcon className='Icon' icon={faTrashCan} /><p className='texto-p'>Eliminar</p></button>
            </TableCell>
          </TableRow>
          ))}
      </TableBody>
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

