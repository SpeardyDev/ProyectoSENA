import React, { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyDocument from "./DocumentoReportes/MyDocument";
import { Button } from "primereact/button";
import { FormGroup, FormField, Form, Select } from 'semantic-ui-react';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsersGear, faTruck, faCartFlatbed } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Swal from "sweetalert2";
import "./styles/Reportes.css";


function ReportesCombinados() {
  const [codigoProveedor, setCodigoProveedor] = useState("");
  const [TProveedores, setProveedores] = useState([]);
  const [TMaterias, setTMaterias] = useState([]);
  const [Usuarios, setUsuarios] = useState([])
  const [codigodeptos, setCodigoDeptos] = useState("");
  const [selectCiu, setSelectCiu] = useState(null);
  const [ciudades, setCiudades] = useState([]);
  const [ciudadesNombre, setCiudadesNombre] = useState([]);
  const [ReportesProveedores, setReporProveedores] = useState([]);
  const [loading, setLoading] = useState(false);

  const Filtro = [
    { value: "api/reporte-entradas-materia-prima", text: "Entradas Materia Prima" },
    { value: "api/reporte-inventario-stock-actual", text: "Inventario Stock Actual" },
    { value: "api/reporte-materia-prima-usada", text: "Materia Prima Usada" },
    { value: "api/reporte-salidas-materia-prima", text: "Salidas Materia Prima" },
    { value: "api/reporte-ultima-compra-proveedores", text: "Ultima Compra Proveedores" },
    { value: "Todos", text: "Generar todos" }
  ];
  useEffect(() => {
    const generarTodos = async () => {
      if (selectCiu?.value === "Todos") {
        try {
          const [ResUsuarios, ResProveedores, ResProductos] = await Promise.all([
            axios.get("http://localhost:3000/api/usuarios"),
            axios.get("http://localhost:3000/proveedores"),
            axios.get("http://localhost:3000/materia_prima"),
          ]);
  
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
  }, [selectCiu]);

///MOSTRAR ULTIMOS 4 PROVEEDORES
  const MostrarProveedores = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/proveedores"
      );
      setProveedores(response.data);
    } catch (error) {
      console.error("Error fetching proveedores:", error);
    }
  };
///MOSTRAR ULTIMOS 4 USUARIOS 
  const MostrarUsuarios = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/usuarios"
      );
      
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
      let data = [];
  
      if (codigoProveedor) {
        // Buscar por código de proveedor
        const ResCiudad = await axios.get(
          `http://localhost:3000/proveedores/${codigoProveedor}`
        );
        data = ResCiudad.data;
        setCiudades(data);
      } else if (selectCiu) {
        // Buscar por la ruta seleccionada en el select
        const ResciudadNombre = await axios.get(
          `http://localhost:3000/${selectCiu.value}`
        );
        data = ResciudadNombre.data;
        if (selectCiu.value==='api/usuarios' ) {
          setCiudadesNombre(data);
        } else if (selectCiu.value==='proveedores') {
          setReporProveedores(data);
        }else{
          setCiudades(data);
        }
        
        
      } else {
        // Si no se selecciona nada, cargar un reporte vacío o mostrar un mensaje
        Swal.fire({
          icon: "info",
          title: "Sin datos",
          text: "Por favor selecciona un criterio de búsqueda.",
        });
      }
    } catch (err) {
      console.error("Error Buscar ciudades:", err);
    }
    setLoading(false);
  };

  const GenerateReport = () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success btn-success-reportes",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
  
    swalWithBootstrapButtons
      .fire({
        title: "¿Quieres Generar este reporte?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Generar reporte",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          BtnBuscar();
          
          swalWithBootstrapButtons.fire(
            "Generado!",
            "El reporte ha sido generado.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelado",
            "No se generó ningún reporte :)",
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
              <Select
                placeholder="Nombre"
                options={Filtro}
                name="Nombre"
                onChange={(e, { value }) =>
                  setSelectCiu(Filtro.find((n) => n.value === value))
                }
                id="codigoCiudad"
                value={selectCiu?.value}
              />
  
              <FormField
                name="Direccion"
                value={codigoProveedor}
                onChange={(e) => setCodigoProveedor(e.target.value)}
                control="input"
                placeholder="Codigo"
              />
              <FormField
                id="codigoDeptos"
                name="Direccion"
                value={codigodeptos}
                onChange={(e) => setCodigoDeptos(e.target.value)}
                control="input"
                placeholder="Nombre"
              />
              
              {/* Contenedor de los botones alineados */}
              <div className="botones-container">
                <span
                  className="boton-reporte"
                  onClick={GenerateReport}
                  disabled={loading}
                >
                  <i className="icono-generar" style={{ fontSize: "1.5rem" }}></i>
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
                      <Button label="Generando Reporte..." severity="info" disabled />
                    ) : (
                      <Button label="Descargar" severity="success" className="boton-descarga" />
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
            <DataTable value={Usuarios} rows={4} tableStyle={{ minWidth: "30rem" }}>
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
            <DataTable value={TProveedores} rows={4} tableStyle={{ minWidth: "30rem" }}>
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
            <DataTable value={TMaterias} rows={4} tableStyle={{ minWidth: "30rem" }}>
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
