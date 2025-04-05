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
import { pdf } from "@react-pdf/renderer";
import FileSaver from "file-saver";

function ReportesCombinados() {
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [selectRep, setSelectRep] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [nombreMateria, setNombreMateria] = useState("");
  const [inputsVisibles, setInputsVisibles] = useState([]);

  const Filtro = [
    {
      value: "reporte-entradas-por-fecha",
      text: "Entradas materia prima por fecha",
      requires: ["fechaInicio", "fechaFin"],
    },
    {
      value: "reporte-inventario-stock",
      text: "Inventario Stock Actual",
      requires: [],
    },
    {
      value: "reporte-materia-prima-usada",
      text: "Materia Prima Usada",
      requires: [],
    },
    {
      value: "reporte-movimientos-materia-prima",
      text: "Movimientos por materia prima",
      requires: ["nombreMateria"],
    },
    {
      value: "reporte-produccion-fechas",
      text: "Produccion por fecha",
      requires: ["fechaInicio", "fechaFin"],
    },
    {
      value: "reporte-salidas-por-fecha",
      text: "Salidas materia prima por fecha",
      requires: ["fechaInicio", "fechaFin"],
    },
    {
      value: "reporte-ultima-compra-proveedores",
      text: "Ultima Compra Proveedores",
      requires: [],
    },
    { value: "Todos", text: "Generar todos" },
  ];

  const [datosReporte, setDatosReporte] = useState({
    productos: [],
    usuarios: [],
    proveedores: [],
  });

  const [reporteListo, setReporteListo] = useState(false);

  const descargarManual = async () => {
    const blob = await pdf(
      <MyDocument ciudades={datosReporte.productos} />
    ).toBlob();
    FileSaver.saveAs(blob, "reporte_manual.pdf");
  };

  useEffect(() => {
    setReporteListo(true); // Indica que los datos del reporte ya están cargados
  }, [datosReporte]);

  useEffect(() => {
    const generarTodos = async () => {
      if (selectRep?.value === "Todos") {
        try {
          const [resUsuarios, resProveedores, resProductos] = await Promise.all(
            [
              axios.get("http://localhost:3000/api/usuarios"),
              axios.get("http://localhost:3000/proveedores"),
              axios.get("http://localhost:3000/materia_prima"),
            ]
          );

          setUsuarios(resUsuarios.data);
          setProveedores(resProveedores.data);
          setProductos(resProductos.data);
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
      setProveedores(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching proveedores:", error);
    }
  };
  ///MOSTRAR ULTIMOS 4 USUARIOS
  const MostrarUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/usuarios");
      setUsuarios(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching usuarios:", error);
    }
  };

  ///MOSTRAR ULTIMOS 4 PRODUCTOS
  const MostrarMateriaPrima = async () => {
    try {
      const response = await axios.get("http://localhost:3000/materia_prima");
      setProductos(Array.isArray(response.data) ? response.data : []);
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

      const queryString = queryParams.join("&");
      const url = `http://localhost:3000/${selectRep.value}?${queryString}`;
      console.log("🚀 URL generada para reporte:", url);

      const response = await axios.get(url);
      console.log("📌 Respuesta del servidor:", response.data);

      const datosRecibidos = Array.isArray(response.data) ? response.data[0] : response.data;

      // Guardamos los datos en el estado para el PDF
      setDatosReporte({
        productos: datosRecibidos || [],
        usuarios,
        proveedores,
      });
    } catch (err) {
      console.error("Error al buscar reportes:", err);
    }
    setLoading(false);
  };

  const GenerateReport = async () => {
    const result = await Swal.fire({
      title: "¿Quieres Generar este reporte?",
      text: "Esta acción generará el reporte seleccionado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, generar",
    });

    if (result.isConfirmed) {
      await BtnBuscar(); // <-- espera a que se actualicen los datos

      Swal.fire(
        "¡Generado!",
        "El reporte ha sido generado correctamente.",
        "success"
      );
    } else {
      Swal.fire("Cancelado", "No se generó ningún reporte.", "error");
    }
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
                    options={productos?.map((mat) => ({
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

                {reporteListo && (
                  <PDFDownloadLink
                    document={<MyDocument ciudades={datosReporte.productos} />}
                    fileName="reporte_generado.pdf"
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
                          onClick={descargarManual}
                        />
                      )
                    }
                  </PDFDownloadLink>
                )}
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
              value={usuarios}
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
              value={proveedores}
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
            <h3 className="tabla-titulo">Materias Primas</h3>
          </div>
          <div className="tabla-contenido">
            <DataTable
              value={productos}
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