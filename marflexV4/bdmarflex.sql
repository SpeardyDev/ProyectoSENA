-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-04-2025 a las 02:34:34
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bdmarflex`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `AprobarSolicitud` (IN `p_id_solicitud` INT)   BEGIN
    DECLARE v_id_materia INT;
    DECLARE v_cantidad INT;
    DECLARE v_stock INT;
    DECLARE v_mensaje_error VARCHAR(255); -- Variable para el mensaje dinámico

    -- Iniciar una transacción para evitar inconsistencias
    START TRANSACTION;

    -- Obtener datos de la solicitud
    SELECT ID_MateriaPrima, Cantidad_Solicitada 
    INTO v_id_materia, v_cantidad
    FROM solicitudes_materia_prima
    WHERE ID = p_id_solicitud;

    -- Si no se encontró la solicitud, lanzar error y cancelar transacción
    IF v_id_materia IS NULL THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Solicitud no encontrada';
    END IF;

    -- Obtener el stock actual
    SELECT Stock INTO v_stock FROM materia_prima WHERE ID = v_id_materia;

    -- Verificar si hay suficiente stock
    IF v_cantidad > v_stock THEN
        -- Construir el mensaje de error correctamente
        SET v_mensaje_error = CONCAT('Stock insuficiente. Stock disponible: ', v_stock);
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = v_mensaje_error;
    ELSE
        -- Si hay suficiente stock, descontarlo
        UPDATE materia_prima 
        SET Stock = Stock - v_cantidad 
        WHERE ID = v_id_materia;
        
        -- Actualizar el estado de la solicitud
        UPDATE solicitudes_materia_prima 
        SET estado = 'Aprobada'
        WHERE ID = p_id_solicitud;
        
        -- Confirmar cambios
        COMMIT;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `RechazarSolicitud` (IN `p_id_solicitud` INT, IN `p_motivo` TEXT)   BEGIN
    -- Actualizar la solicitud con estado rechazado y agregar el motivo
    UPDATE solicitudes_materia_prima 
    SET estado = 'rechazada', motivo_rechazo = p_motivo
    WHERE ID = p_id_solicitud;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ReporteBajoStock` ()   BEGIN
    SELECT ID, Nombre, Stock, Unidad 
    FROM materia_prima 
    WHERE Stock < 20;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ReporteEntradasMateriaPrima` ()   BEGIN
    SELECT m.ID, mp.Nombre AS MateriaPrima, m.Cantidad, m.Fecha, p.Nombre AS Proveedor 
    FROM movimientos m
    JOIN materia_prima mp ON m.ID_MateriaPrima = mp.ID
    LEFT JOIN proveedores p ON m.ID_Proveedor = p.ID
    WHERE m.Tipo = 'entrada'
    ORDER BY m.Fecha DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ReporteEntradasPorFecha` (IN `fecha_inicio` DATE, IN `fecha_fin` DATE)   BEGIN
    SELECT 
        m.ID AS ID_Movimiento,
        mp.Nombre AS Nombre_MateriaPrima,
        m.Cantidad,
        m.Fecha,
        p.Nombre AS Proveedor
    FROM movimientos m
    JOIN materia_prima mp ON m.ID_MateriaPrima = mp.ID
    LEFT JOIN proveedores p ON m.ID_Proveedor = p.ID
    WHERE m.Tipo = 'entrada' AND m.Fecha BETWEEN fecha_inicio AND fecha_fin
    ORDER BY m.Fecha DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ReporteInventarioStockActual` ()   BEGIN
    SELECT 
        ID AS ID_MateriaPrima,
        Nombre AS Nombre_MateriaPrima,
        Stock AS Cantidad_Disponible,
        Unidad
    FROM materia_prima
    ORDER BY Nombre;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ReporteMateriaPrimaUsada` ()   BEGIN
    SELECT 
        c.Modelo AS Modelo_Colchon,
        mp.Nombre AS Nombre_MateriaPrima,
        dc.Cantidad_Usada,
        c.Fecha_Fabricacion
    FROM detalle_colchon dc
    JOIN colchones c ON dc.ID_Colchon = c.ID
    JOIN materia_prima mp ON dc.ID_MateriaPrima = mp.ID
    ORDER BY c.Fecha_Fabricacion DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ReporteMovimientosPorMateriaPrima` (IN `materiaPrimaID` INT)   BEGIN
    SELECT m.Tipo, m.Cantidad, m.Fecha, p.Nombre AS Proveedor 
    FROM movimientos m
    LEFT JOIN proveedores p ON m.ID_Proveedor = p.ID
    WHERE m.ID_MateriaPrima = materiaPrimaID
    ORDER BY m.Fecha DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ReporteProduccionPorFechas` (IN `fecha_inicio` DATE, IN `fecha_fin` DATE)   BEGIN
    SELECT Modelo, Fecha_Fabricacion, Cantidad 
    FROM colchones 
    WHERE Fecha_Fabricacion BETWEEN fecha_inicio AND fecha_fin
    ORDER BY Fecha_Fabricacion;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ReporteSalidasMateriaPrima` ()   BEGIN
    SELECT m.ID, mp.Nombre AS MateriaPrima, m.Cantidad, m.Fecha 
    FROM movimientos m
    JOIN materia_prima mp ON m.ID_MateriaPrima = mp.ID
    WHERE m.Tipo = 'salida'
    ORDER BY m.Fecha DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ReporteSalidasPorFecha` (IN `fecha_inicio` DATE, IN `fecha_fin` DATE)   BEGIN
    SELECT 
        m.ID AS ID_Movimiento,
        mp.Nombre AS Nombre_MateriaPrima,
        m.Cantidad,
        m.Fecha
    FROM movimientos m
    JOIN materia_prima mp ON m.ID_MateriaPrima = mp.ID
    WHERE m.Tipo = 'salida' AND m.Fecha BETWEEN fecha_inicio AND fecha_fin
    ORDER BY m.Fecha DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ReporteUltimaCompraProveedores` ()   BEGIN
    SELECT p.Nombre AS Proveedor, MAX(m.Fecha) AS UltimaCompra 
    FROM movimientos m
    JOIN proveedores p ON m.ID_Proveedor = p.ID
    WHERE m.Tipo = 'entrada'
    GROUP BY p.Nombre
    ORDER BY UltimaCompra DESC;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `colchones`
--

CREATE TABLE `colchones` (
  `ID` int(11) NOT NULL,
  `Modelo` varchar(100) NOT NULL,
  `Descripcion` text DEFAULT NULL,
  `Fecha_Fabricacion` date NOT NULL,
  `Cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `colchones`
