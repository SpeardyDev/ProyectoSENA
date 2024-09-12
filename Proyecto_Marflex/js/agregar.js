////Codigo Boton agregar
const botonMostrar = document.getElementById('agregar');
const formulario = document.getElementById('formulario');

botonMostrar.addEventListener('click', () => {
    formulario.style.display = 'block';
});

///Codigo para el boton de editar //
const btnCerrar = document.getElementById('btn-cerrar');

btnCerrar.addEventListener('click', ()=> {
  formulario.style.display='none'; 
});

//////////////////////////////Codigo del vinculo mostrar usuarios ///////////////////////////////////

const btnMostrarUsuarios = document.getElementById('usuario');
const btnTabla = document.getElementById('tabla');

btnMostrarUsuarios.addEventListener('click',() => {
  MostrarStock.style.display='none';
  contenedor.style.display ='none';
    btnTabla.style.display = 'block';
});
//////////////////////////////Codigo de mostrar inventario////////////////////////////////////
const btnInventario = document.getElementById('btn-Inventario');
const contenedor = document.getElementById('contenedor-inventario');

btnInventario.addEventListener('click', ()=>{
  MostrarStock.style.display='none';
  btnTabla.style.display = 'none';
    contenedor.style.display ='block';
});
//////////////////////////////Codigo mostrar apartado stock/////////////////////////////////////////////
const btnStock = document.getElementById('btn-stock');
const MostrarStock = document.getElementById('contenedor-stock');

btnStock.addEventListener('click',()=>{
  contenedor.style.display ='none';
  btnTabla.style.display = 'none';
  MostrarStock.style.display='block';
});



///Codigo para el boton de editar //
const btnEditar = document.getElementById('btn-editar');
const formEditar =document.getElementById('form-editar');
const contForm = document.getElementById('contenedor-formEditar');

document.querySelectorAll('.btn-editar').forEach(function(button) {
  button.addEventListener('click', function() {
    contForm.style.display='flex';
      formEditar.style.display='block';
  });
});




////  Codigo Boton cerrar editar///
const btnCerrarEditar = document.getElementById('btn-cerrar-editar');

btnCerrarEditar.addEventListener('click', ()=> {
  contForm.style.display='none';
  formEditar.style.display='none'; 
});

///////////////////////////////////////////////////////

// Función para actualizar la tabla con el nuevo empleado
function actualizarTabla(nuevoId, nombre_usuario, email, telefono, rol, estado) {
  var tabla = document.getElementById('tablaEmpleados');
  var fila = tabla.insertRow(-1);
  var celdaId = fila.insertCell(0);
  var celdaNombre = fila.insertCell(1);
  var celdaEmail = fila.insertCell(2);
  var celdaTelefono = fila.insertCell(3);
  var celdaRol = fila.insertCell(4);
  var celdaEstado = fila.insertCell(5);
  var celdaAcciones = fila.insertCell(6);

  celdaId.innerHTML = nuevoId;
  celdaNombre.innerHTML = nombre_usuario;
  celdaEmail.innerHTML = email;
  celdaTelefono.innerHTML = telefono;
  celdaRol.innerHTML = rol;
  celdaEstado.innerHTML = estado;
  celdaAcciones.innerHTML = '<button class="btn btn-editar" data-id="' + nuevoId + '"><img src="../img/icon-edictar.png" alt="icon-edictar"></button>' +
                            '<button class="btn btn-eliminar" data-id="' + nuevoId + '"><img src="../img/icon-eliminar.png" alt="icono-btn Eliminar"></button>' +
                            '<button class="btn btn-contraseña"><img src="../img/icon-contraseña.png" alt=""></button>';
}

