/// funcion que elimina los registros junto con php y depaso lo elimina del Dom
function eliminarRegistro(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      // Llamada AJAX a eliminar.php
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "../php/eliminar.php", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          // Accion a realizar después de la eliminación
          alert(this.responseText);
          // Eliminar la fila de la tabla
          var fila = document.querySelector('button[data-id="'+id+'"]').parentNode.parentNode;
          fila.remove();
        }
      };
      xhr.send("id=" + id);
    }
  }
  //// constatnte boton eliminar llamando a la funcion eliminarRegistro////
const botonesEliminar = document.querySelectorAll('.btn-eliminar');

botonesEliminar.forEach(btn => {
  btn.addEventListener('click', function() {
    const id = this.getAttribute('data-id');
    eliminarRegistro(id);
  });
});


