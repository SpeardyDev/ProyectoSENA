import React, { useState } from "react";
import AddDataTable from './AddDataTable';

function Costurero() {
  const [telas, setTelas] = useState([]);
  const [productos, setProductos] = useState([]);

  return (
    <div>
      <AddDataTable
        title="Registrar Tela Entrante"
        columns={['Tipo de Tela', 'Cantidad', 'Proveedor']}
        data={telas}
        setData={setTelas}
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

export default Costurero;
