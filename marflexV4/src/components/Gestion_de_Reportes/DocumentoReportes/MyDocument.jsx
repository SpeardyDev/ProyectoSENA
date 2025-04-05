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

const ReportTable = ({ mPrimas = [], usuarios = [], proveedores = [] }) => (
  <View style={styles.table}>
    {usuarios?.length > 0 && (
      <>
        <Text style={styles.sectionTitle}>Usuarios</Text>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableTitulo}>Documento</Text>
          <Text style={styles.tableTitulo}>Usuario</Text>
          <Text style={styles.tableTitulo}>Rol</Text>
          <Text style={styles.tableTitulo}>Estado</Text>
          <Text style={styles.tableTitulo}>Teléfono</Text>
        </View>
        {usuarios
          ?.filter(
            (u) =>
              u.documento && u.username && u.rol && u.estado && u.telefono
          )
          .map((u, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tableCell}>{u.documento}</Text>
              <Text style={styles.tableCell}>{u.username}</Text>
              <Text style={styles.tableCell}>{u.rol}</Text>
              <Text style={styles.tableCell}>{u.estado}</Text>
              <Text style={styles.tableCell}>{u.telefono}</Text>
            </View>
          ))}
      </>
    )}

    {proveedores?.length > 0 && (
      <>
        <Text style={styles.sectionTitle}>Proveedores</Text>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableTitulo}>ID</Text>
          <Text style={styles.tableTitulo}>Nombre</Text>
          <Text style={styles.tableTitulo}>Teléfono</Text>
          <Text style={styles.tableTitulo}>Dirección</Text>
        </View>
        {proveedores
          ?.filter(
            (p) => p.ID && p.Nombre && p.Telefono && p.Direccion
          )
          .map((p, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tableCell}>{p.ID}</Text>
              <Text style={styles.tableCell}>{p.Nombre}</Text>
              <Text style={styles.tableCell}>{p.Telefono}</Text>
              <Text style={styles.tableCell}>{p.Direccion}</Text>
            </View>
          ))}
      </>
    )}

    {mPrimas?.length > 0 && (
      <>
        <Text style={styles.sectionTitle}>Materias Primas</Text>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableTitulo}>ID</Text>
          <Text style={styles.tableTitulo}>Nombre</Text>
          <Text style={styles.tableTitulo}>Descripción</Text>
          <Text style={styles.tableTitulo}>Stock</Text>
          <Text style={styles.tableTitulo}>Unidad</Text>
        </View>
        {mPrimas?.map((m, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.tableCell}>{m.ID}</Text>
            <Text style={styles.tableCell}>{m.Nombre}</Text>
            <Text style={styles.tableCell}>{m.Descripcion}</Text>
            <Text style={styles.tableCell}>{m.Stock}</Text>
            <Text style={styles.tableCell}>{m.Unidad}</Text>
          </View>
        ))}
      </>
    )}
  </View>
);

const MyDocument = ({ mPrimas = [], usuarios = [], proveedores = [] }) => {
  console.log("📄 Datos en MyDocument:", { mPrimas, usuarios, proveedores });
  return (
    <Document>
    <Page size="A4" style={styles.page}>
      <Text>
        <Image src={LogoSena} style={{ width: "400px", height: "300px" }} />
      </Text>
      <Text style={styles.sectionTitle}>Reportes</Text>
      <ReportTable
        usuarios={usuarios}
        mPrimas={mPrimas}
        proveedores={proveedores}
      />
      <Text style={styles.footer}>© 2024 SENA.</Text>
    </Page>
  </Document>
  );
};

export default MyDocument;