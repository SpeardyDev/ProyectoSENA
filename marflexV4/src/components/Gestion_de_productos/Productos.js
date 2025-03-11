import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import {
  FormGroup,
  FormField,
  Button,
  Divider,
  Form,
  Search,
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableCell,
  TableBody,
  Table,
  Select,
} from "semantic-ui-react";
import "./styles/Productos.css";
import "primeicons/primeicons.css";
import axios from "axios";
import Pagination from "../Pagination";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";

const Productos = () => {
  const [Productos, setProductos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formularioDatos, setFormularioDato] = useState({
    Nombre: "",
    Descripcion: "",
    Precio: "",
    Cantidad: "",
    StockMinimo: "",
    EstadoID: "",
    CategoriaID: "",
    FechaIngreso: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    mostrarProductos();
  }, []);
  //Obtener estados
  const [estados, setEstados] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/api/estados")
      .then((response) => setEstados(response.data))
      .catch((error) => console.error("Error al obtener los estados:", error));
  }, []);

  //Obtener categorias
  const [categorias, setCategorias] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/api/categoriasPd")
      .then((response) => setCategorias(response.data))
      .catch((error) =>
        console.error("Error al obtener las categorías:", error)
      );
  }, []);

  // //Obtener proveedores
  // const [proveedores, setProveedores] = useState([]);
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:3000/api/api/proveedores")
  //     .then((response) => setProveedores(response.data))
  //     .catch((error) =>
  //       console.error("Error al obtener las categorías:", error)
  //     );
  // }, []);

  //Obtener productos
  const mostrarProductos = () => {
    axios
      .get("http://localhost:3000/api/api/productos")
      .then((response) => setProductos(response.data))
      .catch((error) => console.error("Error al obtener los datos:", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormularioDato({ ...formularioDatos, [name]: value });
  };
  const handleInputNumberChange = (name, value) => {
    setFormularioDato({ ...formularioDatos, [name]: value });
  };
  const handleSelectChange = (e, { name, value }) => {
    setFormularioDato({ ...formularioDatos, [name]: value });
  };

  const AgregarProductos = (e) => {
    e.preventDefault();

    const datosEnviados = {
      ...formularioDatos,
      Precio: parseFloat(formularioDatos.Precio),
      Cantidad: parseInt(formularioDatos.Cantidad, 10),
      StockMinimo: parseInt(formularioDatos.StockMinimo, 10),
      EstadoID: parseInt(formularioDatos.EstadoID, 10),
      CategoriaID: parseInt(formularioDatos.CategoriaID, 10)
    };

    axios
      .post("http://localhost:3000/api/api/agregar/productos", datosEnviados)
      .then((response) => {
        console.log(response.data);
        setMostrarFormulario(false);
        mostrarProductos();
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

  const EditarProducto = (e) => {
    e.preventDefault();
  
    if (!formularioDatos.ID) {
      Swal.fire("Error", "No se ha seleccionado un producto para editar", "error");
      return;
    }
  
    const datosEditados = {
      ...formularioDatos,
      Precio: parseFloat(formularioDatos.Precio),
      Cantidad: parseInt(formularioDatos.Cantidad, 10),
      StockMinimo: parseInt(formularioDatos.StockMinimo, 10),
      EstadoID: parseInt(formularioDatos.EstadoID, 10),
      CategoriaID: parseInt(formularioDatos.CategoriaID, 10)
    };

    axios
      .put(`http://localhost:3000/api/api/editar/productos/${formularioDatos.ID}`, datosEditados)
      .then((response) => {
        console.log("Producto actualizado:", response.data);
        setMostrarFormulario(false);
        mostrarProductos(); // Refrescar lista de productos
        limpiarFormulario();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Producto actualizado con éxito",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.error("Error al actualizar el producto:", error);
        Swal.fire("Error", "No se pudo actualizar el producto", "error");
      });
  };  

  const handleEditar = (producto) => {
    console.log("Editando producto:", producto); // Verifica que el producto tenga ID
  
    setFormularioDato({
      ID: producto.ID, // Asegúrate de que el ID se está asignando correctamente
      Nombre: producto.Nombre,
      Descripcion: producto.Descripcion,
      Precio: producto.Precio,
      Cantidad: producto.Cantidad,
      StockMinimo: producto.StockMinimo,
      EstadoID: producto.EstadoID,
      CategoriaID: producto.CategoriaID,
      FechaIngreso: producto.FechaIngreso
    });
    setMostrarFormulario(true);
  };  

  ///Btn eliminar productos
  const BtnEliminar = (id) => {
    console.log(`ID a eliminar: ${id}`); // Log para verificar el ID

    if (!id || isNaN(id)) {
      console.error("ID no válido:", id);
      Swal.fire("Error", "ID no válido", "error");
      return;
    }

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
        const url = `http://localhost:3000/api/api/eliminar/productos/${id}`; // URL corregida
        console.log(`URL de eliminación: ${url}`);

        axios
          .delete(url)
          .then((response) => {
            console.log("Respuesta del servidor:", response.data);
            mostrarProductos();
            Swal.fire(
              "¡Eliminado!",
              "El producto ha sido eliminado con éxito.",
              "success"
            );
          })
          .catch((error) => {
            console.error("Error al eliminar los datos:", error);
            Swal.fire("Error", "No se pudo eliminar el producto", "error");
          });
      }
    });
  };

  /// Limpa los inputs
  const limpiarFormulario = () => {
    setFormularioDato({
      Nombre: "",
      Descripcion: "",
      Precio: "",
      Cantidad: "",
      StockMinimo: "",
      EstadoID: "",
      CategoriaID: "",
      FechaIngreso: ""
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
        <Form
          className="RegistroNuevoProveedor"
          onSubmit={formularioDatos.ID ? EditarProducto : AgregarProductos}
        >
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
                  options={estados.map((estados) => ({
                    key: estados.ID,
                    value: estados.ID,
                    text: estados.Estado,
                  }))}
                />
              </FormField>
            </FormGroup>
            <FormGroup widths="equal">
              <FormField required>
                <label>Categoría</label>
                <Select
                  placeholder="Categoría"
                  onChange={handleSelectChange}
                  name="CategoriaID"
                  value={formularioDatos.CategoriaID}
                  options={categorias.map((categorias) => ({
                    key: categorias.ID,
                    value: categorias.ID,
                    text: categorias.Nombre,
                  }))}
                />
              </FormField>
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
            <button
              type="button"
              className="btn btn-danger"
              onClick={() =>
                setMostrarFormulario(!mostrarFormulario) + limpiarFormulario()
              }
            >
              {" "}
              Cancelar{" "}
            </button>
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
            <TableHeaderCell>Acciones</TableHeaderCell>
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
              <TableCell>
                {estados.find((estado) => estado.ID === producto.EstadoID)
                  ?.Estado || "Desconocido"}
              </TableCell>
              <TableCell>
                {categorias.find(
                  (categoria) => categoria.ID === producto.CategoriaID
                )?.Nombre || "Desconocido"}
              </TableCell>
              <TableCell>{producto.FechaIngreso}</TableCell>
              <TableCell>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleEditar(producto)}
                >
                  <FontAwesomeIcon className="Icon" icon={faPenToSquare} />
                  Editar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => BtnEliminar(producto.ID)}
                >
                  <FontAwesomeIcon className="Icon" icon={faTrashCan} />
                  <p className="texto-p">Eliminar</p>
                </button>
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
};

export default Productos;
