-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-11-2024 a las 03:30:42
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedido`
--

CREATE TABLE `detalle_pedido` (
  `id_detalle` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `CantidadTotal` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

CREATE TABLE `empleados` (
  `ID` int(11) NOT NULL,
  `Cargo` varchar(10) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Apellidos` varchar(50) NOT NULL,
  `Departamento` varchar(25) DEFAULT NULL,
  `Telefono` int(10) NOT NULL,
  `Fecha_Ingreso` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado`
--

CREATE TABLE `estado` (
  `ID` int(11) NOT NULL,
  `Estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado`
--

INSERT INTO `estado` (`ID`, `Estado`) VALUES
(1, 'Activo'),
(2, 'Inactivo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `ID_pro` int(11) NOT NULL,
  `NombreProducto` varchar(50) NOT NULL,
  `Descripcion` varchar(30) DEFAULT NULL,
  `Cantidad_stock` int(11) NOT NULL,
  `Estado` varchar(15) NOT NULL,
  `Categoria` varchar(50) NOT NULL,
  `Precio` decimal(10,2) NOT NULL,
  `Proveedor` varchar(50) NOT NULL,
  `Fecha_Entrada` date NOT NULL,
  `Fecha_Salida` date NOT NULL,
  `TblProductoID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materiaprimas`
--

CREATE TABLE `materiaprimas` (
  `ID` int(11) NOT NULL,
  `Cantidad` int(12) NOT NULL,
  `Descripcion` varchar(50) DEFAULT NULL,
  `Categoria` varchar(20) DEFAULT NULL,
  `Nombre` varchar(50) DEFAULT NULL,
  `TblProveedorID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `ID` int(11) NOT NULL,
  `Fecha_Despacho` date NOT NULL,
  `Fecha_Entrega` date NOT NULL,
  `Fecha_Pedido` date NOT NULL,
  `Estado` varchar(15) NOT NULL,
  `Direccion_Entrega` varchar(255) DEFAULT NULL,
  `Total` decimal(10,2) DEFAULT NULL,
  `Metodo_Pago` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `ID` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Precio` varchar(50) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `Categoria` varchar(50) DEFAULT NULL,
  `FechaIngreso` date DEFAULT NULL,
  `ProveedorID` int(11) DEFAULT NULL,
  `StockMinimo` int(11) DEFAULT NULL,
  `EstadoID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Telefono1` varchar(20) NOT NULL,
  `Telefono2` varchar(20) DEFAULT NULL,
  `Direccion` varchar(20) NOT NULL,
  `Barrio` varchar(20) DEFAULT NULL,
  `Ciudad` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedor`
--

INSERT INTO `proveedor` (`ID`, `Nombre`, `Telefono1`, `Telefono2`, `Direccion`, `Barrio`, `Ciudad`) VALUES
(1, 'Espumlandia-S.A.S', '9999999', '11321321', 'Tv 42 #3A-18 Sur', 'Primavera', 'Bogóta'),
(2, 'Maderas y Molduras San Miguel', '9999999', 'N/A', 'Tv 42 #3A-18 Sur', 'Primavera', 'Bogóta'),
(8, 'Colchón HR', '123-456-78', '098-765-43', 'Calle Falsa 123', 'Chapinero', 'Bogotá'),
(9, 'Espumas y Textiles', '888-777-66', 'N/A', 'Carrera 15 #45-50', 'Engativá', 'Bogotá'),
(30, 'marcela', '11215', 'N/A', 'Tv 42 #3A-18 Sur', 'Ciudad bolivar', 'Bogóta');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblempleados_tblproducto`
--

CREATE TABLE `tblempleados_tblproducto` (
  `TblEmpleadosID` int(11) NOT NULL,
  `TblProductoID` int(11) NOT NULL,
  `Cantidad_Empleados` int(11) DEFAULT NULL,
  `Cantidad_Productos` int(11) NOT NULL,
  `Nom_pro` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblmateriaprimas_tblempleados`
