<?php
 include  'mostrar_Empleados.php';
 include 'mostrarGenaral_Stock.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <link href="https://fonts.googleapis.com/css2?family=Poetsen+One&family=Seymour+One&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="../css/administrador.css">
    <link rel="stylesheet" href="../css/stock.css">
    <title>Document</title>
</head>
<body>
    <header>
        <nav>
            <div class="logo"><img src="../img/LogoMarflex.png" alt="Logo de marflex"><h2>Marflex</h2></div>
            <?php // echo 'Administrador: ' . $_SESSION['nombre'];?>
            <div class="lista">
                <ul>
                    <li><a href="#" id="btn-stock">Stock</a></li>
                    <li><a href="#" id="btn-Inventario">Inventario</a></li>
                    <li><a href="#" id="usuario">usuarios</a></li>
                    <li><a href="cerrarSesion.php"><img class="icon-salir" src="../img/logout.png" alt="icon salir-logout"></a></li>
                </ul>
            </div>
        </nav>    
    </header>
    <section class="content-bienvenido"></section>
    <div id="formulario" class="formulario-agregar" style="display: none;">
        
        <div class="cont-form">
            
        <?php
    $action = htmlspecialchars($_SERVER["PHP_SELF"]);
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $action = "agregar_empleado.php";
    }
?>
        <form action="<?php echo $action; ?>" method="post">
    <div class="btn-cerrar">
        <div class="p-agregar"><h2>Registrar usuario</h2></div>
        <img id="btn-cerrar" src="../img/cerrar.png" alt="">
    </div>
    <div class="cont-input">
        <span>
            <img src="../img/user.png" alt="">
            <input type="text" name="empleado" placeholder="Nombre de usuario" required>
        </span>
        <span>
            <img src="../img/mail.png" alt="">
            <input type="email" name="email"  placeholder="Email" required>
        </span>
        <span>
            <img src="../img/phone.png" alt="">
            <input type="tel" name="telefono"  placeholder="telefono" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required>
        </span>
        <span>
            <img src="../img/supervisor.png" alt="">
            <select name="rol" required>
                <option value="">Rol</option>
                <option value="Jefe de Bodega">Jefe de Bodega</option>
                <option value="Administrador">Administrador</option>
                <option value="Modista">Modista</option>
            </select>
        </span>
        <span>
            <img src="../img/user.png" alt="">
            <select name="estado" required>
                <option value="">Estado</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
            </select>
        </span>
        <span>
            <input id="registrar"  type="submit" value="Registrar">
        </span>
    </div>
