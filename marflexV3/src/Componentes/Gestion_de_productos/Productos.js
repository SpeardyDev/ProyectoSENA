import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPenToSquare} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import {  FormGroup, FormField, Button, Divider, Form, Search,TableRow, TableHeaderCell, TableHeader, TableCell, TableBody, Table, Select } from 'semantic-ui-react';
import './styles/Productos.css';
import 'primeicons/primeicons.css';
import axios from 'axios'
import Pagination from '../Pagination';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
      

const Productos = () => {
  const [Productos, setProductos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formularioDatos, setFormularioDato] = useState({
    Nombre: "",
    Descripcion: "",
    Precio: '', 
    Cantidad: '', 
    StockMinimo: '', 
    EstadoID: '', 
    Categoria: "",
    FechaIngreso: "",
    ProveedorID: '', 
  });
 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); 

  useEffect(() => {
    mostrarProductos();
  }, []);
//Obtener estados 
const [estados, setEstados] = useState([]);
useEffect(() => { 
  axios.get('http://localhost:3000/api/estados')
   .then(response => setEstados(response.data) )
    .catch(error => console.error('Error al obtener los estados:', error)); }, []);


  
    const mostrarProductos = () => {
    axios.get('http://localhost:3000/api/productos')
      .then(response => setProductos(response.data))
      .catch(error => console.error('Error al obtener los datos:', error));
  };

  const handleChange = (e) => { const { name, value } = e.target; setFormularioDato({ ...formularioDatos, [name]: value }); };
  const handleInputNumberChange = (name, value) => { setFormularioDato({ ...formularioDatos, [name]: value }); }; 
  const handleSelectChange = (e, { name, value }) => { setFormularioDato({ ...formularioDatos, [name]: value }); };
  
  
  const AgregarProductos = (e) => {
    e.preventDefault();
  
    
    const datosEnviados = {
      ...formularioDatos,
      Precio: parseFloat(formularioDatos.Precio),
      Cantidad: parseInt(formularioDatos.Cantidad, 10),
      StockMinimo: parseInt(formularioDatos.StockMinimo, 10),
      EstadoID: parseInt(formularioDatos.EstadoID, 10),
      ProveedorID: parseInt(formularioDatos.ProveedorID, 10),
    };
  
    axios.post('http://localhost:3000/api/agregar/productos', datosEnviados)
      .then(response => {
        console.log(response.data);
        setMostrarFormulario(false);
        mostrarProductos();
        limpiarFormulario()
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
  
///Btn eliminar productos
  const BtnEliminar = (id) => {
    console.log(`ID a eliminar: ${id}`); // Log adicional para verificar el ID
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
            const url = `http://localhost:3000/api/eliminar/productos/${id}`;
            console.log(`URL de eliminación: ${url}`); // Log adicional para verificar la URL
            axios.delete(url)
                .then(response => {
                    console.log(response.data);
                    mostrarProductos(); 
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
/// Limpa los inputs
const limpiarFormulario = () => {
  setFormularioDato({
    Nombre: "",
    Descripcion: "",
    Precio: '', 
    Cantidad: '', 
    StockMinimo: '', 
    EstadoID: '', 
    Categoria: "",
    FechaIngreso: "",
    ProveedorID: '', 
  });
};

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Productos.slice(indexOfFirstItem, indexOfLastItem);
  return (
    <div className="contenedor-Productos">
      <div className="titulo">
        <p>Productos</p>
      </div>
      {mostrarFormulario && (
        <Form className="RegistroNuevoProveedor" onSubmit={AgregarProductos}>
          <div className="contenedor_formulario_Proveedores">
            <FormGroup widths="equal">
              <FormField
                value={formularioDatos.Nombre}
                onChange={handleChange}
                placeholder="Nombre"
                control="input"
                label="Nombre"
                name="Nombre"
                required
              />
              <FormField
                name="Descripcion"
                value={formularioDatos.Descripcion}
                onChange={handleChange}
                label="Descripcion"
                control="input"
                placeholder="Descripcion"
                required
              />

              <FormField required>
                <label>Precio</label>
                <InputNumber
                  onChange={(e) => handleInputNumberChange("Precio", e.value)}
                  name="Precio"
                  value={formularioDatos.Precio}
                  placeholder="Precio"
                />
              </FormField>
            </FormGroup>
            <FormGroup widths="equal">
              <FormField
                name="Cantidad"
                value={formularioDatos.Cantidad}
                onChange={handleChange}
                label="Cantidad"
                control="input"
                placeholder="Cantidad"
                required
              />
              <FormField
                name="StockMinimo"
                value={formularioDatos.StockMinimo}
                onChange={handleChange}
                label="StockMinimo"
                control="input"
                placeholder="StockMinimo"
                required
              />
              <FormField required>
                <label>Estado</label>
                <Select
                  placeholder="Estado"
                  onChange={handleSelectChange}
                  name="EstadoID"
                  value={formularioDatos.EstadoID}
                  options={estados.map((estados) => ({key: estados.ID, value: estados.ID, text: estados.Estado }))} />
              </FormField>
            </FormGroup>
            <FormGroup widths="equal">
              <FormField
                name="Categoria"
                value={formularioDatos.Categoria}
                onChange={handleChange}
                label="Categoria"
                control="input"
                placeholder="Categoria"
                required
              />
              <FormField required>
                <label>Fecha de Ingreso</label>
                <Calendar
                  value={formularioDatos.FechaIngreso}
                  onChange={handleChange}
                  name="FechaIngreso"
                  placeholder="00/00/0000"
                  required
                />
              </FormField>
            </FormGroup>
            <Button type="submit" color="green">
              Registrar
            </Button>
            <button type="button" className="btn btn-danger" onClick={() => setMostrarFormulario(!mostrarFormulario) + limpiarFormulario()}> Cancelar </button>
            <Divider hidden />
          </div>
        </Form>
      )}
      <div className="Filtro">
        <div className="contenedor-1">
          <Search placeholder="Codigo" />
          <span className="icon-text">
            <i className="pi pi-filter" style={{ fontSize: "1.5rem" }}></i>
            <span>Filtro</span>
          </span>
        </div>
        <div className="contenedor-2">
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
            <i className="pi pi-plus" /> Producto
          </Button>
        </div>
      </div>
      <article className="dasboard-productos"></article>
      <Table celled>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>#</TableHeaderCell>
            <TableHeaderCell>Nombre</TableHeaderCell>
            <TableHeaderCell>Descripcion</TableHeaderCell>
            <TableHeaderCell>Precio</TableHeaderCell>
            <TableHeaderCell>Cantidad</TableHeaderCell>
            <TableHeaderCell>StockMinimo</TableHeaderCell>
            <TableHeaderCell>Estado</TableHeaderCell>
            <TableHeaderCell>Categoria</TableHeaderCell>
            <TableHeaderCell>Fecha de Ingreso</TableHeaderCell>
            <TableHeaderCell></TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
    
          {currentItems.map((producto, index) => (
            <TableRow key={producto.ID}>
              <TableCell>{index + 1 + indexOfFirstItem}</TableCell>
              <TableCell>{producto.Nombre}</TableCell>
              <TableCell>{producto.Descripcion}</TableCell>
              <TableCell>{producto.Precio}</TableCell>
              <TableCell>{producto.Cantidad}</TableCell>
              <TableCell>{producto.StockMinimo}</TableCell>
              <TableCell>{producto.EstadoID}</TableCell>
              <TableCell>{producto.Categoria}</TableCell>
              <TableCell>{producto.FechaIngreso}</TableCell>
              <TableCell>
              
                <button type="button" className="btn btn-primary"><FontAwesomeIcon className="Icon" icon={faPenToSquare} />Editar</button>
                <button type="button" className="btn btn-danger" onClick={() => BtnEliminar(producto.ID)}><FontAwesomeIcon className='Icon' icon={faTrashCan} /><p className='texto-p'>Eliminar</p></button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(Productos.length / itemsPerPage)}
        handlePageChange={handlePageChange}
      />
    </div>
  );
}


export default Productos;