--

CREATE TABLE `tblmateriaprimas_tblempleados` (
  `TblMateriaPrimasID` int(11) NOT NULL,
  `TblEmpleadosID` int(11) NOT NULL,
  `Categoria` varchar(50) NOT NULL,
  `cantidades` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_pedido` (`id_pedido`,`id_producto`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`ID_pro`),
  ADD KEY `TblProductoID` (`TblProductoID`);

--
-- Indices de la tabla `materiaprimas`
--
ALTER TABLE `materiaprimas`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `TblProveedorID` (`TblProveedorID`);

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ProveedorID` (`ProveedorID`),
  ADD KEY `fk_estado` (`EstadoID`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `tblempleados_tblproducto`
--
ALTER TABLE `tblempleados_tblproducto`
  ADD PRIMARY KEY (`TblEmpleadosID`,`TblProductoID`),
  ADD KEY `TblProductoID` (`TblProductoID`);

--
-- Indices de la tabla `tblmateriaprimas_tblempleados`
--
ALTER TABLE `tblmateriaprimas_tblempleados`
  ADD PRIMARY KEY (`TblMateriaPrimasID`,`TblEmpleadosID`),
  ADD KEY `TblEmpleadosID` (`TblEmpleadosID`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estado`
--
ALTER TABLE `estado`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD CONSTRAINT `detalle_pedido_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`ID`),
  ADD CONSTRAINT `detalle_pedido_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`ID`);

--
-- Filtros para la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`TblProductoID`) REFERENCES `producto` (`ID`),
  ADD CONSTRAINT `inventario_ibfk_2` FOREIGN KEY (`TblProductoID`) REFERENCES `producto` (`ID`);

--
-- Filtros para la tabla `materiaprimas`
--
ALTER TABLE `materiaprimas`
  ADD CONSTRAINT `materiaprimas_ibfk_1` FOREIGN KEY (`TblProveedorID`) REFERENCES `proveedor` (`ID`),
  ADD CONSTRAINT `materiaprimas_ibfk_2` FOREIGN KEY (`TblProveedorID`) REFERENCES `proveedor` (`ID`),
  ADD CONSTRAINT `materiaprimas_ibfk_3` FOREIGN KEY (`TblProveedorID`) REFERENCES `proveedor` (`ID`),
  ADD CONSTRAINT `materiaprimas_ibfk_4` FOREIGN KEY (`TblProveedorID`) REFERENCES `proveedor` (`ID`),
  ADD CONSTRAINT `materiaprimas_ibfk_5` FOREIGN KEY (`TblProveedorID`) REFERENCES `proveedor` (`ID`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `fk_estado` FOREIGN KEY (`EstadoID`) REFERENCES `estado` (`ID`),
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`ProveedorID`) REFERENCES `proveedor` (`ID`);

--
-- Filtros para la tabla `tblempleados_tblproducto`
--
ALTER TABLE `tblempleados_tblproducto`
  ADD CONSTRAINT `tblempleados_tblproducto_ibfk_1` FOREIGN KEY (`TblProductoID`) REFERENCES `producto` (`ID`),
  ADD CONSTRAINT `tblempleados_tblproducto_ibfk_2` FOREIGN KEY (`TblEmpleadosID`) REFERENCES `empleados` (`ID`);

--
-- Filtros para la tabla `tblmateriaprimas_tblempleados`
--
ALTER TABLE `tblmateriaprimas_tblempleados`
  ADD CONSTRAINT `tblmateriaprimas_tblempleados_ibfk_1` FOREIGN KEY (`TblMateriaPrimasID`) REFERENCES `materiaprimas` (`ID`),
  ADD CONSTRAINT `tblmateriaprimas_tblempleados_ibfk_2` FOREIGN KEY (`TblEmpleadosID`) REFERENCES `empleados` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
