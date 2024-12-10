/* eslint-disable react/prop-types */
import LogoSena from "./img/LogoMarflexPDF.png";
import {
  StyleSheet,
  Text,
  Page,
  Document,
  Image,
  View,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 40,
    backgroundColor: "#F9F9F9",
  },
  paragraph: {
    fontSize: 12,
    color: "#333333",
    lineHeight: 1.5,
    textAlign: "justify",
    marginVertical: 10,
  },
  footer: {
    fontSize: 10,
    color: "#666666",
    textAlign: "center",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
  sectionTitle: {
    fontSize: 18,
    marginVertical: 10,
    color: "#0A6EBD",
    fontWeight: "bold",
  },
  table: {
    display: "table",
    width: "auto",
    borderColor: "#bfbfbf",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableTitulo: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    padding: 5,
    textAlign: "center",
    fontSize: 16,
    fontWeight: 600,
  },
  tableCell: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    padding: 5,
    textAlign: "center",
    fontSize: 12,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
});

const ReportTable = ({ ciudades, ciudadesNombre, ReportesProveedores }) => (
  <View style={styles.table}>
    {ciudadesNombre.length > 0 && (
      <>
        <Text style={styles.sectionTitle}>Usuarios</Text>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableTitulo}>Documento</Text>
          <Text style={styles.tableTitulo}>Usuario</Text>
          <Text style={styles.tableTitulo}>Rol</Text>
          <Text style={styles.tableTitulo}>Telefono</Text>
        </View>
        {ciudadesNombre
        .filter((usuario) =>
          usuario.documento && usuario.username && usuario.rol && usuario.telefono
      )
      .map((usuario, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.tableCell}>{usuario.documento}</Text>
          <Text style={styles.tableCell}>{usuario.username}</Text>
          <Text style={styles.tableCell}>{usuario.rol}</Text>
          <Text style={styles.tableCell}>{usuario.telefono}</Text>
        </View>
      ))}
      </>
    )}

    {ReportesProveedores.length > 1 && (
      <>
        <Text style={styles.sectionTitle}>Proveedores</Text>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableTitulo}>Codigo</Text>
          <Text style={styles.tableTitulo}>Nombre</Text>
          <Text style={styles.tableTitulo}>Telefono</Text>
          <Text style={styles.tableTitulo}>Direccion</Text>
          <Text style={styles.tableTitulo}>Barrio</Text>
        </View>
        {ReportesProveedores.filter((proveedor) =>
          proveedor.ID && proveedor.Nombre && proveedor.Telefono1 && proveedor.Direccion && proveedor.Barrio
      )
      .map((proveedor, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.tableCell}>{proveedor.ID}</Text>
          <Text style={styles.tableCell}>{proveedor.Nombre}</Text>
          <Text style={styles.tableCell}>{proveedor.Telefono1}</Text>
          <Text style={styles.tableCell}>{proveedor.Direccion}</Text>
          <Text style={styles.tableCell}>{proveedor.Barrio}</Text>
        </View>
      ))}
      </>
    )}

    {ciudades.length > 0 && (
      <>
        <Text style={styles.sectionTitle}>Productos</Text>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableTitulo}>Codigo</Text>
          <Text style={styles.tableTitulo}>Nombre</Text>
          <Text style={styles.tableTitulo}>Cantidad max</Text>
          <Text style={styles.tableTitulo}>Cantidad min</Text>
          <Text style={styles.tableTitulo}>Fecha de Ingreso</Text>
          <Text style={styles.tableTitulo}>Precio</Text>
        </View>
        {ciudades.map((producto, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{producto.ID}</Text>
            <Text style={styles.tableCell}>{producto.Nombre}</Text>
            <Text style={styles.tableCell}>{producto.Cantidad}</Text>
            <Text style={styles.tableCell}>{producto.StockMinimo}</Text>
            <Text style={styles.tableCell}>{producto.FechaIngreso}</Text>
            <Text style={styles.tableCell}>{producto.Precio}</Text>
          </View>
        ))}
      </>
    )}
  </View>
);


const MyDocument = ({ciudades, ciudadesNombre,ReportesProveedores}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text>
        <Image src={LogoSena} style={{ width: "400px", height: "300px" }} />
      </Text>
      <Text style={styles.sectionTitle}>Reportes</Text>
      <ReportTable ciudadesNombre={ciudadesNombre} ciudades={ciudades} ReportesProveedores={ReportesProveedores}   />
      <Text style={styles.footer}>
        © 2024 SENA.
      </Text>
    </Page>
  </Document>
);

export default MyDocument;
