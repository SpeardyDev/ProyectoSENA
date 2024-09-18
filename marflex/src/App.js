import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomeAdmin from './Componentes/HomeAdmin.js';
import Login from './Componentes/Login.js'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/HomeAdmin" element={<HomeAdmin/>} />
      </Routes>
    </Router>
  );
};

export default App;
