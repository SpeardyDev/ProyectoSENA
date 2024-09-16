import React, { useState } from "react";
import AddDataTable from './AddDataTable';

function Parrillero() {
  const [parrillasEntrantes, setParrillasEntrantes] = useState([]);
  const [parrillasSalientes, setParrillasSalientes] = useState([]);
  const [productos, setProductos] = useState([]);

  return (
    <div>
      <AddDataTable
        title="Registrar Parrillas Entrantes"
        columns={['Tipo de Parrilla', 'Cantidad', 'Proveedor']}
        data={parrillasEntrantes}
        setData={setParrillasEntrantes}
      />
      <AddDataTable
        title="Registrar Parrillas Salientes"
        columns={['Tipo de Parrilla', 'Cantidad', 'Destino']}
        data={parrillasSalientes}
        setData={setParrillasSalientes}
      />
      <AddDataTable
        title="Registrar Productos Generados"
        columns={['Producto', 'Cantidad', 'Fecha de Producción']}
        data={productos}
        setData={setProductos}
      />
    </div>
  );
}

export default Parrillero;