--

INSERT INTO `colchones` (`ID`, `Modelo`, `Descripcion`, `Fecha_Fabricacion`, `Cantidad`) VALUES
(1, 'Colchón Ortopédico Premium', 'Colchón con espuma HR y resortes Bonnell', '2025-03-07', 10),
(2, 'Colchón Viscoelástico Deluxe', 'Colchón con espuma viscoelástica y forro Jacquard', '2025-03-07', 5),
(3, 'Colchón Básico Espuma', 'Colchón económico solo de espuma HR', '2025-03-06', 15),
(8, 'ss', 'ssssssss', '2025-04-11', 50);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_colchon`
--

CREATE TABLE `detalle_colchon` (
  `ID` int(11) NOT NULL,
  `ID_Colchon` int(11) NOT NULL,
  `ID_MateriaPrima` int(11) NOT NULL,
  `Cantidad_Usada` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_colchon`
--

INSERT INTO `detalle_colchon` (`ID`, `ID_Colchon`, `ID_MateriaPrima`, `Cantidad_Usada`) VALUES
(1, 1, 1, 10),
(2, 1, 2, 20),
(3, 1, 3, 30),
(4, 1, 4, 5),
(5, 2, 1, 5),
(6, 2, 2, 15),
(7, 2, 4, 3),
(8, 3, 1, 15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados`
--

CREATE TABLE `estados` (
  `ID` tinyint(4) NOT NULL,
  `Descripcion` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estados`
--

INSERT INTO `estados` (`ID`, `Descripcion`) VALUES
(1, 'Activo'),
(2, 'Inactivo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materia_prima`
--

CREATE TABLE `materia_prima` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Descripcion` text DEFAULT NULL,
  `Stock` int(11) NOT NULL DEFAULT 0,
  `Unidad` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `materia_prima`
--

INSERT INTO `materia_prima` (`ID`, `Nombre`, `Descripcion`, `Stock`, `Unidad`) VALUES
(1, 'Espuma HR 30', 'Espuma de alta resiliencia para colchones', 265, 'kg'),
(2, 'Tela Jacquard', 'Tela premium para forro de colchones', 190, 'metros'),
(3, 'Resortes Bonnell', 'Resortes de acero para colchón ortopédico', 50, 'unidades'),
(4, 'Pegamento PU', 'Pegamento de poliuretano para colchones', 199, 'litros');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos`
--

CREATE TABLE `movimientos` (
  `ID` int(11) NOT NULL,
  `ID_MateriaPrima` int(11) NOT NULL,
  `Tipo` enum('entrada','salida') NOT NULL,
  `Cantidad` int(11) NOT NULL,
  `Fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `ID_Proveedor` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `movimientos`
--

INSERT INTO `movimientos` (`ID`, `ID_MateriaPrima`, `Tipo`, `Cantidad`, `Fecha`, `ID_Proveedor`) VALUES
(1, 1, 'entrada', 50, '2025-03-02 01:00:00', 1),
(2, 2, 'entrada', 100, '2025-03-03 02:00:00', 2),
(3, 3, 'entrada', 75, '2025-03-04 00:30:00', 3),
(4, 4, 'entrada', 25, '2025-03-05 05:00:00', 4),
(5, 1, 'salida', 20, '2025-03-05 23:00:00', NULL),
(6, 2, 'salida', 50, '2025-03-07 00:00:00', NULL),
(7, 3, 'salida', 40, '2025-03-08 01:30:00', NULL),
(8, 4, 'salida', 10, '2025-03-08 02:00:00', NULL),
(9, 2, 'salida', 50, '2025-03-09 03:02:54', NULL),
(10, 2, 'entrada', 100, '2025-03-09 03:04:05', 2),
(11, 2, 'entrada', 50, '2025-03-11 02:08:39', 2),
(12, 2, 'salida', 50, '2025-03-11 02:09:34', 2);

--
-- Disparadores `movimientos`
--
DELIMITER $$
CREATE TRIGGER `actualizar_stock_movimientos` AFTER INSERT ON `movimientos` FOR EACH ROW BEGIN
    IF NEW.Tipo = 'entrada' THEN
        UPDATE materia_prima SET Stock = Stock + NEW.Cantidad WHERE ID = NEW.ID_MateriaPrima;
    ELSEIF NEW.Tipo = 'salida' THEN
        UPDATE materia_prima SET Stock = Stock - NEW.Cantidad WHERE ID = NEW.ID_MateriaPrima;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  `Direccion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`ID`, `Nombre`, `Telefono`, `Direccion`) VALUES
(1, 'Espuma Bogotá S.A.', '3201234567', 'Carrera 30 #10-25, Bogotá'),
(2, 'Textiles Premium', '3109876543', 'Avenida 68 #22-33, Bogotá'),
(3, 'Resortes El Dorado', '3224567890', 'Calle 100 #15-12, Bogotá'),
(4, 'Químicos y Adhesivos SAS', '3137890123', 'Zona Industrial, Bogotá');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes_materia_prima`
--

CREATE TABLE `solicitudes_materia_prima` (
  `ID` int(11) NOT NULL,
  `ID_Usuario` int(11) NOT NULL,
  `ID_MateriaPrima` int(11) NOT NULL,
  `Cantidad_Solicitada` int(11) NOT NULL,
  `Fecha_Solicitud` timestamp NOT NULL DEFAULT current_timestamp(),
  `Estado` enum('Pendiente','Aprobada','Rechazada') DEFAULT 'Pendiente',
  `Motivo_Rechazo` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes_materia_prima`
--

INSERT INTO `solicitudes_materia_prima` (`ID`, `ID_Usuario`, `ID_MateriaPrima`, `Cantidad_Solicitada`, `Fecha_Solicitud`, `Estado`, `Motivo_Rechazo`) VALUES
(29, 1, 1, 20, '2025-04-18 22:13:56', 'Aprobada', ''),
(30, 1, 4, 222, '2025-04-18 22:21:49', 'Rechazada', 'No stock'),
(31, 2, 2, 50, '2025-04-18 22:24:06', 'Pendiente', ''),
(32, 2, 3, 20, '2025-04-18 23:24:40', 'Pendiente', ''),
(36, 4, 4, 300, '2025-04-19 00:06:25', 'Pendiente', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Usuario` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Rol` enum('Adminitrador','Empleado') NOT NULL DEFAULT 'Empleado',
  `ID_Estado` tinyint(4) NOT NULL DEFAULT 1,
  `FotoPerfil` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`ID`, `Nombre`, `Usuario`, `Password`, `Rol`, `ID_Estado`, `FotoPerfil`) VALUES
(1, 'Nicolas Mahecha Martínez', 'nicolasmahechamartinez@gmail.com', '', 'Empleado', 1, 'foto-perfil.jpg'),
(2, 'Paula Andrea Garcia Cifuentes', 'andrea.paula0127@gmail.com', '', 'Empleado', 1, '1745016963902.jpg'),
(4, 'Ivan Pérez Castañeda', 'ivanalejandroperez2005@gmail.com', '', 'Empleado', 1, '1745021072565.jpg');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `colchones`
--
ALTER TABLE `colchones`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `detalle_colchon`
--
ALTER TABLE `detalle_colchon`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID_Colchon` (`ID_Colchon`),
  ADD KEY `ID_MateriaPrima` (`ID_MateriaPrima`);

--
-- Indices de la tabla `estados`
--
ALTER TABLE `estados`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `materia_prima`
--
ALTER TABLE `materia_prima`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID_MateriaPrima` (`ID_MateriaPrima`),
  ADD KEY `ID_Proveedor` (`ID_Proveedor`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `solicitudes_materia_prima`
--
ALTER TABLE `solicitudes_materia_prima`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `id_materia_prima` (`ID_MateriaPrima`),
  ADD KEY `solicitudes_materia_prima_ibfk_1` (`ID_Usuario`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `usuario` (`Usuario`),
  ADD UNIQUE KEY `Nombre` (`Nombre`),
  ADD KEY `estado_id` (`ID_Estado`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `colchones`
--
ALTER TABLE `colchones`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `detalle_colchon`
--
ALTER TABLE `detalle_colchon`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `materia_prima`
--
ALTER TABLE `materia_prima`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `solicitudes_materia_prima`
--
ALTER TABLE `solicitudes_materia_prima`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_colchon`
--
ALTER TABLE `detalle_colchon`
  ADD CONSTRAINT `detalle_colchon_ibfk_1` FOREIGN KEY (`ID_Colchon`) REFERENCES `colchones` (`ID`),
  ADD CONSTRAINT `detalle_colchon_ibfk_2` FOREIGN KEY (`ID_MateriaPrima`) REFERENCES `materia_prima` (`ID`);

--
-- Filtros para la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD CONSTRAINT `movimientos_ibfk_1` FOREIGN KEY (`ID_MateriaPrima`) REFERENCES `materia_prima` (`ID`),
  ADD CONSTRAINT `movimientos_ibfk_2` FOREIGN KEY (`ID_Proveedor`) REFERENCES `proveedores` (`ID`);

--
-- Filtros para la tabla `solicitudes_materia_prima`
--
ALTER TABLE `solicitudes_materia_prima`
  ADD CONSTRAINT `solicitudes_materia_prima_ibfk_1` FOREIGN KEY (`ID_MateriaPrima`) REFERENCES `materia_prima` (`ID`),
  ADD CONSTRAINT `solicitudes_materia_prima_ibfk_2` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuarios` (`ID`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`ID_Estado`) REFERENCES `estados` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
