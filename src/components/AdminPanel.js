import React from "react";

function AdminPanel() {
  return (
    <div className="container mt-5">
      <h2>Panel de Administrador</h2>
      <button className="btn btn-success m-2">Agregar Usuario</button>
      <button className="btn btn-warning m-2">Editar Usuario</button>
      <button className="btn btn-danger m-2">Eliminar Usuario</button>
    </div>
  );
}

export default AdminPanel;
