import axios from "axios";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import "./styles/Proveedores.css";
import {
  FormGroup,
  FormField,
  Button,
  Form,
  Search,
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableCell,
  TableBody,
  Table,
  Icon
} from "semantic-ui-react";
import Pagination from "../Pagination";
import { InputMask } from "primereact/inputmask";

function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [proveedorEditando, setProveedorEditando] = useState(null);
  const [formularioDatos, setFormularioDato] = useState({
    Nombre: "",
    Telefono: "",
    Direccion: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    mostrarProveedores();
  }, []);

  const mostrarProveedores = () => {
    axios
      .get("http://localhost:3000/proveedores")
      .then((respuesta) => setProveedores(respuesta.data))
      .catch((error) => console.error("Error al obtener los datos:", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormularioDato({ ...formularioDatos, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:3000/agregar/proveedores",
        formularioDatos
      )
      .then(() => {
        setMostrarFormulario(false);
        mostrarProveedores();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Registro guardado con éxito.",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => console.error("Error al insertar los datos:", error));
  };

  const handleEditar = (id) => {
    const proveedor = proveedores.find(item => item.ID === id);
    setProveedorEditando(proveedor.ID);
    setFormularioDato({
      Nombre: proveedor.Nombre,
      Telefono: proveedor.Telefono,
      Direccion: proveedor.Direccion,
    });
    setMostrarFormulario(true);
  };

  const handleActualizar = (e) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:3000/actualizar/proveedores/${proveedorEditando}`,
        formularioDatos
      )
      .then(() => {
        setMostrarFormulario(false);
        setProveedorEditando(null);
        mostrarProveedores();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Proveedor actualizado con éxito.",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => console.error("Error al actualizar los datos:", error));
  };

  const BtnEliminar = (id) => {
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
        axios
          .delete(`http://localhost:3000/eliminar/proveedores/${id}`)
          .then(() => {
            mostrarProveedores();
            Swal.fire({
              title: "¡Eliminado!",
              text: "Este proveedor ha sido eliminado con éxito.",
              icon: "success",
            });
          })
          .catch((error) =>
            console.error("Error al eliminar los datos:", error)
          );
      }
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  /// Limpia los inputs
  const LimpiarFormulario = () => {
    setFormularioDato({
      Nombre: "",
      Telefono: "",
      Direccion: "",
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = proveedores.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <section>
      <div className="Titulo">
        <p>Proveedores</p>
      </div>

      {mostrarFormulario && (
        <Form
          className="RegistroNuevoProveedor"
          onSubmit={proveedorEditando ? handleActualizar : handleSubmit}
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
              <FormField required>
                <label>Teléfono</label>
                <InputMask
                  mask="(999) 999-9999"
                  name="Telefono"
                  placeholder="(999) 999-9999"
                  value={formularioDatos.Telefono}
                  onChange={handleChange}
                />
              </FormField>
            </FormGroup>
            <FormGroup widths="equal">
              <FormField
                name="Direccion"
                value={formularioDatos.Direccion}
                onChange={handleChange}
                label="Dirección"
                control="input"
                placeholder="Dirección"
                required
              />
            </FormGroup>

            <Button type='submit' color='green'>{proveedorEditando ? 'Actualizar' : 'Registrar'}</Button>
            <Button
              type="button"
              className="red"
              onClick={() =>
                setMostrarFormulario(!mostrarFormulario) + LimpiarFormulario()
              }
            >
              {" "}
              Cancelar{" "}
            </Button>
          </div>
        </Form>
      )}
      <div className="Filtro">
        <div className="Contenedor-1">
          <Search placeholder="Codigo" />
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
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            color="green"
          >
            <i className="pi pi-plus" /> Proveedor
          </Button>
        </div>
      </div>
      <article className="Dasboard-Proveedores"></article>
      <Table celled>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>#</TableHeaderCell>
            <TableHeaderCell>Nombre</TableHeaderCell>
            <TableHeaderCell>Teléfono</TableHeaderCell>
            <TableHeaderCell>Dirección</TableHeaderCell>
            <TableHeaderCell>Acciones</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.map((proveedor, index) => (
            <TableRow key={proveedor.ID}>
              <TableCell>{index + 1 + indexOfFirstItem}</TableCell>
              <TableCell>{proveedor.Nombre}</TableCell>
              <TableCell>{proveedor.Telefono}</TableCell>
              <TableCell>{proveedor.Direccion}</TableCell>
              <TableCell>
              <Button icon color="blue" onClick={() => handleEditar(proveedor.ID)}>
                  <Icon name='edit' />
                </Button>
                <Button icon color="red" onClick={() => BtnEliminar(proveedor.ID)}>
                  <Icon name='trash' />
                </Button>
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