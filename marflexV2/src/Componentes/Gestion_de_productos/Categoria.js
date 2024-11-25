import React from 'react'
import './styles/Categorias.css'
import {  Button, Search, TableRow, TableHeaderCell, TableHeader, TableCell, TableBody, Table } from 'semantic-ui-react';



function categoria() {
  
  return (
    <section>
        <div className='titulo'>
        <p>Categorías</p>
        </div>
        <div className="Filtro">
      <div className="contenedor-1">
      <Search placeholder="Codigo"/>
      <span className="icon-text">
        <i className="pi pi-filter" style={{ fontSize: '1.5rem' }}></i>
        <span>Filtro</span>
    </span>
      </div>
      <div className="contenedor-2">
      <span className="icon-text">
        <i className="pi pi-tag" style={{ fontSize: '1.5rem'}}></i>
        <span>Categorías</span>
    </span>
    <span className="icon-text">
        <i className="pi pi-upload" style={{ fontSize: '1.5rem' }}></i>
        <span>Exportar</span>
    </span>
    <Button color='green'><i className="pi pi-plus"/> Categoria</Button>
      </div>
    </div>
    <article className="dasboard-productos"></article>
    <Table celled>
    <TableHeader>
      <TableRow>
      <TableHeaderCell>#</TableHeaderCell>
        <TableHeaderCell>Productos</TableHeaderCell>
        <TableHeaderCell>Categorías</TableHeaderCell>
        <TableHeaderCell>Fecha de Ingreso</TableHeaderCell>
        <TableHeaderCell>Stock</TableHeaderCell>
        <TableHeaderCell>Precio</TableHeaderCell>
        <TableHeaderCell>Catalogo</TableHeaderCell>
        <TableHeaderCell></TableHeaderCell>
      </TableRow>
    </TableHeader>

    <TableBody>
        
          <TableRow >
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
      </TableBody>
  </Table>
    </section>
  )
}

export default categoria;