import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { TableRow, TableHeaderCell, TableHeader, TableCell, TableBody, Table, Button, Search, Form, FormGroup, FormField, Divider } from 'semantic-ui-react';
// import { Calendar } from 'primereact/calendar';
// import { InputNumber } from 'primereact/inputnumber';
import './styles/Pedidos.css';
import 'primeicons/primeicons.css';
import axios from 'axios';
import Paginacion from '../Paginacion';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);  // Renombrado a pedidos, ya que estamos trabajando con pedidos
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formularioDatos, setFormularioDatos] = useState({
    Fecha_Despacho: '',
    Fecha_Entrega: '',
    Fecha_Pedido: '',
    Estado: "",
    Direccion_Entrega: "",
    Total: 0,
    Metodo_Pago: ""
  });

  // const [estados, setEstados] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    obtenerPedidos();
    obtenerEstados();
  }, []);

  const obtenerPedidos = () => {
    axios.get('http://localhost:3000/api/pedidos') // Cambiado a pedidos
      .then(response => setPedidos(response.data))
      .catch(error => console.error('Error al obtener los pedidos:', error));
  };

  const obtenerEstados = () => {
    axios.get('http://localhost:3000/api/estados')
      // .then(response => setEstados(response.data))
      .catch(error => console.error('Error al obtener los estados:', error));
  };

  const handleDelete = (id) => {
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
        axios.delete(`http://localhost:3000/api/pedidos/${id}`)
          .then(() => {
            obtenerPedidos();
            Swal.fire({
              title: "¡Eliminado!",
              text: "El pedido ha sido eliminado con éxito.",
              icon: "success"
            });
          })
          .catch(error => console.error('Error al eliminar los datos:', error));
      }
    });
  };

  const handleSearch = (e, { value }) => {
    setBusqueda(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormularioDatos({ ...formularioDatos, [name]: value });
  };

  const handleInputNumberChange = (name, value) => {
    setFormularioDatos({ ...formularioDatos, [name]: value });
  };

  // const handleSelectChange = (e, { name, value }) => {
  //   setFormularioDatos({ ...formularioDatos, [name]: value });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/api/agregar/pedido', formularioDatos) // Cambiado a pedidos
      .then(() => {
        setMostrarFormulario(false);
        obtenerPedidos();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "El pedido ha sido registrado con éxito.",
          showConfirmButton: false,
          timer: 1500
        });
      })
      .catch(error => console.error('Error al guardar el pedido:', error));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const itemsFiltrados = pedidos.filter(item =>
    item.Id.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.Estado.toLowerCase().includes(busqueda.toLowerCase())
  );

  const currentItems = itemsFiltrados.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="contenedor-Inventario">
      <div className="titulo">
        <p>Pedidos</p>
      </div>
      {mostrarFormulario && (
        <Form className="FormularioInventario" onSubmit={handleSubmit}>
          <FormGroup widths="equal">
            <FormField
              label="ID Pedido"
              name="Id"
              value={formularioDatos.Id}
              onChange={handleInputChange}
              placeholder="ID del pedido"
              required
            />
            <FormField
              label="Fecha Despacho"
              name="Fecha_Despacho"
              value={formularioDatos.Fecha_Despacho}
              onChange={(e) => handleInputNumberChange("Fecha_Despacho", e.target.value)}
              placeholder="Fecha de despacho"
              required
            />
          </FormGroup>

          <FormGroup widths="equal">
            <FormField
              label="Fecha Entrega"
              name="Fecha_Entrega"
              value={formularioDatos.Fecha_Entrega}
              onChange={(e) => handleInputNumberChange("Fecha_Entrega", e.target.value)}
              placeholder="Fecha de entrega"
              required
            />
            <FormField
              label="Fecha Pedido"
              name="Fecha_Pedido"
              value={formularioDatos.Fecha_Pedido}
              onChange={(e) => handleInputNumberChange("Fecha_Pedido", e.target.value)}
              placeholder="Fecha de pedido"
              required
            />
          </FormGroup>

          <FormGroup widths="equal">
            <FormField
              label="Estado"
              name="Estado"
              value={formularioDatos.Estado}
              onChange={handleInputChange}
              placeholder="Estado del pedido"
              required
            />
            <FormField
              label="Dirección Entrega"
              name="Direccion_Entrega"
              value={formularioDatos.Direccion_Entrega}
              onChange={handleInputChange}
              placeholder="Dirección de entrega"
              required
            />
          </FormGroup>

          <FormGroup widths="equal">
            <FormField
              label="Total"
              name="Total"
              value={formularioDatos.Total}
              onChange={(e) => handleInputNumberChange("Total", e.target.value)}
              placeholder="Total del pedido"
              required
            />
            <FormField
              label="Método de Pago"
              name="Metodo_Pago"
              value={formularioDatos.Metodo_Pago}
              onChange={handleInputChange}
              placeholder="Método de pago"
              required
            />
          </FormGroup>

          <Button type="submit" color="green">
            Registrar
          </Button>
          <Button
            type="button"
            color="red"
            onClick={() => setMostrarFormulario(false)}
          >
            Cancelar
          </Button>
          <Divider hidden />
        </Form>
      )}

      <div className="Filtro">
        <div className="contenedor-1">
          <Search
            placeholder="Codigo"
            onSearchChange={handleSearch}
            value={busqueda}
            showNoResults={false}
          />
          <span className="icon-text">
            <i className="pi pi-filter" style={{ fontSize: "1.5rem" }}></i>
            <span>Filtro</span>
          </span>
        </div>
        <div className="contenedor-2">
          <span className="icon-text">
            <i className="pi pi-upload" style={{ fontSize: '1.5rem' }}></i>
            <span>Exportar</span>
          </span>
          <Button color='green' onClick={() => setMostrarFormulario(true)}>
            <i className="pi pi-plus" /> Pedido
          </Button>
        </div>
      </div>

      <Table celled>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>#</TableHeaderCell>
            <TableHeaderCell>Fecha Despacho</TableHeaderCell>
            <TableHeaderCell>Fecha Entrega</TableHeaderCell>
            <TableHeaderCell>Estado</TableHeaderCell>
            <TableHeaderCell>Dirección Entrega</TableHeaderCell>
            <TableHeaderCell>Total</TableHeaderCell>
            <TableHeaderCell>Método de Pago</TableHeaderCell>
            <TableHeaderCell>Acciones</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.map((item, index) => (
            <TableRow key={item.Id}>
              <TableCell>{index + 1 + indexOfFirstItem}</TableCell>
              <TableCell>{item.Id}</TableCell>
              <TableCell>{item.Fecha_Despacho}</TableCell>
              <TableCell>{item.Fecha_Entrega}</TableCell>
              <TableCell>{item.Estado}</TableCell>
              <TableCell>{item.Direccion_Entrega}</TableCell>
              <TableCell>{item.Total}</TableCell>
              <TableCell>{item.Metodo_Pago}</TableCell>
              <TableCell>
                <Button color="blue">
                  <FontAwesomeIcon icon={faPenToSquare} /> Editar
                </Button>
                <Button color="red" onClick={() => handleDelete(item.Id)}>
                  <FontAwesomeIcon icon={faTrashCan} /> Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Paginacion
        currentPage={currentPage}
        totalPages={Math.ceil(itemsFiltrados.length / itemsPerPage)}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default Pedidos;
