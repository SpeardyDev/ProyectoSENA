import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { HelmetProvider } from "react-helmet-async";

import HomeAdmin from "./components/HomeAdmin.js";
import HomeEmpleado from "./components/HomeEmpleado.js";
import Login from "./components/Login.js";
import RecuperarContraseña from "./components/Recuperar_Contraseña/RecuperarContraseña.js";
import VerificarCodigo from "./components/Verificar_Codigo/VerificarCodigo.js";
import RutaPrivada from "./backend/routes/privateRoute";

// Define tus rutas como un array
const routes = [
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/RecuperarContraseña",
    element: <RecuperarContraseña />,
  },
  {
    path: "/VerificarCodigo",
    element: <VerificarCodigo />,
  },
  {
    path: "/HomeAdmin",
    element: (
      <RutaPrivada>
        <HomeAdmin />
      </RutaPrivada>
    ),
  },
  {
    path: "/HomeEmpleado",
    element: (
      <RutaPrivada>
        <HomeEmpleado />
      </RutaPrivada>
    ),
  },
];

// Crea el router con los future flags
const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

const App = () => (
  <HelmetProvider>
    <RouterProvider router={router} />
  </HelmetProvider>
);

export default App;