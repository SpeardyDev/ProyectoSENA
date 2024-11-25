import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomeAdmin from './Componentes/HomeAdmin.js';
import Login from './Componentes/Login.js'
import HomeJefeBodega from './Componentes/HomeJefeBodega.js'



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/HomeAdmin" element={<HomeAdmin/>} />
        <Route path="/HomeJefeBodega" element={<HomeJefeBodega/>} />
      </Routes>
    </Router>
  );
};

export default App;
