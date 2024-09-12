<?php
include 'conexion.php';

// Obtener el ID del registro a eliminar
$id = $_POST['id'];

// Preparar la consulta de eliminación
$consulta = $conexion->prepare("DELETE FROM usuarios WHERE id = ?");
$consulta->bind_param("i", $id);

// Ejecutar la consulta
if ($consulta->execute()) {
    echo "El registro ha sido eliminado.";
} else {
    echo "Error al eliminar el registro: " . $consulta->error;
}

// Cerrar la consulta preparada
$consulta->close();

// Cerrar la conexión
mysqli_close($conexion);
?>