import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, TableRow, TableHeaderCell, TableHeader, TableCell, TableBody, Table, FormField, FormGroup, Divider, Form, Search, Select} from "semantic-ui-react";
import { InputMask } from "primereact/inputmask";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../Pagination";
import Swal from "sweetalert2";

function Usuarios() {
  const [Usuarios, SetUsuarios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [formularioDatos, setFormularioDato] = useState({ documento: "", nombre: "", username: "", password: "", telefono: "", estado: "", rol: "" });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFormularioEditar, setMostrarFormularioEditar] = useState(false);
  const Estados = [
    {  value: 'Activo', text: 'Activo' },
    {  value: 'Inactivo', text: 'Inactivo' }
  ];
  const Rol = [
    {  value: 'modista', text: 'Modista' },
    {  value: 'administrador', text: 'Administrador' },
    {  value: 'Jefe de Bodega', text: 'Jefe de Bodega' }
  ];


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormularioDato((prevState) => ({ ...prevState, [name]: value }));
  };
///SE ENCARGA DE MOSTRAR LOS USUARIOS APENAS ENTRA A LA INTERFAZ
  useEffect(() => {
    MostrarUsuarios();
  }, []);
///ENPOINT GET QUE MUESTRA LOS USUARIOS EN LA TABLA
  const MostrarUsuarios = () => {
    axios.get("http://localhost:3000/api/usuarios")
      .then((Respuesta) => SetUsuarios(Respuesta.data))
      .catch((error) => console.error("Error al obtener los usuarios:", error));
  };
