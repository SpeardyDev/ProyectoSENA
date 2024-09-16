import React from "react";

function ParrilleroPanel() {
  return (
    <div className="container mt-5">
      <h2>Panel de Parrillero</h2>
      <button className="btn btn-primary m-2">Agregar Parrillas Entrantes</button>
      <button className="btn btn-warning m-2">Agregar Parrillas Salientes</button>
      <button className="btn btn-secondary m-2">Registrar Productos Generados</button>
    </div>
  );
}

export default ParrilleroPanel;
