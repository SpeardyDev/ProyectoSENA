import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true); // Si existe el token, el usuario está autenticado
    }
  }, []);

  // Iniciar sesión
  const login = () => {
    setIsAuthenticated(true);
  };

  // Cerrar sesión
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.clear(); // Limpiar localStorage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
