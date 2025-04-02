import React, { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyDocument from "./DocumentoReportes/MyDocument";
import { Button } from "primereact/button";
import { FormGroup, FormField, Form, Select } from "semantic-ui-react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsersGear,
  faTruck,
  faCartFlatbed,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Swal from "sweetalert2";
import "./styles/Reportes.css";

function ReportesCombinados() {
  const [TProveedores, setProveedores] = useState([]);
  const [TMaterias, setTMaterias] = useState([]);
  const [Usuarios, setUsuarios] = useState([]);
  const [selectRep, setSelectRep] = useState(null);
  const [ciudades, setCiudades] = useState([]);
  const [ciudadesNombre, setCiudadesNombre] = useState([]);
  const [ReportesProveedores, setReporProveedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [nombreMateria, setNombreMateria] = useState("");
  const [inputsVisibles, setInputsVisibles] = useState([]);

  const Filtro = [
    {
      value: "api/reporte-entradas-materia-prima",
      text: "Entradas Materia Prima",
      requires: [],
    },
    {
      value: "api/reporte-entradas-por-fecha",
      text: "Entradas materia prima por fecha",
      requires: ["fechaInicio", "fechaFin"],
    },
    {
      value: "api/reporte-inventario-stock-actual",
      text: "Inventario Stock Actual",
      requires: [],
    },
    {
      value: "api/reporte-materia-prima-usada",
      text: "Materia Prima Usada",
      requires: [],
    },
    {
      value: "api/reporte-movimientos-materia-prima",
      text: "Movimientos Materia Prima",
      requires: ["nombreMateria"],
    },
    {
      value: "api/reporte-produccion-por-fecha",
      text: "Produccion por fecha",
      requires: ["fechaInicio", "fechaFin"],
    },
    {
      value: "api/reporte-salidas-materia-prima",
      text: "Salidas Materia Prima",
      requires: [],
    },
    {
      value: "api/reporte-salidas-por-fecha",
      text: "Salidas materia prima por fecha",
      requires: ["fechaInicio", "fechaFin"],
    },
    {
      value: "api/reporte-ultima-compra-proveedores",
      text: "Ultima Compra Proveedores",
      requires: [],
    },
    { value: "Todos", text: "Generar todos" },
  ];
  useEffect(() => {
    const generarTodos = async () => {
      if (selectRep?.value === "Todos") {
        try {
          const [ResUsuarios, ResProveedores, ResProductos] = await Promise.all(
            [
              axios.get("http://localhost:3000/api/usuarios"),
              axios.get("http://localhost:3000/proveedores"),
              axios.get("http://localhost:3000/materia_prima"),
            ]
          );

          setCiudadesNombre(ResUsuarios.data);
          setReporProveedores(ResProveedores.data);
          setCiudades(ResProductos.data);
        } catch (error) {
          console.error("Error al obtener datos:", error);
        }
      }
    };

    MostrarUsuarios();
    MostrarProveedores();
    MostrarMateriaPrima();
    generarTodos();
  }, [selectRep]);

  const handleSelectChange = (e, { value }) => {
    const selectedReport = Filtro.find((n) => n.value === value);
    setSelectRep(selectedReport);
    setInputsVisibles(selectedReport?.requires || []);
  };

  ///MOSTRAR ULTIMOS 4 PROVEEDORES
  const MostrarProveedores = async () => {
    try {
      const response = await axios.get("http://localhost:3000/proveedores");
      setProveedores(response.data);
    } catch (error) {
      console.error("Error fetching proveedores:", error);
    }
  };
  ///MOSTRAR ULTIMOS 4 USUARIOS
  const MostrarUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/usuarios");

      setUsuarios(response.data);
    } catch (error) {
      console.error("Error fetching usuarios:", error);
    }
  };

  ///MOSTRAR ULTIMOS 4 PRODUCTOS
  const MostrarMateriaPrima = async () => {
    try {
      const response = await axios.get("http://localhost:3000/materia_prima");
      setTMaterias(response.data);
    } catch (error) {
      console.error("Error fetching materias primas:", error);
    }
  };
  ///BTN BUSCAR
  const BtnBuscar = async () => {
    setLoading(true);
    try {
      let queryParams = [];
  
      if (inputsVisibles.includes("fechaInicio") && fechaInicio) {
        queryParams.push(`fechaInicio=${fechaInicio}`);
      }
      if (inputsVisibles.includes("fechaFin") && fechaFin) {
        queryParams.push(`fechaFin=${fechaFin}`);
      }
      if (inputsVisibles.includes("nombreMateria") && nombreMateria) {
        queryParams.push(`nombreMateria=${nombreMateria}`);
      }
  
      if (queryParams.length === 0) {
        Swal.fire({
          icon: "info",
          title: "Sin datos",
          text: "Por favor selecciona al menos un criterio de búsqueda.",
        });
        setLoading(false);
        return;
      }
  
      const queryString = queryParams.join("&");
      const url = `http://localhost:3000/${selectRep.value}?${queryString}`;
  
      const response = await axios.get(url);
      setCiudades(response.data);
    } catch (err) {
      console.error("Error al buscar reportes:", err);
    }
    setLoading(false);
  };

  const GenerateReport = () => {
    Swal.fire({
        title: "¿Quieres Generar este reporte?",
        text: "Esta acción generará el reporte seleccionado.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, generar"
      })
      .then((result) => {
        if (result.isConfirmed) {
          BtnBuscar();
  
          Swal.fire(
            "Generado!",
            "El reporte ha sido generado correctamente.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            "Cancelado",
            "No se generó ningún reporte.",
            "error"
          );
        }
      });
  };

  return (
    <section>
      <div className="reportes-container">
        <p className="reportes-titulo">
          <i className="icono-reporte"></i>Reportes
        </p>
      </div>

      <div className="formulario-container">
        <div className="formulario">
          <Form>
            <FormGroup className="formulario-grupo">
              <FormField>
                <label>Reporte</label>
                <Select
                  placeholder="Selecciona un reporte"
                  options={Filtro}
                  name="Nombre"
                  onChange={handleSelectChange}
                  id="codigoCiudad"
                  value={selectRep?.value}
                />
              </FormField>

              {inputsVisibles.includes("fechaInicio") && (
                <FormField>
                  <label>Fecha Inicio</label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </FormField>
              )}

              {inputsVisibles.includes("fechaFin") && (
                <FormField>
                  <label>Fecha Fin</label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                </FormField>
              )}

              {inputsVisibles.includes("nombreMateria") && (
                <FormField>
                  <label>Materia Prima</label>
                  <Select
                    placeholder="Selecciona una materia prima"
                    options={TMaterias.map((mat) => ({
                      value: mat.Nombre,
                      text: mat.Nombre,
                    }))}
                    onChange={(e, { value }) => setNombreMateria(value)}
                    value={nombreMateria}
                  />
                </FormField>
              )}

              {/* Contenedor de los botones alineados */}
              <div className="botones-container">
                <span
                  className="boton-reporte"
                  onClick={GenerateReport}
                  disabled={loading}
                >
                  <i
                    className="icono-generar"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                  <span>Generar Reporte</span>
                </span>

                <PDFDownloadLink
                  document={
                    <MyDocument
                      ciudades={ciudades}
                      ciudadesNombre={ciudadesNombre}
                      ReportesProveedores={ReportesProveedores}
                    />
                  }
                  fileName="primer_reporte.pdf"
                  className="link-descarga"
                >
                  {({ loading }) =>
                    loading ? (
                      <Button
                        label="Generando Reporte..."
                        severity="info"
                        disabled
                      />
                    ) : (
                      <Button
                        label="Descargar"
                        severity="success"
                        className="boton-descarga"
                      />
                    )
                  }
                </PDFDownloadLink>
              </div>
            </FormGroup>
          </Form>
        </div>
      </div>

      <article className="Dasboard">Novedades</article>

      <div className="tablas-container">
        {/* Usuarios */}
        <div className="tabla-card">
          <div className="tabla-header">
            <FontAwesomeIcon icon={faUsersGear} className="icono-usuarios" />
            <h3 className="tabla-titulo">Usuarios</h3>
          </div>
          <div className="tabla-contenido">
            <DataTable
              value={Usuarios}
              rows={4}
              tableStyle={{ minWidth: "30rem" }}
            >
              <Column field="nombre" header="Nombre"></Column>
              <Column field="username" header="Usuario"></Column>
              <Column field="rol" header="Rol"></Column>
            </DataTable>
          </div>
        </div>

        {/* Proveedores */}
        <div className="tabla-card">
          <div className="tabla-header">
            <FontAwesomeIcon icon={faTruck} className="icono-proveedores" />
            <h3 className="tabla-titulo">Proveedores</h3>
          </div>
          <div className="tabla-contenido">
            <DataTable
              value={TProveedores}
              rows={4}
              tableStyle={{ minWidth: "30rem" }}
            >
              <Column field="ID" header="#"></Column>
              <Column field="Nombre" header="Nombre"></Column>
              <Column field="Telefono" header="Telefono"></Column>
            </DataTable>
          </div>
        </div>

        {/* Productos */}
        <div className="tabla-card">
          <div className="tabla-header">
            <FontAwesomeIcon icon={faCartFlatbed} className="icono-productos" />
            <h3 className="tabla-titulo">Productos</h3>
          </div>
          <div className="tabla-contenido">
            <DataTable
              value={TMaterias}
              rows={4}
              tableStyle={{ minWidth: "30rem" }}
            >
              <Column field="ID" header="#"></Column>
              <Column field="Nombre" header="Nombre"></Column>
              <Column field="Stock" header="Stock"></Column>
              <Column field="Unidad" header="Unidad"></Column>
            </DataTable>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReportesCombinados;