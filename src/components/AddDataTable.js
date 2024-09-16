import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function AddDataTable({ title, columns, data, setData }) {
  const [formData, setFormData] = useState({});

  // Manejar los cambios en los inputs del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Manejar el envío del formulario para agregar un nuevo registro
  const handleSubmit = (e) => {
    e.preventDefault();
    setData([...data, formData]); // Agrega la nueva fila de datos
    setFormData({}); // Reinicia el formulario
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">{title}</h2>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          {columns.map((col, index) => (
            <div className="col-md-4" key={index}>
              <label className="form-label">{col}</label>
              <input
                type="text"
                name={col}
                className="form-control"
                value={formData[col] || ""}
                onChange={handleChange}
                required
              />
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-success">Agregar</button>
      </form>

      <table className="table table-striped mt-4">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AddDataTable;
