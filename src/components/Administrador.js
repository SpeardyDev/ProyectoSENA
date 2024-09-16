import React, { useState } from "react";
import AddDataTable from './AddDataTable';

function Administrador() {
  const [empleados, setEmpleados] = useState([]);

  const columns = ['Nombre', 'Email', 'Rol'];

  return (
    <div>
      <AddDataTable
        title="Administrar Empleados"
        columns={columns}
        data={empleados}
        setData={setEmpleados}
      />
    </div>
  );
}

export default Administrador;
