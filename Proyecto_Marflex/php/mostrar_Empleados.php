<?php
include 'conexion.php';

$consultar = "SELECT * FROM usuarios";
$usuarios = mysqli_query($conexion, $consultar);
?>