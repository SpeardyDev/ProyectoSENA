<?php
// Conexión a la base de datos
include 'conexion.php';

// Recibir los datos del formulario
$id = $_POST['id'];
$nombre = $_POST['empleado'];
$email = $_POST['email'];
$Telefono =$_POST['telefono'];
$Rol =$_POST['rol'];
$Estado= $_POST['estado'];

// Preparar la sentencia SQL
$stmt = $conexion->prepare("UPDATE usuarios SET empleado=?, email=?, telefono=?, rol=?, estado=? WHERE id=?");

// Vincular los parámetros a la sentencia preparada
$stmt->bind_param("sssssi", $nombre, $email, $Telefono, $Rol, $Estado, $id);

// Ejecutar la sentencia preparada y verificar si fue exitosa
if ($stmt->execute()) {
    echo "Registro actualizado exitosamente";
} else {
    echo "Error actualizando registro: " . $stmt->error;
}

// Cerrar la sentencia y la conexión
$stmt->close();
$conexion->close();
?>