///AGREGAR USUARIOS METODO POST
  const AgregarUsuarios = (e) => {
    limpiarFormulario();
    e.preventDefault();
    axios
      .post("http://localhost:3000/api/registrar", formularioDatos)
      .then((response) => {
        console.log(response.data);
        setMostrarFormulario(false);
        MostrarUsuarios();
        limpiarFormulario();
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
/// ESTE ES EL BOTON QUE MUESTRA EL FORMULARIO 
  const BtnEditar = (usuario) => {
    setFormularioDato({
      _id: usuario._id,
      documento: usuario.documento,
      nombre: usuario.nombre,
      username: usuario.username,
      password: "", // vacío para no mostrar la contraseña
      telefono: usuario.telefono,
      estado: usuario.estado,
      rol: usuario.rol,
    });
    setMostrarFormularioEditar(true);
  };
/// ESTE EL ENPOINT DE EDITAR
  const EditarUsuario = (e) => {
    e.preventDefault();
    const datosAEnviar = { ...formularioDatos };

    // Si la contraseña está vacía, no la enviamos
    if (formularioDatos.password.trim() === "") {
      delete datosAEnviar.password;
    }

    axios
      .put(`http://localhost:3000/api/editar/usuarios/${formularioDatos._id}`, datosAEnviar)
      .then((response) => {
        console.log("Usuario actualizado:", response.data);
        limpiarFormulario();
        setMostrarFormularioEditar(false);
        MostrarUsuarios();
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Usuario actualizado con éxito.",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => console.error("Error al actualizar el usuario:", error));
  };
///ESTE ES EL ENPOINT DE ELIMINAR
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
          .delete(`http://localhost:3000/api/eliminar/usuarios/${id}`)
          .then(() => {
            MostrarUsuarios();
            Swal.fire("¡Eliminado!", "El usuario ha sido eliminado.", "success");
          })
          .catch((error) => console.error("Error al eliminar los datos:", error));
      }
    });
  };
///ESTE LIMPIA LOS INPUTS ANTES Y DESPUES DE USAR EL FORMULARIO
  const limpiarFormulario = () => {
    setFormularioDato({
    documento: "",
    nombre: "",
    username: "",
    password: "",
    telefono: "",
    estado: "",
    rol: "",
    });
  };
///ESTE MANEJA LA PAGINACION
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Usuarios.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <section>
      <div className="titulo">
        <p>Usuarios</p>
      </div>
      {/* FORMULARIO QUE PARA AGREGAR */}
      {mostrarFormulario && (
        <Form className="RegistroNuevoProveedor" onSubmit={AgregarUsuarios}>
          <FormGroup widths="equal">
            <FormField
              value={formularioDatos.documento}
              onChange={handleChange}
              placeholder="Documento"
              control="input"
              label="Documento"
              name="documento"
              required
            />
            <FormField
              name="nombre"
              value={formularioDatos.nombre}
              onChange={handleChange}
              label="Nombre"
              control="input"
              placeholder="Nombre"
              required
            />
            <FormField
              name="username"
              value={formularioDatos.username}
              onChange={handleChange}
              label="Usuario"
              control="input"
              placeholder="Usuario"
              type="email"
              required
            />
          </FormGroup>
          <FormGroup widths="equal">
            <FormField
              required
              name="password"
              value={formularioDatos.password}
              onChange={handleChange}
              label="Password"
              control="input"
              type="password"
              placeholder="Password"
            />
            <FormField required>
              <label>Teléfono</label>
              <InputMask
                id="phone"
                mask="(999) 999-9999"
                name="telefono"
                placeholder="(999) 999-9999"
                value={formularioDatos.telefono}
                onChange={handleChange}
              />
            </FormField>

            <FormField required>
              <label>Estado</label>
              <Select
                placeholder="Estado"
                options={Estados}
                name="estado"
                onChange={(e, { value }) => setFormularioDato((prevState) => ({...prevState, estado: value, }))}
                value={formularioDatos.estado}
              />
            </FormField>
          </FormGroup>
          <FormGroup widths="equal">
          <FormField required>
              <label>Rol</label>
              <Select
                placeholder="Rol"
                options={Rol}
                name="estado"
                onChange={(e, { value }) => setFormularioDato((prevState) => ({...prevState, rol: value, }))}
                value={formularioDatos.rol}
              />
            </FormField>
          </FormGroup>
          <Button type="submit" color="green"> Registrar </Button>
          <Button type="button" color="red" onClick={() => setMostrarFormulario(false)} > Cancelar </Button>
          <Divider hidden />
        </Form>
      )}
      {/* FORMULARIO QUE PARA EDITAR */}
      {mostrarFormularioEditar && (
        <Form className="RegistroNuevoProveedor" onSubmit={EditarUsuario}>
          <FormGroup widths="equal">
            <FormField
              value={formularioDatos.documento}
              onChange={handleChange}
              placeholder="Documento"
              control="input"
              label="Documento"
              name="documento"
              required
            />
            <FormField
              name="nombre"
              value={formularioDatos.nombre}
              onChange={handleChange}
              label="Nombre"
              control="input"
              placeholder="Nombre"
              required
            />
            <FormField
              name="username"
              value={formularioDatos.username}
              onChange={handleChange}
              label="Usuario"
              control="input"
              placeholder="Usuario"
              required
            />
          </FormGroup>
          <FormGroup widths="equal">
            <FormField
              name="password"
              value={formularioDatos.password}
              onChange={handleChange}
              label="Password"
              control="input"
              type="password"
              placeholder="Password"
            />
            <FormField>
              <label>Teléfono</label>
              <InputMask
                id="phone"
                mask="(999) 999-9999"
                name="telefono"
                placeholder="(999) 999-9999"
                value={formularioDatos.telefono}
                onChange={handleChange}
              />
            </FormField>
            <FormField required>
              <label>Estado</label>
              <Select
                placeholder="Estado"
                options={Estados}
                name="estado"
                onChange={(e, { value }) => setFormularioDato((prevState) => ({...prevState, estado: value, }))}
                value={formularioDatos.estado}
              />
            </FormField>
          </FormGroup>
          <FormGroup widths="equal">
          <FormField required>
              <label>Rol</label>
              <Select
                placeholder="Rol"
                options={Rol}
                name="estado"
                onChange={(e, { value }) => setFormularioDato((prevState) => ({...prevState, rol: value, }))}
                value={formularioDatos.rol}
              />
            </FormField>
          </FormGroup>
          <Button type="submit" color="green">Editar</Button>
          <Button type="button" color="red" onClick={() => setMostrarFormularioEditar(false)}> Cancelar </Button>
          <Divider hidden />
        </Form>
      )}
      <div className="Filtro">
        <div className="contenedor-1">
          <Search placeholder="Codigo" />
          <span className="icon-text">
            <i className="pi pi-filter" style={{ fontSize: "1.5rem" }}></i>
            <span className="texto-filtro">Filtro</span>
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
            onClick={() =>
              setMostrarFormulario(!mostrarFormulario) +
              limpiarFormulario() +
              setMostrarFormularioEditar(false)
            }
            color="green"
          >
            <i className="pi pi-plus" />
            Usuario
          </Button>
        </div>
      </div>
      <article className="dasboard-productos"></article>
      <Table celled>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>#</TableHeaderCell>
            <TableHeaderCell>Documento</TableHeaderCell>
            <TableHeaderCell>Nombre</TableHeaderCell>
            <TableHeaderCell>Usuario</TableHeaderCell>
            <TableHeaderCell>Rol</TableHeaderCell>
            <TableHeaderCell>Estado</TableHeaderCell>
            <TableHeaderCell>Teléfono</TableHeaderCell>
            <TableHeaderCell>Fecha</TableHeaderCell>
            <TableHeaderCell>Acciones</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((Usuario, index) => (
            <TableRow key={Usuario._id}>
              <TableCell>{index + 1 + indexOfFirstItem}</TableCell>
              <TableCell>{Usuario.documento}</TableCell>
              <TableCell>{Usuario.nombre}</TableCell>
              <TableCell>{Usuario.username}</TableCell>
              <TableCell>{Usuario.rol}</TableCell>
              <TableCell>{Usuario.estado}</TableCell>
              <TableCell>{Usuario.telefono}</TableCell>
              <TableCell></TableCell>
              <TableCell>
                <Button color="blue" onClick={() => BtnEditar(Usuario) + setMostrarFormulario(false) }> <FontAwesomeIcon icon={faPenToSquare} />Editar </Button>
                <Button color="red" onClick={() => BtnEliminar(Usuario._id)}> <FontAwesomeIcon icon={faTrashCan} /> Eliminar </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(Usuarios.length / itemsPerPage)}
        handlePageChange={handlePageChange}
      />
    </section>
  );
}

export default Usuarios;
