import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomeAdmin from './components/HomeAdmin.js';
import HomeJefeBodega from './components/HomeJefeBodega.js';
import Login from './components/Login.js'
import RecuperarContraseña from './components/Recuperar_Contraseña/RecuperarContraseña.js';
import VerificarCodigo from './components/Verificar_Codigo/VerificarCodigo.js';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/HomeAdmin" element={<HomeAdmin/>} />
        <Route path="/HomeJefeBodega" element={<HomeJefeBodega/>}/>
        <Route path="/RecuperarContraseña" element={<RecuperarContraseña/>}/>
        <Route path="/VerificarCodigo" element={<VerificarCodigo/>}/>
      </Routes>
    </Router>
  );
};

export default App;
