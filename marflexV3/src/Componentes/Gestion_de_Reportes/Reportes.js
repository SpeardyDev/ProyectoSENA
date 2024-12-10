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
  const [TProductos, setTProductos] = useState([]);
  const [Usuarios, setUsuarios] = useState([])
  const [codigodeptos, setCodigoDeptos] = useState("");
  const [selectCiu, setSelectCiu] = useState(null);
  const [ciudades, setCiudades] = useState([]);
  const [ciudadesNombre, setCiudadesNombre] = useState([]);
  const [ReportesProveedores, setReporProveedores] = useState([]);
  const [loading, setLoading] = useState(false);

  const Filtro = [
    { value: "api/usuarios", text: "Usuarios" },
    { value: "api/ultimos/proveedores", text: "Proveedores" },
    { value: "api/ultimos/productos", text: "Productos" },
    { value: "Todos", text: "Generar todos" },
  ];
  useEffect(() => {
    const generarTodos = async () => {
      if (selectCiu?.value === "Todos") {
        try {
          const [ResUsuarios, ResProveedores, ResProductos] = await Promise.all([
            axios.get("http://localhost:3000/api/usuarios"),
            axios.get("http://localhost:3000/api/ultimos/proveedores"),
            axios.get("http://localhost:3000/api/ultimos/productos"),
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
    MostrarProductos();
    generarTodos(); 
  }, [selectCiu]);
///MOSTRAR ULTIMOS 4 PROVEEDORES
  const MostrarProveedores = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/ultimos/proveedores"
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
      console.error("Error Mostrar productos:", error);
    }
  };

///MOSTRAR ULTIMOS 4 PRODUCTOS
const MostrarProductos = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/ultimos/productos");
    setTProductos(response.data);
  } catch (error) {
    console.error("Error fetching proveedores:", error);
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
          `http://localhost:3000/api/proveedores/consultar/${codigoProveedor}`
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
        } else if (selectCiu.value==='api/ultimos/proveedores') {
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
      <div className="titulo">
        <p>
          <i className="fas fa-chart-bar Titulo-p-reportes"></i>Reportes
        </p>
      </div>

      <div className="contenedor-filtro-reportes">
        <div className="contenedor-inpus-filtro-reportes-1">
          <Form>
            <FormGroup widths="equal">
              <Select
                placeholder="Nombre"
                options={Filtro}
                name="Nombre"
                onChange={(e, { value }) =>
                  setSelectCiu(Filtro.find((n) => n.value === value))}
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
            </FormGroup>
          </Form>
          <span
            className="icon-text-reporte"
            onClick={GenerateReport}
            disabled={loading}
          >
            <i className="pi pi-upload" style={{ fontSize: "1.5rem" }}></i>
            <span>Generar Reporte</span>
          </span>
        </div>
        <div className="contenedor-inpus-filtro-reportes-2">
          <div className="contenedor-Btn">
            {loading ? (
              <Button label="Cargando..." severity="info" disabled />
            ) : (
              <PDFDownloadLink
                document={
                  <MyDocument
                    ciudades={ciudades}
                    ciudadesNombre={ciudadesNombre}
                    ReportesProveedores={ReportesProveedores}
                  />
                }
                fileName="primer_reporte.pdf"
                className="Btn"
              >
                {({ loading }) =>
                  loading ? (
                    <Button label="Generando Reporte..." severity="info" disabled/>
                  ) : (
                    <Button label="Descargar" severity="success" className="btn-descargar"/>)}
              </PDFDownloadLink>
            )}
          </div>
        </div>
      </div>
      <article className="dasboard-productos">Novedades</article>

      <div className="contenedor-Reportes">
        <div className="Tabla-reporte">
          <div className="Reporte-titulo">
            <FontAwesomeIcon icon={faUsersGear} style={{ color: "#2196F3" }} />
            <h3 className="Reporte-titulo-usuarios">Usuarios</h3>
          </div>
          <div className="Reporte-content-tabla">
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
        <div className="Tabla-reporte">
          <div className="Reporte-titulo">
            <FontAwesomeIcon icon={faTruck} style={{ color: "#FF9800" }} />
            <h3 className="Reporte-titulo-usuarios">Proveedores</h3>
          </div>
          <div className="Reporte-content-tabla">
            <DataTable
              value={TProveedores}
              rows={4}
              tableStyle={{ minWidth: "30rem" }}
            >
              <Column field="ID" header="#"></Column>
              <Column field="Nombre" header="Nombre"></Column>
              <Column field="Telefono1" header="Teléfono"></Column>
              <Column field="Ciudad" header="Ciudad"></Column>
            </DataTable>
          </div>
        </div>
        <div className="Tabla-reporte">
          <div className="Reporte-titulo">
            <FontAwesomeIcon
              icon={faCartFlatbed}
              style={{ color: "#F44336" }}
            />
            <h3 className="Reporte-titulo-usuarios">Productos</h3>
          </div>
          <div className="Reporte-content-tabla">
            <DataTable
              value={TProductos}
              rows={4}
              tableStyle={{ minWidth: "30rem" }}
            >
              <Column field="ID" header="#"></Column>
              <Column field="Nombre" header="Nombre"></Column>
              <Column field="Cantidad" header="Stock"></Column>
              <Column field="FechaIngreso" header="Fecha In"></Column>
            </DataTable>
          </div>
        </div>
        <div className="Tabla-reporte">
          <div className="Reporte-titulo">
            <FontAwesomeIcon icon={faCartFlatbed} />
            <h3 className="Reporte-titulo-usuarios">XXXXX</h3>
          </div>
        </div>
        <div className="Tabla-reporte">
          <div className="Reporte-titulo">
            <FontAwesomeIcon icon={faCartFlatbed} />
            <h3 className="Reporte-titulo-usuarios">XXXXX</h3>
          </div>
        </div>
        <div className="Tabla-reporte">
          <div className="Reporte-titulo">
            <FontAwesomeIcon icon={faCartFlatbed} />
            <h3 className="Reporte-titulo-usuarios">XXXXX</h3>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReportesCombinados;
