import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
  const token = localStorage.getItem("token");
  console.log("TOKEN EN LOCALSTORAGE:", token);
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("DECODED TOKEN:", decoded);
      if (decoded.exp * 1000 > Date.now()) {
        setIsAuthenticated(true);
        console.log("Token válido, autenticado!");
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        console.log("Token expirado.");
      }
    } catch (e) {
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      console.log("Token inválido.");
    }
  } else {
    setIsAuthenticated(false);
    console.log("No hay token.");
  }
}, []);

  const login = () => setIsAuthenticated(true);

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};