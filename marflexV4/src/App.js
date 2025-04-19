import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import HomeAdmin from "./components/HomeAdmin.js";
import HomeEmpleado from "./components/HomeEmpleado.js";
import Login from "./components/Login.js";
import RecuperarContraseña from "./components/Recuperar_Contraseña/RecuperarContraseña.js";
import VerificarCodigo from "./components/Verificar_Codigo/VerificarCodigo.js";

// Importar AuthProvider y RutaPrivada
import { AuthProvider } from "./context/AuthContext.js";
import RutaPrivada from "./backend/routes/privateRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/RecuperarContraseña" element={<RecuperarContraseña />} />
          <Route path="/VerificarCodigo" element={<VerificarCodigo />} />

          {/* Rutas protegidas */}
          <Route
            path="/HomeAdmin"
            element={
              <RutaPrivada>
                <HomeAdmin />
              </RutaPrivada>
            }
          />
          <Route
            path="/HomeEmpleado"
            element={
              <RutaPrivada>
                <HomeEmpleado />
              </RutaPrivada>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;