</form>
        </div>
    </div>
    <section class="contenedor-tabla" id="tabla"style="display: none;" >
        <div class="contenedor-titulo"><img src="../img/icon-empleados.png" alt=""><h2>Empleados</h2></div>
        <div class="tabla">
        <table id="tablaEmpleados">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre de usuario</th>
                        <th>Email</th>
                        <th>telefono</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th><button id="agregar" class="btn btn-agregar"><img src="../img/user_agregar.png" alt="icono agregar">Agregar usuario</button></th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($usuarios as $row){ ?>
            <tr>
                <td><?php echo $row['id'];?></td>
                <td><?php echo $row['empleado'];?></td>
                <td><?php echo $row['email'];?></td>
                <td><?php echo $row['telefono'];?></td>
                <td><?php echo $row['rol'];?></td>
                <td><?php echo $row['estado'];?></td>
                <td>
                <button class="btn btn-editar"  <?php echo $row['id']; ?> ><img src="../img/icon-edictar.png" alt="icon-edictar" id="btn-editar" ></button>

                <button class="btn btn-eliminar" data-id="<?php echo $row['id']; ?>" id="btn-eliminar"><img src="../img/icon-eliminar.png" alt="icono-btn Eliminar"></button>

                   <button class="btn btn-contraseña"><img src="../img/icon-contraseña.png" alt=""></button>
                </td>
           </tr>       
                </tbody>
                <?php
                    }
                ?>
            </table>
        </div>
    </section>
    <section class="contenedor-formEditar" id="contenedor-formEditar">
    <div id="form-editar" class="formulario-editar" style ="display:none;">

    <div class="btn-cerrar">
        <div class="p-agregar"><h2>Editar usuario</h2></div>
        <img id="btn-cerrar-editar" src="../img/cerrar.png" alt="">
    </div>
    <form action="editar_empleado.php" method="post">
    <div class="cont-input">
        <span>
            <input type="hidden" name="id" value="<?php echo $row['id']; ?>"><label for="">ID: <?php echo $row['id']; ?></label>
        </span>
        <span>
            <img src="../img/user.png" alt="">
            <input type="text" name="empleado" placeholder="Nombre de usuario" value="<?php echo $row['empleado']; ?>" required>
        </span>
        <span>
            <img src="../img/mail.png" alt="">
            <input type="email" name="email" value="<?php echo $row['email']; ?>" placeholder="Email" required>
        </span>
        <span>
            <img src="../img/phone.png" alt="">
            <input type="tel" name="telefono" value="<?php echo $row['telefono']; ?>" placeholder="telefono" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required>
        </span>
        <span>
            <img src="../img/supervisor.png" alt="">
            <select name="rol" value="<?php echo $row['rol']; ?>"  required>
                <option>Rol</option>
                <option value="Jefe de Bodega">Jefe de Bodega</option>
                <option value="Administrador">Administrador</option>
                <option value="Modista">Modista</option>
            </select>
        </span>
        <span>
            <img src="../img/user.png" alt="">
            <select name="estado" required>
                <option value="">Estado</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
            </select>
        </span>
        <span>
            <input type="submit" value="Editar">
        </span>
    </div>
    </form>
    </div>
    </section>
    <section class="contenedor-inventario" id="contenedor-inventario">
        <div class="contenedor-titulo"><img src="../img/icon-libreta.png" alt=""><h2>Inventario</h2></div>
        <div class="contenedor-tabla">
        <table>
            <head>
                <tr>
                    <th>ID</th>
                    <th>Producto terminado</th>
                    <th>Pedidos</th>
                    <th>cantidad max</th>
                    <th>Telefono</th>
                </tr>
            </head>
            <tbody>
              <td></td>
            </tbody>
        </table>
    </div>
    </section>
    <section class="contenedor-stok" id="contenedor-stock">
        <div class="contenedor-titulo"><img src="../img/icon-stock.png" alt=""><h2>Stock</h2></div>
        <form class="formulario-stock" action="">
            <input class="search" type="search" placeholder="Nombre del Producto" >
            <select class="menu-desplegable">
                <option value="">COLCHON DE AIRE</option>
                <option value="opcion2">COLCHÓN VISCOELÁSTICO</option>
                <option value="opcion3">COLCHON ANTIESCARAS</option>
                <option value="opcion4">COLCHÓN DE MUELLES BONELL</option>
              </select>
              <select class="menu-desplegable">
                <option value="mercato">Subcategoría</option>
                <option value="opcion2">COLCHÓN VISCOELÁSTICO</option>
                <option value="opcion3">COLCHON ANTIESCARAS</option>
                <option value="opcion4">COLCHÓN DE MUELLES BONELL</option>
              </select>
              <div class="botones-stock">
                <button class="btn" type="button"><img src="../img/icon-buscar.png" alt=""></button>
                <button class="btn-recargar" type="button"><img src="../img/icon-recargar.png" alt=""></button>
                <button class="btn-limpiar" type="button"><img src="../img/icon-limpiar.png" alt=""></button>
            </div>
              
        </form>
        <div class="contenedor-barraNav">
            <ul class="nav nav-tabs">
                <li class="nav-item">
                  <a id ='btn-general' class="nav-link active" aria-current="page" href="#">Listado general del stock</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" id='btn-centro-inventario' href="#">Stock por centro de Inventario</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Historial de ajustes</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Historial de transferencias</a>
                </li>
              </ul>
        </div>
        <div class="contenedor-tabla" id='genaral-stock'>
            <table>
                <header>
                    <tr>
                        <th>ID</th>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Cantidad disponible</th>
                        <th>Pendientes de entregar <img src="../img/icon_pregunta.png" alt=""></th>
                        <th>Estado en Punto de venta</th>
                        <th>Opciones</th>
                    </tr>
                </header>
                <tbody>
                <?php foreach ($query as $row){ ?>
                    <tr>
                        <td>P0<?php echo $row['id']; ?></td>
                        <td><?php echo $row['Producto']; ?></td>
                        <td><?php echo $row['Categoria']; ?></td>
                        <td><?php echo $row['Cantidad_disponible']; ?> unidades</td>
                        <td><?php echo $row['Pendientes_entregar']; ?></td>
                        <td><?php echo $row['Estado_Punto_venta']; ?></td>
                        <td>
                        <button class="btn btn-transferencia"><img src="../img/icon-transferencia.png" alt=""></button>
                        <button id='btn-ajuste' class="btn btn-contraseña" ><img src="../img/icon-ajustes.png" alt=""></button>
                        </td>
                    </tr>
                </tbody>
                <?php
                    }
                ?>
            </table>
    </div>
                </section>
 <!-- Formulario para hacer ajustes de stock -->
    <section class='contenedo-formulario-ajusteStock'id='contenido-formulario-ajusteStock'>           
    
    <form action="" class='form-ajustarStock'>
        <div class="titulo-ajustarStock">
            <div class="producto-categoria">
            <p>Ajuste de stock para el producto:<?php echo $row['Producto']; ?></p>
            <img id='btn-cerrar-formStock'class="btn-cerrar-formStock" src="../img/cerrar.png" alt="">
            </div>
            <div class="input-ajusteStock">
                <span class="span">
                    <label for="">Centro de inventario</label>
                    <select class="select" name="" id="">
                        <option value="">Inventario general</option>
                        <option value="">Cantidad Bodega</option>
                    </select>
                </span>
                <span class="span">
                    <label for="">Tipo de ajuste</label>
                    <select class="select" name="" id="">
                        <option value="">Aumentar</option>
                        <option value="">Disminuir</option>
                    </select>
                </span>
                <span class="span">
                    <label for="">Cantidad</label>
                    <input class="input-number" type="number" placeholder='999'>
                </span>
                <span class="span">
                    <label for="">Descripcíon</label>
                    <textarea class="texarea-descripcion" name="" id=""></textarea>
                </span>
                <span class="btn-enviar">
                    <button>Cancelar</button>
                    <input type="submit" value="Enviar">
                </span>
            </div>
        </div>
    </form>
