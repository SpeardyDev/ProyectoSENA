// ReportesCombinados.jsx
import React, { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
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

// Documentos PDF específicos por tipo de reporte
import EntradasPorFechaPDF from "./DocumentoReportes/EntradasPorFechaPDF";
import InventarioStockPDF from "./DocumentoReportes/InventarioStockPDF";
import MateriaUsadaPDF from "./DocumentoReportes/MateriaUsadaPDF";
import MovimientosMateriaPDF from "./DocumentoReportes/MovimientosMateriaPDF";
import ProduccionFechaPDF from "./DocumentoReportes/ProduccionFechaPDF";
import SalidasFechaPDF from "./DocumentoReportes/SalidasFechaPDF";
import UltimaCompraPDF from "./DocumentoReportes/UltimaCompraPDF";
import TodosPDF from "./DocumentoReportes/TodosPDF";

function ReportesCombinados() {
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [selectRep, setSelectRep] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [ID, setNombreMateria] = useState("");
  const [inputsVisibles, setInputsVisibles] = useState([]);
  const [datosReporte, setDatosReporte] = useState(null);

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
    { value: "Todos", text: "Generar todos", requires: [] },
  ];

  const MostrarUsuarios = async () => {
    const res = await axios.get("http://localhost:3000/api/usuarios");
    setUsuarios(res.data);
  };

  const MostrarProveedores = async () => {
    const res = await axios.get("http://localhost:3000/proveedores");
    setProveedores(res.data);
  };

  const MostrarMateriaPrima = async () => {
    const res = await axios.get("http://localhost:3000/materia_prima");
    setProductos(res.data);
  };

  useEffect(() => {
    MostrarUsuarios();
    MostrarProveedores();
    MostrarMateriaPrima();
  }, []);

  const handleSelectChange = (e, { value }) => {
    const selected = Filtro.find((f) => f.value === value);
    setSelectRep(selected);
    setInputsVisibles(selected?.requires || []);
  };

  const BtnBuscar = async () => {
    setLoading(true);
    try {
      let res;

      if (selectRep.value === "reporte-movimientos-materia-prima") {
        res = await axios.post(`http://localhost:3000/${selectRep.value}`, {
          materiaPrimaID: ID,
        });
      } else if (
        selectRep.value === "reporte-entradas-por-fecha" ||
        selectRep.value === "reporte-salidas-por-fecha" ||
        selectRep.value === "reporte-produccion-fechas"
      ) {
        res = await axios.post(`http://localhost:3000/${selectRep.value}`, {
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
        });
      } else {
        const params = new URLSearchParams();
        if (fechaInicio) params.append("fechaInicio", fechaInicio);
        if (fechaFin) params.append("fechaFin", fechaFin);
        if (ID) params.append("nombreMateria", ID);

        let url = `http://localhost:3000/${selectRep.value}`;
        if (params.toString()) url += `?${params.toString()}`;

        res = await axios.get(url);
      }

      setDatosReporte(res.data);
      console.log("Datos del reporte:", res.data);
    } catch (err) {
      console.error("Error generando el reporte:", err);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al generar el reporte.",
        icon: "error",
      });
    }
    setLoading(false);
  };

  const GenerateReport = async () => {
    const confirm = await Swal.fire({
      title: "¿Generar Reporte?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
    });
    if (confirm.isConfirmed) await BtnBuscar();
  };

  const getDocumento = () => {
    switch (selectRep?.value) {
      case "reporte-entradas-por-fecha":
        return <EntradasPorFechaPDF data={datosReporte} />;
      case "reporte-inventario-stock":
        return <InventarioStockPDF data={datosReporte} />;
      case "reporte-materia-prima-usada":
        return <MateriaUsadaPDF data={datosReporte} />;
      case "reporte-movimientos-materia-prima":
        return <MovimientosMateriaPDF data={datosReporte} />;
      case "reporte-produccion-fechas":
        return <ProduccionFechaPDF data={datosReporte} />;
      case "reporte-salidas-por-fecha":
        return <SalidasFechaPDF data={datosReporte} />;
      case "reporte-ultima-compra-proveedores":
        return <UltimaCompraPDF data={datosReporte} />;
      case "Todos":
        return (
          <TodosPDF
            usuarios={usuarios}
            proveedores={proveedores}
            productos={productos}
          />
        );
      default:
        return null;
    }
  };

  const descargarManual = async () => {
    const blob = await pdf(getDocumento()).toBlob();
    FileSaver.saveAs(blob, "reporte_manual.pdf");
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
                  onChange={handleSelectChange}
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
                    options={productos.map((p) => ({
                      value: p.ID,
                      text: p.Nombre,
                    }))}
                    onChange={(e, { value }) => setNombreMateria(value)}
                    value={ID}
                  />
                </FormField>
              )}

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

                {datosReporte && (
                  <PDFDownloadLink
                    document={getDocumento()}
                    fileName="reporte_generado.pdf"
                    className="link-descarga"
                  >
                    {({ loading }) =>
                      loading ? (
                        <Button label="Generando..." disabled />
                      ) : (
                        <Button
                          label="Descargar"
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
        <div className="tabla-card">
          <div className="tabla-header">
            <FontAwesomeIcon icon={faUsersGear} className="icono-usuarios" />
            <h3 className="tabla-titulo">Usuarios</h3>
          </div>
          <DataTable
            value={usuarios}
            rows={4}
            tableStyle={{ minWidth: "30rem" }}
          >
            <Column field="nombre" header="Nombre" />
            <Column field="username" header="Usuario" />
            <Column field="rol" header="Rol" />
          </DataTable>
        </div>

        <div className="tabla-card">
          <div className="tabla-header">
            <FontAwesomeIcon icon={faTruck} className="icono-proveedores" />
            <h3 className="tabla-titulo">Proveedores</h3>
          </div>
          <DataTable
            value={proveedores}
            rows={4}
            tableStyle={{ minWidth: "30rem" }}
          >
            <Column field="ID" header="#" />
            <Column field="Nombre" header="Nombre" />
            <Column field="Telefono" header="Telefono" />
          </DataTable>
        </div>

        <div className="tabla-card">
          <div className="tabla-header">
            <FontAwesomeIcon icon={faCartFlatbed} className="icono-productos" />
            <h3 className="tabla-titulo">Materias Primas</h3>
          </div>
          <DataTable
            value={productos}
            rows={4}
            tableStyle={{ minWidth: "30rem" }}
          >
            <Column field="ID" header="#" />
            <Column field="Nombre" header="Nombre" />
            <Column field="Stock" header="Stock" />
            <Column field="Unidad" header="Unidad" />
          </DataTable>
        </div>
      </div>
    </section>
  );
}

export default ReportesCombinados;