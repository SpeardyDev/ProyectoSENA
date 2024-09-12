<?php
session_start();

include 'conexion.php';

if (!isset($_POST['username'], $_POST['password'])) {
    header('Location: index.html');
}

if ($stmt = $conexion->prepare('SELECT id, username, password, rol, nombre FROM user WHERE username = ?')) {
    $stmt->bind_param('s', $_POST['username']);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $username, $password, $rol, $nombre);
        $stmt->fetch();

        if ($_POST['password'] === $password) {
            session_regenerate_id();
            $_SESSION['loggedin'] = TRUE;
            $_SESSION['nombre'] = $nombre; 
            $_SESSION['id'] = $id;
            $_SESSION['rol'] = $rol; 

            // Redireccionar según el rol
            if ($rol == 'administrador') {
                header('Location: administrador.php');
            } elseif ($rol == 'jefe_bodega') {
                header('Location: ../html/jefe_bodega.html');
            }elseif ($rol == 'modista') {
                header('Location: ../html/modista.html');
            } else {
                // Redireccionar a la página por defecto
                header('Location: index.php');
            }
        } else {
            header('Location: index.html');
        }
    } else {
        header('Location: index.html');
    }

    $stmt->close();
}
?>
