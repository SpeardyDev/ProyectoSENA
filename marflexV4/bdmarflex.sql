-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-03-2025 a las 20:28:57
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

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
    
    -- Obtener datos de la solicitud
    SELECT id_materia_prima, cantidad_solicitada 
    INTO v_id_materia, v_cantidad
    FROM solicitudes_materia_prima
    WHERE id_solicitud = p_id_solicitud;

    -- Verificar si hay suficiente stock
    IF (SELECT Stock FROM materia_prima WHERE ID = v_id_materia) >= v_cantidad THEN
        -- Descontar la materia prima
        UPDATE materia_prima 
        SET Stock = Stock - v_cantidad 
        WHERE ID = v_id_materia;
        
        -- Actualizar el estado de la solicitud
        UPDATE solicitudes_materia_prima 
        SET estado = 'aprobada'
        WHERE id_solicitud = p_id_solicitud;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock insuficiente';
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `RechazarSolicitud` (IN `p_id_solicitud` INT, IN `p_motivo` TEXT)   BEGIN
    -- Actualizar la solicitud con estado rechazado y agregar el motivo
    UPDATE solicitudes_materia_prima 
    SET estado = 'rechazada', motivo_rechazo = p_motivo
    WHERE id_solicitud = p_id_solicitud;
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
(3, 'Colchón Básico Espuma', 'Colchón económico solo de espuma HR', '2025-03-06', 15);

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
(8, 3, 1, 15),
(9, 3, 2, 15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

CREATE TABLE `empleados` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Apellido` varchar(100) NOT NULL,
  `Usuario` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Rol` enum('admin','empleado') NOT NULL DEFAULT 'empleado',
  `ID_Estado` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 'Espuma HR 30', 'Espuma de alta resiliencia para colchones', 130, 'kg'),
(2, 'Tela Jacquard', 'Tela premium para forro de colchones', 300, 'metros'),
(3, 'Resortes Bonnell', 'Resortes de acero para colchón ortopédico', 185, 'unidades'),
(4, 'Pegamento PU', 'Pegamento de poliuretano para colchones', 65, 'litros');

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
(1, 1, 'entrada', 50, '2025-03-01 15:00:00', 1),
(2, 2, 'entrada', 100, '2025-03-02 16:00:00', 2),
(3, 3, 'entrada', 75, '2025-03-03 14:30:00', 3),
(4, 4, 'entrada', 25, '2025-03-04 19:00:00', 4),
(5, 1, 'salida', 20, '2025-03-05 13:00:00', NULL),
(6, 2, 'salida', 50, '2025-03-06 14:00:00', NULL),
(7, 3, 'salida', 40, '2025-03-07 15:30:00', NULL),
(8, 4, 'salida', 10, '2025-03-07 16:00:00', NULL),
(9, 2, 'salida', 50, '2025-03-08 17:02:54', NULL),
(10, 2, 'entrada', 100, '2025-03-08 17:04:05', 2);

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
  `ID_Empleado` int(11) NOT NULL,
  `ID_Materiaprima` int(11) NOT NULL,
  `Cantidad_Solicitada` int(11) NOT NULL,
  `Fecha_Solicitud` timestamp NOT NULL DEFAULT current_timestamp(),
  `Estado` enum('pendiente','aprobada','rechazada') DEFAULT 'pendiente',
  `Motivo_Rechazo` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Indices de la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `usuario` (`Usuario`),
  ADD KEY `estado_id` (`ID_Estado`);

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
  ADD KEY `id_materia_prima` (`ID_Materiaprima`),
  ADD KEY `solicitudes_materia_prima_ibfk_1` (`ID_Empleado`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `colchones`
--
ALTER TABLE `colchones`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `detalle_colchon`
--
ALTER TABLE `detalle_colchon`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `empleados`
--
ALTER TABLE `empleados`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `materia_prima`
--
ALTER TABLE `materia_prima`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `solicitudes_materia_prima`
--
ALTER TABLE `solicitudes_materia_prima`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

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
-- Filtros para la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD CONSTRAINT `empleados_ibfk_1` FOREIGN KEY (`ID_Estado`) REFERENCES `estados` (`ID`);

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
  ADD CONSTRAINT `solicitudes_materia_prima_ibfk_1` FOREIGN KEY (`ID_Empleado`) REFERENCES `empleados` (`ID`),
  ADD CONSTRAINT `solicitudes_materia_prima_ibfk_2` FOREIGN KEY (`ID_Materiaprima`) REFERENCES `materia_prima` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
