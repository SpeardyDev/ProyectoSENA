import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import axios from "axios";
import Pagination from "../Pagination";
import {
  Button,
  Form,
  Search,
  FormGroup,
  FormField,
  Select,
  Divider,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from "semantic-ui-react";
import "./styles/Categorias.css";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [estados, setEstados] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formularioDatos, setFormularioDatos] = useState({
    ID: null,
    Nombre: "",
    Descripcion: "",
    Estado: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    obtenerCategorias();
    obtenerEstados();
  }, []);

  const obtenerCategorias = () => {
    axios
      .get("http://localhost:3000/api/api/categoriasMp")
      .then((response) => setCategorias(response.data))
      .catch((error) => console.error("Error al obtener categorías:", error));
  };

  const obtenerEstados = () => {
    axios
      .get("http://localhost:3000/api/api/estados")
      .then((response) => setEstados(response.data))
      .catch((error) => console.error("Error al obtener estados:", error));
  };

  const handleChange = (e, { name, value }) => {
    setFormularioDatos((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formularioDatos.ID ? editarCategoria() : agregarCategoria();
  };

  const agregarCategoria = () => {
    axios
      .post("http://localhost:3000/api/api/agregar/categoriasMp", formularioDatos)
      .then(() => {
        obtenerCategorias();
        cerrarFormulario();
        Swal.fire("Éxito", "Categoría agregada con éxito", "success");
      })
      .catch((error) => console.error("Error al agregar categoría:", error));
  };

  const editarCategoria = () => {
    axios
      .put(
        `http://localhost:3000/api/api/editar/categoriasMp/${formularioDatos.ID}`,
        formularioDatos
      )
      .then(() => {
        obtenerCategorias();
        cerrarFormulario();
        Swal.fire("Éxito", "Categoría actualizada con éxito", "success");
      })
      .catch((error) => {
        console.error("Error al editar categoría:", error);
        Swal.fire("Error", "Hubo un problema al actualizar la categoría", "error");
      });
  };
  

  const eliminarCategoria = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3000/api/api/eliminar/categoriasMp/${id}`)
          .then(() => {
            obtenerCategorias();
            Swal.fire("Eliminado", "Categoría eliminada con éxito", "success");
          })
          .catch((error) => {
            console.error("Error al eliminar categoría:", error);
            Swal.fire("Error", "No se pudo eliminar la categoría", "error");
          });
      }
    });
  };
  

  const cerrarFormulario = () => {
    setFormularioDatos({ ID: null, Nombre: "", Descripcion: "", Estado: "" });
    setMostrarFormulario(false);
  };

  const abrirFormularioEditar = (categoria) => {
    setFormularioDatos({ ...categoria });
    setMostrarFormulario(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categorias.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <section>
      <div className="titulo">
        <p>Categorías de Materias Primas</p>
      </div>
      {mostrarFormulario && (
        <Form className="FormularioCategoria" onSubmit={handleSubmit}>
          <div className="contenedor_formulario_Categorias">
            <FormGroup widths="equal">
              <FormField
                control="input"
                label="Nombre"
                name="Nombre"
                value={formularioDatos.Nombre}
                onChange={(e) => handleChange(e.target, e.target)}
                required
              />
            </FormGroup>
            <FormGroup>
              <FormField
                control="input"
                label="Descripción"
                name="Descripcion"
                value={formularioDatos.Descripcion}
                onChange={(e) => handleChange(e.target, e.target)}
                required
              />
              <FormField
                control={Select}
                label="Estado"
                name="Estado"
                options={estados.map((e) => ({
                  key: e.ID,
                  value: e.ID,
                  text: e.Estado,
                }))}
                value={formularioDatos.Estado}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <Button type="submit" color="green">
              Registrar
            </Button>
            <Button type="button" color="red" onClick={cerrarFormulario}>
              Cancelar
            </Button>
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
            <i className="pi pi-plus" /> Categoria
          </Button>
        </div>
      </div>
      <article className="dasboard-categorias"></article>
      <Table celled>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>ID</TableHeaderCell>
            <TableHeaderCell>Nombre</TableHeaderCell>
            <TableHeaderCell>Descripción</TableHeaderCell>
            <TableHeaderCell>Estado</TableHeaderCell>
            <TableHeaderCell>Acciones</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((categoria) => (
            <TableRow key={categoria.ID}>
              <TableCell>{categoria.ID}</TableCell>
              <TableCell>{categoria.Nombre}</TableCell>
              <TableCell>{categoria.Descripcion}</TableCell>
              <TableCell>
                {estados.find((estado) => estado.ID === categoria.Estado)
                  ?.Estado || "Desconocido"}
              </TableCell>

              <TableCell>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => abrirFormularioEditar(categoria)}
                >
                  <FontAwesomeIcon className="Icon" icon={faPenToSquare} />
                  Editar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => eliminarCategoria(categoria.ID)}
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
        totalPages={Math.ceil(categorias.length / itemsPerPage)}
        handlePageChange={handlePageChange}
      />
    </section>
  );
};

export default Categorias;
