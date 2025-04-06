import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logoUrl from "./img/LogoMarflexPDF.png"; // Asegúrate que la ruta sea correcta

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 40,
    backgroundColor: "#F9F9F9",
  },
  logo: {
    width: 120,
    height: 50,
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 10,
    color: "#666",
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
    marginTop: 10,
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
    fontSize: 14,
    fontWeight: 600,
    backgroundColor: "#e0e0e0",
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
  footer: {
    fontSize: 10,
    color: "#666666",
    textAlign: "center",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
});

const TodosPDF = ({ usuarios, proveedores, productos }) => {
  const currentDate = new Date().toLocaleString("es-CO");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header con logo y fecha */}
        <View style={styles.headerContainer}>
          <Image src={logoUrl} style={styles.logo} />
          <Text style={styles.dateText}>{currentDate}</Text>
        </View>

        {/* Usuarios */}
        <Text style={styles.sectionTitle}>Usuarios</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableTitulo}>Nombre</Text>
            <Text style={styles.tableTitulo}>Username</Text>
            <Text style={styles.tableTitulo}>Rol</Text>
          </View>
          {usuarios.map((u, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tableCell}>{u.nombre}</Text>
              <Text style={styles.tableCell}>{u.username}</Text>
              <Text style={styles.tableCell}>{u.rol}</Text>
            </View>
          ))}
        </View>

        {/* Proveedores */}
        <Text style={styles.sectionTitle}>Proveedores</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableTitulo}>ID</Text>
            <Text style={styles.tableTitulo}>Nombre</Text>
            <Text style={styles.tableTitulo}>Teléfono</Text>
          </View>
          {proveedores.map((p, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tableCell}>{p.ID}</Text>
              <Text style={styles.tableCell}>{p.Nombre}</Text>
              <Text style={styles.tableCell}>{p.Telefono}</Text>
            </View>
          ))}
        </View>

        {/* Materias Primas */}
        <Text style={styles.sectionTitle}>Materias Primas</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableTitulo}>ID</Text>
            <Text style={styles.tableTitulo}>Nombre</Text>
            <Text style={styles.tableTitulo}>Stock</Text>
            <Text style={styles.tableTitulo}>Unidad</Text>
          </View>
          {productos.map((p, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tableCell}>{p.ID}</Text>
              <Text style={styles.tableCell}>{p.Nombre}</Text>
              <Text style={styles.tableCell}>{p.Stock}</Text>
              <Text style={styles.tableCell}>{p.Unidad}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Generado automáticamente por el sistema de Marflex.
        </Text>
      </Page>
    </Document>
  );
};

export default TodosPDF;