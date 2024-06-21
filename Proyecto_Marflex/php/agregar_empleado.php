<?php

include 'conexion.php';
// Recoger los datos del formulario
$nombre_usuario = $_POST['empleado'];
$email = $_POST['email'];
$telefono = $_POST['telefono'];
$rol = $_POST['rol'];
$estado = $_POST['estado'];

// Insertar los datos en la base de datos
$sql = "INSERT INTO usuarios (empleado, email, telefono, rol, estado) 
VALUES ('$nombre_usuario', '$email', '$telefono', '$rol', '$estado')";

if ($conexion->query($sql) === TRUE) {
  header('Location: administrador.php');
} else {
  echo "Error: " . $sql . "<br>" . $conexion->error;
}
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$conexion->close();
?>