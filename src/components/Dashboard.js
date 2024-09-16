import React from "react";
import Administrador from './Administrador';
import Costurero from './Costurero';
import Parrillero from './Parrillero';

function Dashboard({ user }) {
  return (
    <div className="container mt-5">
      <h2 className="text-center">Bienvenido {user.username}</h2>
      {user.role === "Administrador" && <Administrador />}
      {user.role === "Costurero" && <Costurero />}
      {user.role === "Parrillero" && <Parrillero />}
    </div>
  );
}

export default Dashboard;