</section>
 <!-- Formulario para hacer ajustes de stock  AQUI TERMINA-->

    <div class="contenedor-stock-centro-inventario" id='centro-inventario'>
    <table>
        <head>
            <tr>
                <th>Producto</th>
                <th>Inventario general</th>
                <th>Cantidad en Bodega</th>
                <th>Cantidad en Costura</th>

            </tr>
        </head>
        <tbody>
          <td></td>
          <td>
            <div class="contendeor-botones">
            <a class="cont-btn" href="#"><i class='bx bxs-edit' style='color:#ffffff'></i></a>
            <a class="cont-btn" href="#"><i class='bx bx-detail' style='color:#ffffff'></i></a>
            </div>
        </td>
        <td>
            <div class="contendeor-botones">
            <a class="cont-btn" href="#"><i class='bx bxs-edit' style='color:#ffffff'></i></a>
            <a class="cont-btn" href="#"><i class='bx bx-detail' style='color:#ffffff'></i></a>
            </div>
        </td>
        <td>
            <div class="contendeor-botones">
            <a class="cont-btn" href="#"><i class='bx bxs-edit' style='color:#ffffff'></i></a>
            <a class="cont-btn" href="#"><i class='bx bx-detail' style='color:#ffffff'></i></a>
            </div>
        </td>
        </tbody>
    </table>
</body>
    </div>
    </section>
</body>
<script src="../js/agregar.js"></script>
<script src="../js/eliminar.js"></script>
<script src="../js/stock.js"></script>
</html>