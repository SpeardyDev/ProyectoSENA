// ReportesCombinados.jsx
import React, { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "primereact/button";
import { FormGroup, FormField, Form, Select } from "semantic-ui-react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
<<<<<<< HEAD
import { faUsersGear, faTruck, faCartFlatbed, faRightLeft } from "@fortawesome/free-solid-svg-icons";
=======
import {faUsersGear, faTruck, faCartFlatbed, faRightLeft} from "@fortawesome/free-solid-svg-icons";
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
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
  const [Movimientos, setMovimientos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [selectRep, setSelectRep] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [ID, setNombreMateria] = useState("");
  const [inputsVisibles, setInputsVisibles] = useState([]);
  const [datosReporte, setDatosReporte] = useState(null);

  const Filtro = [
<<<<<<< HEAD
    { value: "reporte-entradas-por-fecha", text: "Entradas materia prima por fecha", requires: ["fechaInicio", "fechaFin"] },
    { value: "reporte-inventario-stock", text: "Inventario Stock Actual", requires: [] },
    { value: "reporte-materia-prima-usada", text: "Materia Prima Usada", requires: [] },
    { value: "reporte-movimientos-materia-prima", text: "Movimientos por materia prima", requires: ["nombreMateria"] },
    { value: "reporte-produccion-fechas", text: "Produccion por fecha", requires: ["fechaInicio", "fechaFin"] },
    { value: "reporte-salidas-por-fecha", text: "Salidas materia prima por fecha", requires: ["fechaInicio", "fechaFin"] },
    { value: "reporte-ultima-compra-proveedores", text: "Ultima Compra Proveedores", requires: [] },
    { value: "Todos", text: "Generar todos", requires: [] },
  ];

  useEffect(() => {
    const controller = new AbortController();

    const MostrarUsuarios = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/usuarios", { signal: controller.signal });
        setUsuarios(res.data);
      } catch (err) {
        if (err.name !== "CanceledError") console.error("Error al cargar usuarios:", err);
      }
    };

    const MostrarProveedores = async () => {
      try {
        const res = await axios.get("http://localhost:3000/proveedores", { signal: controller.signal });
        setProveedores(res.data);
      } catch (err) {
        if (err.name !== "CanceledError") console.error("Error al cargar proveedores:", err);
      }
    };

    const MostrarMateriaPrima = async () => {
      try {
        const res = await axios.get("http://localhost:3000/materia_prima", { signal: controller.signal });
        setProductos(res.data);
      } catch (err) {
        if (err.name !== "CanceledError") console.error("Error al cargar materia prima:", err);
      }
    };

    const MostrarMovimientos = async () => {
      try {
        const res = await axios.get("http://localhost:3000/movimientos", { signal: controller.signal });
        setMovimientos(res.data);
      } catch (err) {
        if (err.name !== "CanceledError") console.error("Error al cargar movimientos:", err);
      }
    };

=======
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
  const MostrarMovimientos = async () => {
    const res = await axios.get("http://localhost:3000/movimientos");
    setMovimientos(res.data);
  };

  useEffect(() => {
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
    MostrarUsuarios();
    MostrarMovimientos();
    MostrarProveedores();
    MostrarMateriaPrima();
<<<<<<< HEAD

    return () => {
      controller.abort();
    };
=======
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
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
<<<<<<< HEAD
      if (selectRep.value === "reporte-movimientos-materia-prima") {
        res = await axios.post(`http://localhost:3000/${selectRep.value}`, { materiaPrimaID: ID });
=======

      if (selectRep.value === "reporte-movimientos-materia-prima") {
        res = await axios.post(`http://localhost:3000/${selectRep.value}`, {
          materiaPrimaID: ID,
        });
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
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
<<<<<<< HEAD
      Swal.fire({ title: "Error", text: "Ocurrió un error al generar el reporte.", icon: "error" });
=======
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al generar el reporte.",
        icon: "error",
      });
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
    }
    setLoading(false);
  };

  const GenerateReport = async () => {
<<<<<<< HEAD
    const confirm = await Swal.fire({ title: "¿Generar Reporte?", icon: "question", showCancelButton: true, confirmButtonText: "Sí" });
=======
    const confirm = await Swal.fire({
      title: "¿Generar Reporte?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
    });
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
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
<<<<<<< HEAD
        return <TodosPDF usuarios={usuarios} proveedores={proveedores} productos={productos} />;
=======
        return (
          <TodosPDF
            usuarios={usuarios}
            proveedores={proveedores}
            productos={productos}
          />
        );
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
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
<<<<<<< HEAD
        <p className="reportes-titulo"><i className="icono-reporte"></i>Reportes</p>
=======
        <p className="reportes-titulo">
          <i className="icono-reporte"></i>Reportes
        </p>
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
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
<<<<<<< HEAD
                  <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
=======
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
                </FormField>
              )}

              {inputsVisibles.includes("fechaFin") && (
                <FormField>
                  <label>Fecha Fin</label>
<<<<<<< HEAD
                  <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
=======
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
                </FormField>
              )}

              {inputsVisibles.includes("nombreMateria") && (
                <FormField>
                  <label>Materia Prima</label>
                  <Select
                    placeholder="Selecciona una materia prima"
<<<<<<< HEAD
                    options={productos.map((p) => ({ value: p.ID, text: p.Nombre }))}
=======
                    options={productos.map((p) => ({
                      value: p.ID,
                      text: p.Nombre,
                    }))}
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
                    onChange={(e, { value }) => setNombreMateria(value)}
                    value={ID}
                  />
                </FormField>
              )}

              <div className="botones-container">
<<<<<<< HEAD
                <span className="boton-reporte" onClick={GenerateReport} disabled={loading}>
                  <i className="icono-generar" style={{ fontSize: "1.5rem" }}></i>
=======
                <span
                  className="boton-reporte"
                  onClick={GenerateReport}
                  disabled={loading}
                >
                  <i
                    className="icono-generar"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
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
<<<<<<< HEAD
                        <Button label="Descargar" className="boton-descarga" onClick={descargarManual} />
=======
                        <Button
                          label="Descargar"
                          className="boton-descarga"
                          onClick={descargarManual}
                        />
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
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
<<<<<<< HEAD
          <DataTable value={usuarios.slice(0, 4)} rows={4} tableStyle={{ minWidth: "45rem" }}>
            <Column field="nombre" header="Nombre" style={{ width: '25%' }} />
            <Column field="username" header="Usuario" style={{ width: '25%' }} />
            <Column field="rol" header="Rol" style={{ width: '10%' }} />
=======
          <DataTable
            value={usuarios.slice(0,4)}
            rows={4}
            tableStyle={{ minWidth: "45rem" }}
          >
            <Column field="nombre" header="Nombre" style={{ width: '25%' }} />
            <Column field="username" header="Usuario" style={{ width: '25%' }} />
            <Column field="rol" header="Rol" style={{ width: '10%' }} />

>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
          </DataTable>
        </div>

        <div className="tabla-card">
          <div className="tabla-header">
            <FontAwesomeIcon icon={faTruck} className="icono-proveedores" />
            <h3 className="tabla-titulo">Proveedores</h3>
          </div>
<<<<<<< HEAD
          <DataTable value={proveedores} rows={4}>
=======
          <DataTable
            value={proveedores}
            rows={4}
          >
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
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
<<<<<<< HEAD
          <DataTable value={productos} rows={4}>
=======
          <DataTable
            value={productos}
            rows={4}
          >
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
            <Column field="ID" header="#" />
            <Column field="Nombre" header="Nombre" />
            <Column field="Stock" header="Stock" />
            <Column field="Unidad" header="Unidad" />
          </DataTable>
        </div>
<<<<<<< HEAD

        <div className="tabla-card">
          <div className="tabla-header">
            <FontAwesomeIcon icon={faRightLeft} className="icono-movimientos" />
            <h3 className="tabla-titulo">Movimientos</h3>
          </div>
          <DataTable value={Movimientos.slice(0, 4)} rows={4}>
            <Column field="ID" header="#" style={{ width: '5%' }} />
            <Column field="Tipo" header="Tipo" style={{ width: '20%' }} />
=======
        <div className="tabla-card">
          <div className="tabla-header">
          <FontAwesomeIcon icon={faRightLeft}  className="icono-movimientos" />
            <h3 className="tabla-titulo">Movimientos</h3>
          </div>
          <DataTable
            value={Movimientos.slice(0,4)}
            rows={4}
          >
            <Column field="ID" header="#" style={{ width: '5%' }} />
            <Column field="Tipo" header="Tipo" style={{ width: '20%', alignItems:"center" }}/>
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
            <Column field="Cantidad" header="Cantidad" style={{ width: '20%' }} />
            <Column field="ID_MateriaPrima" header="Materia prima" style={{ width: '25%' }} />
            <Column field="Fecha" header="Fecha" style={{ width: '25%' }} />
          </DataTable>
        </div>
      </div>
    </section>
  );
}

<<<<<<< HEAD
export default ReportesCombinados;
=======
export default ReportesCombinados;
>>>>>>> 32593c77ee071499f6737993ec7c3157a8bfa033
