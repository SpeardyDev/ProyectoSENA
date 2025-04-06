import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logoUrl from "./img/LogoMarflexPDF.png";

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
    fontSize: 16,
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

const EntradasPorFechaPDF = ({ data }) => {
  const currentDate = new Date().toLocaleString("es-CO");
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header: Logo + Fecha */}
        <View style={styles.headerContainer}>
          <Image src={logoUrl} style={styles.logo} />
          <Text style={styles.dateText}>{currentDate}</Text>
        </View>

        {/* Título */}
        <Text style={styles.sectionTitle}>
          Entradas de Materias Primas por Fecha
        </Text>

        {/* Tabla */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableTitulo}>Nombre</Text>
            <Text style={styles.tableTitulo}>Cantidad</Text>
            <Text style={styles.tableTitulo}>Proveedor</Text>
            <Text style={styles.tableTitulo}>Fecha</Text>
          </View>

          {data.map((item, i) => (
            <View style={styles.tableRow} key={i}>
              <Text style={styles.tableCell}>{item.Nombre_MateriaPrima}</Text>
              <Text style={styles.tableCell}>{item.Cantidad}</Text>
              <Text style={styles.tableCell}>{item.Proveedor}</Text>
              <Text style={styles.tableCell}>{item.Fecha}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Generado automáticamente por el sistema de Marflex.{" "}
        </Text>
      </Page>
    </Document>
  );
};

export default EntradasPorFechaPDF;