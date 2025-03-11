import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import {
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableCell,
  TableBody,
  Table,
  Button,
  Search,
  Form,
  FormGroup,
  FormField,
  Divider,
  Select,
  Input,
} from "semantic-ui-react";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import "./styles/Inventario.css";
import "primeicons/primeicons.css";
import axios from "axios";
import Paginacion from "../Pagination";

const Inventario = () => {
  const [inventario, setInventario] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formularioDatos, setFormularioDatos] = useState({
    NombreProducto: "",
    Descripcion: "",
    Cantidad_stock: "",
    Estado: "",
    Categoria: "",
    Precio: "",
    Proveedor: "",
    Fecha_Entrada: "",
    Fecha_Salida: "",
    TblProductoID: null,
  });

  const [estados, setEstados] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    mostrarInventario();
    obtenerEstados();
    obtenerProveedores();
  }, []);

  const mostrarInventario = () => {
    axios
      .get("http://localhost:3000/api/api/inventario")
      .then((response) => setInventario(response.data))
      .catch((error) =>
        console.error("Error al obtener el inventario:", error)
      );
  };

  const obtenerEstados = () => {
    axios
      .get("http://localhost:3000/api/api/estados")
      .then((response) => setEstados(response.data))
      .catch((error) => console.error("Error al obtener los estados:", error));
  };

  const obtenerProveedores = () => {
    axios
      .get("http://localhost:3000/api/api/proveedores")
      .then((response) => setProveedores(response.data))
      .catch((error) =>
        console.error("Error al obtener los proveedores:", error)
      );
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

  const handleSelectChange = (e, { name, value }) => {
    setFormularioDatos({ ...formularioDatos, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const datosEnviados = {
      ...formularioDatos,
      Precio: parseFloat(formularioDatos.Precio),
      Cantidad_stock: parseInt(formularioDatos.Cantidad_stock, 10),
      Estado: parseInt(formularioDatos.Estado, 10),
      Proveedor: parseInt(formularioDatos.Proveedor, 10),
      TblProductoID: parseInt(formularioDatos.TblProductoID, 10),
    };

    axios
      .post("http://localhost:3000/api/api/inventario/agregar", datosEnviados)
      .then((response) => {
        console.log(response.data);
        setMostrarFormulario(false);
        mostrarInventario();
        limpiarFormulario();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Registro ha sido guardado con éxito.",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => console.error("Error al insertar los datos:", error));
  };

  const handleDelete = (id) => {
    console.log(`ID a eliminar: ${id}`); // Log adicional para verificar el ID
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
        const url = `http://localhost:3000/api/api/inventario/borrar/${id}`;
        console.log(`URL de eliminación: ${url}`); // Log adicional para verificar la URL
        axios
          .delete(url)
          .then((response) => {
            console.log(response.data);
            mostrarInventario();
            Swal.fire({
              title: "¡Eliminado!",
              text: "Este producto ha sido eliminado con éxito.",
              icon: "success",
            });
          })
          .catch((error) =>
            console.error("Error al eliminar los datos:", error)
          );
      }
    });
  };

  const limpiarFormulario = () => {
    setFormularioDatos({
      NombreProducto: "",
      Descripcion: "",
      Cantidad_stock: "",
      Estado: "",
      Categoria: "",
      Precio: "",
      Proveedor: "",
      Fecha_Entrada: "",
      Fecha_Salida: "",
      TblProductoID: null,
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const itemsFiltrados = inventario.filter(
    (item) =>
      item.NombreProducto.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.Descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.Categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  const currentItems = itemsFiltrados.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="contenedor-Inventario">
      <div className="titulo">
        <p>Inventario</p>
      </div>
      {mostrarFormulario && (
        <Form className="FormularioInventario" onSubmit={handleSubmit}>
          <FormGroup widths="equal">
            <FormField required>
              <label>Nombre</label>
              <Input
                name="NombreProducto"
                value={formularioDatos.NombreProducto}
                onChange={handleInputChange}
                placeholder="Nombre del producto"
              />
            </FormField>
            <FormField required>
              <label>Descripcion</label>
              <Input
                name="Descripcion"
                value={formularioDatos.Descripcion}
                onChange={handleInputChange}
                placeholder="Descripcion"
              />
            </FormField>
          </FormGroup>
          <FormGroup widths="equal">
            <FormField required>
              <label>Stock</label>
              <InputNumber
                value={formularioDatos.Cantidad_stock}
                onChange={(e) =>
                  handleInputNumberChange("Cantidad_stock", e.value)
                }
                placeholder="Stock"
              />
            </FormField>
            <FormField required>
              <label>Estado</label>
              <Select
                placeholder="Seleccionar estado"
                onChange={handleSelectChange}
                name="Estado"
                value={formularioDatos.Estado}
                options={estados.map((estado) => ({
                  key: estado.ID,
                  value: estado.ID,
                  text: estado.Estado,
                }))}
              />
            </FormField>
          </FormGroup>
          <FormGroup widths="equal">
            <FormField required>
              <label>Categoria</label>
              <Input
                name="Categoria"
                value={formularioDatos.Categoria}
                onChange={handleInputChange}
                placeholder="Categoria"
              />
            </FormField>
            <FormField required>
              <label>Precio</label>
              <InputNumber
                value={formularioDatos.Precio}
                onChange={(e) => handleInputNumberChange("Precio", e.value)}
                placeholder="Precio"
              />
            </FormField>
          </FormGroup>
          <FormGroup widths="equal">
            <FormField required>
              <label>Proveedor</label>
              <Select
                placeholder="Seleccionar proveedor"
                onChange={handleSelectChange}
                name="Proveedor"
                value={formularioDatos.Proveedor}
                options={proveedores.map((proveedor) => ({
                  key: proveedor.ID,
                  value: proveedor.ID,
                  text: proveedor.Nombre,
                }))}
              />
            </FormField>
            <FormField required>
              <label>Fecha Entrada</label>
              <Calendar
                value={formularioDatos.Fecha_Entrada}
                onChange={(e) =>
                  handleInputNumberChange("Fecha_Entrada", e.target.value)
                }
                placeholder="Fecha de entrada"
              />
            </FormField>
            <FormField>
              <label>Fecha Salida</label>
              <Calendar
                value={formularioDatos.Fecha_Salida}
                onChange={(e) =>
                  handleInputNumberChange("Fecha_Salida", e.target.value)
                }
                placeholder="Fecha de salida"
              />
            </FormField>
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
            <i className="pi pi-upload" style={{ fontSize: "1.5rem" }}></i>
            <span>Exportar</span>
          </span>
          <Button color="green" onClick={() => setMostrarFormulario(true)}>
            <i className="pi pi-plus" /> Producto
          </Button>
        </div>
      </div>
      <Table celled>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>#</TableHeaderCell>
            <TableHeaderCell>Nombre</TableHeaderCell>
            <TableHeaderCell>Descripción</TableHeaderCell>
            <TableHeaderCell>Stock</TableHeaderCell>
            <TableHeaderCell>Estado</TableHeaderCell>
            <TableHeaderCell>Categoría</TableHeaderCell>
            <TableHeaderCell>Precio</TableHeaderCell>
            <TableHeaderCell>Proveedor</TableHeaderCell>
            <TableHeaderCell>Fecha Entrada</TableHeaderCell>
            <TableHeaderCell>Fecha Salida</TableHeaderCell>
            <TableHeaderCell>TblProductoID</TableHeaderCell>
            <TableHeaderCell>Acciones</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.map((item, index) => (
            <TableRow key={item.ID}>
              <TableCell>{index + 1 + indexOfFirstItem}</TableCell>
              <TableCell>{item.NombreProducto}</TableCell>
              <TableCell>{item.Descripcion}</TableCell>
              <TableCell>{item.Cantidad_stock}</TableCell>
              <TableCell>{item.Estado}</TableCell>
              <TableCell>{item.Categoria}</TableCell>
              <TableCell>{item.Precio}</TableCell>
              <TableCell>{item.Proveedor}</TableCell>
              <TableCell>{item.Fecha_Entrada}</TableCell>
              <TableCell>{item.Fecha_Salida}</TableCell>
              <TableCell>{item.TblProductoID}</TableCell>
              <TableCell>
                <Button color="blue">
                  <FontAwesomeIcon icon={faPenToSquare} /> Editar
                </Button>
                <Button color="red" onClick={() => handleDelete(item.ID)}>
                  <FontAwesomeIcon icon={faTrashCan} />
                  <p className="texto-p">Eliminar</p>
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

export default Inventario;
