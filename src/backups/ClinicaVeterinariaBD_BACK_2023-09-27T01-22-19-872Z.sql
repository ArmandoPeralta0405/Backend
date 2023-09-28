/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: articulo
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `articulo` (
  `articulo_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del artículo',
  `descripcion` varchar(255) NOT NULL COMMENT 'Descripción del artículo',
  `codigo_alfanumerico` varchar(50) NOT NULL COMMENT 'Código alfanumérico del artículo',
  `marca_id` int(11) DEFAULT NULL COMMENT 'Identificador de la marca a la que pertenece el artículo',
  `impuesto_id` int(11) DEFAULT NULL COMMENT 'Identificador del impuesto aplicado al artículo',
  `unidad_medida_id` int(11) DEFAULT NULL COMMENT 'Identificador de la unidad de medida del artículo',
  `estado` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Estado del articulo (activo/inactivo)',
  PRIMARY KEY (`articulo_id`),
  KEY `FK_ARTICULO_MARCA` (`marca_id`),
  KEY `FK_ARTICULO_IMPUESTO` (`impuesto_id`),
  KEY `FK_ARTICULO_UNIDAD_MEDIDA` (`unidad_medida_id`),
  CONSTRAINT `FK_ARTICULO_IMPUESTO` FOREIGN KEY (`impuesto_id`) REFERENCES `impuesto` (`impuesto_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_ARTICULO_MARCA` FOREIGN KEY (`marca_id`) REFERENCES `marca` (`marca_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_ARTICULO_UNIDAD_MEDIDA` FOREIGN KEY (`unidad_medida_id`) REFERENCES `unidad_medida` (`unidad_medida_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 51 DEFAULT CHARSET = utf8mb4 COMMENT = 'Tabla que almacena información sobre artículos en el sistema';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: articulo_deposito
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `articulo_deposito` (
  `articulo_id` int(11) NOT NULL COMMENT 'Identificador del artículo',
  `deposito_id` int(11) NOT NULL COMMENT 'Identificador del depósito',
  `cantidad` int(11) NOT NULL COMMENT 'Cantidad de stock del artículo en el depósito',
  PRIMARY KEY (`articulo_id`, `deposito_id`),
  KEY `FK_AD_ARTICULO` (`articulo_id`),
  KEY `FK_AD_DEPOSITO` (`deposito_id`),
  CONSTRAINT `FK_AD_ARTICULO` FOREIGN KEY (`articulo_id`) REFERENCES `articulo` (`articulo_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_AD_DEPOSITO` FOREIGN KEY (`deposito_id`) REFERENCES `deposito` (`deposito_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = 'Tabla intermedia que almacena la cantidad de stock de artículos en cada depósito';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: articulo_lista_precio
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `articulo_lista_precio` (
  `articulo_id` int(11) NOT NULL COMMENT 'Identificador del artículo',
  `lista_precio_id` int(11) NOT NULL COMMENT 'Identificador de la lista de precio',
  `precio` decimal(10, 3) NOT NULL COMMENT 'Precio del artículo en la lista de precio',
  PRIMARY KEY (`articulo_id`, `lista_precio_id`),
  KEY `FK_ALP_ARTICULO` (`articulo_id`),
  KEY `FK_ALP_LISTA_PRECIO` (`lista_precio_id`),
  CONSTRAINT `FK_ALP_ARTICULO` FOREIGN KEY (`articulo_id`) REFERENCES `articulo` (`articulo_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_ALP_LISTA_PRECIO` FOREIGN KEY (`lista_precio_id`) REFERENCES `lista_precio` (`lista_precio_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = 'Tabla que almacena la relación entre artículos y listas de precio con su precio correspondiente';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: caja
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `caja` (
  `caja_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la caja',
  `descripcion` varchar(100) NOT NULL COMMENT 'Descripción de la caja (hasta 100 caracteres)',
  `moneda_id` int(11) NOT NULL COMMENT 'Identificador de la moneda asociada a la caja',
  `estado` tinyint(1) DEFAULT 1 COMMENT 'Estado de la caja (activo/inactivo)',
  PRIMARY KEY (`caja_id`),
  KEY `FK_M_CAJA` (`moneda_id`),
  CONSTRAINT `FK_M_CAJA` FOREIGN KEY (`moneda_id`) REFERENCES `moneda` (`moneda_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = 'Tabla que almacena información sobre cajas en el sistema';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: cliente
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `cliente` (
  `cliente_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del cliente',
  `nombre` varchar(100) NOT NULL COMMENT 'Nombre del cliente',
  `apellido` varchar(100) NOT NULL COMMENT 'Apellido del cliente',
  `cedula` varchar(20) NOT NULL COMMENT 'Número de cédula del cliente',
  `telefono` varchar(15) DEFAULT NULL COMMENT 'Número de teléfono del cliente',
  `direccion` varchar(255) DEFAULT NULL COMMENT 'Dirección del cliente',
  `estado` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Estado del cliente',
  PRIMARY KEY (`cliente_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COMMENT = 'Tabla que almacena información sobre clientes en el sistema';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: deposito
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `deposito` (
  `deposito_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del depósito',
  `descripcion` varchar(100) NOT NULL COMMENT 'Descripción del depósito (hasta 100 caracteres)',
  PRIMARY KEY (`deposito_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COMMENT = 'Tabla que almacena información sobre depósitos en el sistema';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: impuesto
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `impuesto` (
  `impuesto_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del impuesto',
  `descripcion` varchar(100) NOT NULL COMMENT 'Descripción del impuesto (hasta 100 caracteres)',
  `valor` decimal(15, 3) NOT NULL COMMENT 'Valor del impuesto (número decimal)',
  `porcentaje` decimal(15, 3) NOT NULL,
  PRIMARY KEY (`impuesto_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COMMENT = 'Tabla que almacena información sobre impuestos en el sistema';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: lista_precio
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `lista_precio` (
  `lista_precio_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la lista de precio',
  `descripcion` varchar(100) NOT NULL COMMENT 'Descripción de la lista de precio (hasta 100 caracteres)',
  `moneda_id` int(11) NOT NULL COMMENT 'Identificador de la moneda asociada a la lista de precio',
  PRIMARY KEY (`lista_precio_id`),
  KEY `fk_lista_precio_moneda` (`moneda_id`),
  CONSTRAINT `fk_lista_precio_moneda` FOREIGN KEY (`moneda_id`) REFERENCES `moneda` (`moneda_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COMMENT = 'Tabla que almacena información sobre listas de precio en el sistema';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: marca
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `marca` (
  `marca_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la marca',
  `descripcion` varchar(100) NOT NULL COMMENT 'Descripción de la marca (hasta 100 caracteres)',
  PRIMARY KEY (`marca_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 51 DEFAULT CHARSET = utf8mb4 COMMENT = 'Tabla que almacena información sobre marcas en el sistema';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: modulo
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `modulo` (
  `modulo_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del módulo',
  `descripcion` varchar(100) NOT NULL COMMENT 'Descripción del módulo (hasta 100 caracteres)',
  `abreviacion` varchar(5) NOT NULL COMMENT 'Abreviación única del módulo (hasta 5 caracteres)',
  `estado` tinyint(1) DEFAULT 1 COMMENT 'Estado del módulo (activo/inactivo)',
  PRIMARY KEY (`modulo_id`),
  UNIQUE KEY `abreviacion` (`abreviacion`)
) ENGINE = InnoDB AUTO_INCREMENT = 8 DEFAULT CHARSET = utf8mb4 COMMENT = 'Tabla que almacena información sobre módulos en el sistema';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: moneda
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `moneda` (
  `moneda_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la moneda',
  `descripcion` varchar(100) NOT NULL COMMENT 'Descripción de la moneda (hasta 100 caracteres)',
  `abreviacion` varchar(10) NOT NULL COMMENT 'Abreviación de la moneda (hasta 10 caracteres)',
  `decimal` int(10) NOT NULL COMMENT 'Decimales que maneja la moneda',
  PRIMARY KEY (`moneda_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COMMENT = 'Tabla que almacena información sobre monedas en el sistema';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: pedido_venta
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `pedido_venta` (
  `pedido_venta_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador del pedido que será utilizado en la caja',
  `fecha_hora` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Fecha y hora registrada en la base de datos',
  `moneda_id` int(11) NOT NULL COMMENT 'La moneda utilizada para el pedido',
  `lista_precio_id` int(11) NOT NULL COMMENT 'La lista de precio que se utilizará para obtener los precios de los artículos',
  `numero_pedido` int(11) NOT NULL COMMENT 'Numeración interna para saber el número de pedido',
  `observacion` varchar(255) DEFAULT NULL COMMENT 'Algunas observaciones del pedido',
  `usuario_id` int(11) NOT NULL COMMENT 'Para saber quien generó el pedido',
  `estado` tinyint(4) NOT NULL DEFAULT 1 COMMENT 'Estado del pedido (1: Pendiente, 2: Facturado: 3: Rechazado)',
  PRIMARY KEY (`pedido_venta_id`),
  KEY `FK_PV_MONEDA` (`moneda_id`),
  KEY `FK_PV_LISTA_PRECIO` (`lista_precio_id`),
  KEY `FK_PV_USUARIO` (`usuario_id`),
  CONSTRAINT `FK_PV_LISTA_PRECIO` FOREIGN KEY (`lista_precio_id`) REFERENCES `lista_precio` (`lista_precio_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_PV_MONEDA` FOREIGN KEY (`moneda_id`) REFERENCES `moneda` (`moneda_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_PV_USUARIO` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 27 DEFAULT CHARSET = utf8mb4 COMMENT = 'Tabla que almacena información sobre pedidos de venta en el sistema';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: pedido_venta_detalle
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `pedido_venta_detalle` (
  `pedido_venta_id` int(11) NOT NULL COMMENT 'Identificador del pedido de la tabla pedido_venta',
  `item_numero` int(11) NOT NULL COMMENT 'Orden en el que va siendo registrada el artículo',
  `articulo_id` int(11) NOT NULL COMMENT 'Identificador del artículo',
  `cantidad` decimal(15, 3) NOT NULL COMMENT 'Cantidad ingresada del artículo',
  `precio` decimal(15, 3) NOT NULL COMMENT 'Precio del artículo',
  `monto_neto` decimal(15, 3) NOT NULL COMMENT 'Monto total del artículo sin IVA',
  `monto_iva` decimal(15, 3) NOT NULL COMMENT 'Monto del IVA del total del artículo',
  `porcentaje_iva` decimal(5, 3) NOT NULL COMMENT 'Porcentaje del IVA correspondiente al impuesto',
  `referencia` varchar(100) NOT NULL COMMENT 'Referencia utilizada del articulo al momento de ingresar el detalle',
  PRIMARY KEY (`pedido_venta_id`, `item_numero`, `articulo_id`),
  KEY `FK_PVD_ARTICULO` (`articulo_id`),
  CONSTRAINT `FK_PVD_ARTICULO` FOREIGN KEY (`articulo_id`) REFERENCES `articulo` (`articulo_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_PVD_PEDIDO_VENTA` FOREIGN KEY (`pedido_venta_id`) REFERENCES `pedido_venta` (`pedido_venta_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = 'Tabla que almacena el detalle de pedidos de venta en el sistema';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: rol
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `rol` (
  `rol_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del rol',
  `descripcion` varchar(100) NOT NULL COMMENT 'Descripción del rol (hasta 100 caracteres)',
  PRIMARY KEY (`rol_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 7 DEFAULT CHARSET = utf8mb4 COMMENT = 'Tabla que almacena información sobre roles de usuarios en el sistema';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: tipo_programa
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `tipo_programa` (
  `tipo_programa_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del tipo de programa',
  `descripcion` varchar(100) NOT NULL COMMENT 'Descripción del tipo de programa (hasta 100 caracteres)',
  PRIMARY KEY (`tipo_programa_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 7 DEFAULT CHARSET = utf8mb4 COMMENT = 'Tabla que almacena información sobre tipos de programas en el sistema';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: unidad_medida
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `unidad_medida` (
  `unidad_medida_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la unidad de medida',
  `descripcion` varchar(255) NOT NULL COMMENT 'Descripción de la unidad de medida',
  `abreviacion` varchar(10) NOT NULL COMMENT 'Abreviación de la unidad de medida',
  PRIMARY KEY (`unidad_medida_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COMMENT = 'Tabla que almacena información sobre unidades de medida en el sistema';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: usuario
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `usuario` (
  `usuario_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID único del usuario',
  `alias` varchar(50) NOT NULL COMMENT 'Nombre de usuario para iniciar sesión',
  `clave` varchar(255) NOT NULL COMMENT 'Contraseña (se recomienda almacenar de forma segura)',
  `nombre` varchar(100) NOT NULL COMMENT 'Nombre del usuario',
  `apellido` varchar(100) NOT NULL COMMENT 'Apellido del usuario',
  `email` varchar(100) NOT NULL COMMENT 'Correo electrónico para comunicación (debe ser único)',
  `cedula_identidad` varchar(20) DEFAULT NULL COMMENT 'Número de cédula de identidad',
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Fecha de registro (se establece automáticamente)',
  `fecha_actualizacion` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp() COMMENT 'Fecha de última actualización (se actualiza automáticamente)',
  `estado` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Estado de la cuenta (activo o inactivo)',
  PRIMARY KEY (`usuario_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COMMENT = 'Tabla que almacena información de usuarios para el sistema de gestión de la clínica veterinaria';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: articulo_lista_precio_view
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `articulo_lista_precio_view` AS
select
  `a`.`articulo_id` AS `articulo_id`,
  `a`.`descripcion` AS `descripcion_articulo`,
  `lp`.`lista_precio_id` AS `lista_precio_id`,
  `lp`.`descripcion` AS `descripcion_lista_precio`,
  `lp`.`moneda_id` AS `moneda_id`,
  `m`.`descripcion` AS `descripcion_moneda`,
  ifnull(`alp`.`precio`, 0) AS `precio`
from
  (
  (
    (
    `articulo` `a`
    join `lista_precio` `lp`
    )
    left join `articulo_lista_precio` `alp` on(
    `a`.`articulo_id` = `alp`.`articulo_id`
    and `lp`.`lista_precio_id` = `alp`.`lista_precio_id`
    )
  )
  left join `moneda` `m` on(`m`.`moneda_id` = `lp`.`moneda_id`)
  );

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: articulo_view
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `articulo_view` AS
select
  `a`.`articulo_id` AS `articulo_id`,
  `a`.`descripcion` AS `descripcion`,
  `a`.`codigo_alfanumerico` AS `codigo_alfanumerico`,
  `a`.`marca_id` AS `marca_id`,
  `m`.`descripcion` AS `marca_descripcion`,
  `a`.`impuesto_id` AS `impuesto_id`,
  `i`.`descripcion` AS `impuesto_descripcion`,
  `u`.`unidad_medida_id` AS `unidad_medida_id`,
  `u`.`descripcion` AS `unidad_medida_descripcion`,
  `a`.`estado` AS `estado`
from
  (
  (
    (
    `articulo` `a`
    left join `marca` `m` on(`a`.`marca_id` = `m`.`marca_id`)
    )
    left join `impuesto` `i` on(`a`.`impuesto_id` = `i`.`impuesto_id`)
  )
  left join `unidad_medida` `u` on(`a`.`unidad_medida_id` = `u`.`unidad_medida_id`)
  );

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: lista_precio_view
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `lista_precio_view` AS
select
  `lp`.`lista_precio_id` AS `lista_precio_id`,
  `lp`.`descripcion` AS `descripcion`,
  `m`.`descripcion` AS `moneda_descripcion`
from
  (
  `lista_precio` `lp`
  left join `moneda` `m` on(`lp`.`moneda_id` = `m`.`moneda_id`)
  );

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: pedido_venta_comprobante_view
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `pedido_venta_comprobante_view` AS
select
  `pvv`.`pedido_venta_id` AS `pedido_venta_id`,
  `pvv`.`numero_pedido` AS `numero_pedido`,
  `pvv`.`estado` AS `estado`,
  `pvv`.`fecha_hora` AS `fecha_hora`,
  `pvv`.`moneda_id` AS `moneda_id`,
  `pvv`.`descripcion_moneda` AS `descripcion_moneda`,
  `pvv`.`lista_precio_id` AS `lista_precio_id`,
  `pvv`.`descripcion_lista_precio` AS `descripcion_lista_precio`,
  `pvv`.`observacion` AS `observacion`,
  `pvdv`.`item_numero` AS `item_numero`,
  `pvdv`.`referencia` AS `referencia`,
  `pvdv`.`descripcion_articulo` AS `descripcion_articulo`,
  `pvdv`.`cantidad` AS `cantidad`,
  `pvdv`.`precio` AS `precio`,
  `pvdv`.`monto_sub_total` AS `monto_sub_total`
from
  (
  `pedido_venta_detalle_view` `pvdv`
  join `pedido_venta_view` `pvv` on(
    `pvv`.`pedido_venta_id` = `pvdv`.`pedido_venta_id`
  )
  )
order by
  `pvv`.`pedido_venta_id`,
  `pvdv`.`item_numero`;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: pedido_venta_detalle_view
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `pedido_venta_detalle_view` AS
select
  `pvd`.`pedido_venta_id` AS `pedido_venta_id`,
  `pvd`.`item_numero` AS `item_numero`,
  `pvd`.`articulo_id` AS `articulo_id`,
  `a`.`descripcion` AS `descripcion_articulo`,
  `pvd`.`cantidad` AS `cantidad`,
  `pvd`.`precio` AS `precio`,
  `pvd`.`monto_neto` AS `monto_neto`,
  `pvd`.`monto_iva` AS `monto_iva`,
  round(
  `pvd`.`monto_neto` + `pvd`.`monto_iva`,
  `m`.`decimal`
  ) AS `monto_sub_total`,
  `pvd`.`porcentaje_iva` AS `porcentaje_iva`,
  lpad(`pv`.`numero_pedido`, 3, 0) AS `numero_pedido`,
  `pvd`.`referencia` AS `referencia`
from
  (
  (
    (
    `pedido_venta_detalle` `pvd`
    join `articulo` `a` on(`pvd`.`articulo_id` = `a`.`articulo_id`)
    )
    join `pedido_venta` `pv` on(`pvd`.`pedido_venta_id` = `pv`.`pedido_venta_id`)
  )
  join `moneda` `m` on(`m`.`moneda_id` = `pv`.`moneda_id`)
  )
order by
  `pvd`.`item_numero`;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: pedido_venta_view
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `pedido_venta_view` AS
select
  `pv`.`pedido_venta_id` AS `pedido_venta_id`,
  `pv`.`fecha_hora` AS `fecha_hora`,
  `pv`.`moneda_id` AS `moneda_id`,
  `m`.`descripcion` AS `descripcion_moneda`,
  `pv`.`lista_precio_id` AS `lista_precio_id`,
  `lp`.`descripcion` AS `descripcion_lista_precio`,
  `pv`.`usuario_id` AS `usuario_id`,
  concat(`u`.`nombre`, ' ', `u`.`apellido`) AS `descripcion_usuario`,
  lpad(`pv`.`numero_pedido`, 3, 0) AS `numero_pedido`,
  `pv`.`observacion` AS `observacion`,case
  when `pv`.`estado` = 1 then 'Pendiente'
  when `pv`.`estado` = 2 then 'Facturado'
  when `pv`.`estado` = 3 then 'Rechazado'
  else 'Estado Desconocido'
  end AS `estado`
from
  (
  (
    (
    `pedido_venta` `pv`
    left join `moneda` `m` on(`pv`.`moneda_id` = `m`.`moneda_id`)
    )
    left join `lista_precio` `lp` on(`pv`.`lista_precio_id` = `lp`.`lista_precio_id`)
  )
  left join `usuario` `u` on(`pv`.`usuario_id` = `u`.`usuario_id`)
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: articulo
# ------------------------------------------------------------

INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (1, 'Martillo de Uso General', 'MART001', 1, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (2, 'Destornillador de Pala', 'DEST001', 2, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (3, 'Taladro Inalámbrico', 'TALD001', 3, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (4, 'Sierra Circular', 'SIEC001', 4, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (5, 'Amoladora Angular', 'AMOL001', 5, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (6, 'Atornillador Eléctrico', 'ATOR001', 6, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (7, 'Llave Ajustable', 'LLAV001', 7, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (8, 'Cinta Métrica', 'CINT001', 8, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (9, 'Nivel de Burbuja', 'NIVE001', 9, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (10, 'Llave de Tubo', 'LLTU001', 10, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (11, 'Sierra de Mano', 'SIEM001', 11, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (12, 'Alicates de Corte', 'ALIC001', 12, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (13, 'Sierra Caladora', 'SIEC002', 13, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (14, 'Lijadora Orbital', 'LIJO001', 14, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (15, 'Escalera de Aluminio', 'ESCA001', 15, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (16, 'Destornillador Phillips', 'DEST002', 16, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (17, 'Clavos de Acero', 'CLAV001', 17, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (18, 'Tornillos de Rosca', 'TORN001', 18, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (19, 'Broca para Madera', 'BROC001', 19, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (20, 'Broca para Metal', 'BROC002', 20, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (21, 'Pintura en Aerosol', 'PINT001', 21, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (22, 'Cerradura de Puerta', 'CERR001', 22, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (23, 'Pegamento de Contacto', 'PEG001', 23, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (24, 'Cemento de PVC', 'CEME001', 24, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (25, 'Aceite Lubricante', 'ACEI001', 25, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (26, 'Llave Inglesa', 'LLIN001', 26, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (27, 'Llave de Impacto', 'LLIM001', 27, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (28, 'Cadena de Seguridad', 'CADE001', 28, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (29, 'Funda para Taladro', 'FUNT001', 29, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (30, 'Tijeras de Corte', 'TIJE001', 30, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (31, 'Cinta de Aislamiento', 'CINT002', 31, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (32, 'Cepillo Metálico', 'CEPI001', 32, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (33, 'Pala de Jardín', 'PALA001', 33, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (34, 'Azada de Agricultor', 'AZAD001', 34, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (35, 'Serrucho de Podar', 'SERR001', 35, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (36, 'Pistola de Calor', 'PIST001', 36, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (37, 'Cinta de Embalar', 'CINT003', 37, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (38, 'Destornillador Torx', 'DEST003', 38, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (39, 'Llave de Fontanero', 'LLFO001', 39, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (40, 'Escuadra de Carpintero', 'ESCU001', 40, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (41, 'Punzón de Centro', 'PUNZ001', 41, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (42, 'Cepillo para Madera', 'CEPI002', 42, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (43, 'Martillo de Carpintero', 'MARC001', 43, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (44, 'Nivel Láser', 'NIVEL001', 44, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (45, 'Cable Eléctrico', 'CABL001', 45, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (46, 'Papel de Lija', 'PAPEL001', 46, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (47, 'Pegamento Epoxi', 'PEGE001', 47, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (48, 'Soga de Nylon', 'SOGA001', 48, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (49, 'Broca de Concreto', 'BROC003', 49, 3, 1, 1);
INSERT INTO
  `articulo` (
    `articulo_id`,
    `descripcion`,
    `codigo_alfanumerico`,
    `marca_id`,
    `impuesto_id`,
    `unidad_medida_id`,
    `estado`
  )
VALUES
  (50, 'Broca de Vidrio', 'BROC004', 50, 3, 1, 1);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: articulo_deposito
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: articulo_lista_precio
# ------------------------------------------------------------

INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (1, 1, 26550.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (2, 1, 65400.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (3, 1, 52320.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (4, 1, 60420.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (5, 1, 45140.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (6, 1, 39440.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (7, 1, 56770.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (8, 1, 65530.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (9, 1, 57360.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (10, 1, 85180.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (11, 1, 58830.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (12, 1, 33630.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (13, 1, 81630.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (14, 1, 17280.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (15, 1, 26490.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (16, 1, 75630.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (17, 1, 8660.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (18, 1, 96420.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (19, 1, 71120.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (20, 1, 61350.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (21, 1, 88370.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (22, 1, 62790.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (23, 1, 43850.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (24, 1, 25890.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (25, 1, 87880.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (26, 1, 71740.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (27, 1, 90070.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (28, 1, 40130.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (29, 1, 20420.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (30, 1, 71720.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (31, 1, 7360.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (32, 1, 6630.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (33, 1, 6050.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (34, 1, 5380.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (35, 1, 98730.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (36, 1, 92520.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (37, 1, 66420.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (38, 1, 49510.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (39, 1, 43320.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (40, 1, 63080.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (41, 1, 85410.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (42, 1, 42840.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (43, 1, 47940.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (44, 1, 11210.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (45, 1, 97220.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (46, 1, 67450.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (47, 1, 40610.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (48, 1, 90700.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (49, 1, 41680.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (50, 1, 26310.000);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: caja
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: cliente
# ------------------------------------------------------------

INSERT INTO
  `cliente` (
    `cliente_id`,
    `nombre`,
    `apellido`,
    `cedula`,
    `telefono`,
    `direccion`,
    `estado`
  )
VALUES
  (
    1,
    'Armando Ariel',
    'Peralta Martinez',
    '5955455',
    '975489075',
    'Barrio Virgen Serrana - Dr. J. Eulogio Estigarribia - Paraguay',
    1
  );
INSERT INTO
  `cliente` (
    `cliente_id`,
    `nombre`,
    `apellido`,
    `cedula`,
    `telefono`,
    `direccion`,
    `estado`
  )
VALUES
  (
    2,
    'Jorge',
    'Villasanti',
    '5125963',
    '971852963',
    NULL,
    1
  );
INSERT INTO
  `cliente` (
    `cliente_id`,
    `nombre`,
    `apellido`,
    `cedula`,
    `telefono`,
    `direccion`,
    `estado`
  )
VALUES
  (3, 'Mariela', 'Pereira', '1288966', NULL, NULL, 1);
INSERT INTO
  `cliente` (
    `cliente_id`,
    `nombre`,
    `apellido`,
    `cedula`,
    `telefono`,
    `direccion`,
    `estado`
  )
VALUES
  (4, 'Agripino', 'Escamilla', '7859222', NULL, NULL, 1);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: deposito
# ------------------------------------------------------------

INSERT INTO
  `deposito` (`deposito_id`, `descripcion`)
VALUES
  (1, 'Salón de ventas');
INSERT INTO
  `deposito` (`deposito_id`, `descripcion`)
VALUES
  (2, 'Deposito Central');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: impuesto
# ------------------------------------------------------------

INSERT INTO
  `impuesto` (`impuesto_id`, `descripcion`, `valor`, `porcentaje`)
VALUES
  (1, 'Iva Exento', 0.000, 0.000);
INSERT INTO
  `impuesto` (`impuesto_id`, `descripcion`, `valor`, `porcentaje`)
VALUES
  (2, 'Iva 5%', 21.000, 5.000);
INSERT INTO
  `impuesto` (`impuesto_id`, `descripcion`, `valor`, `porcentaje`)
VALUES
  (3, 'Iva 10%', 11.000, 10.000);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: lista_precio
# ------------------------------------------------------------

INSERT INTO
  `lista_precio` (`lista_precio_id`, `descripcion`, `moneda_id`)
VALUES
  (1, 'Precio General', 1);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: marca
# ------------------------------------------------------------

INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (1, 'Stanley');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (2, 'DeWalt');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (3, 'Black & Decker');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (4, 'Bosch');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (5, 'Makita');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (6, 'Milwaukee');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (7, 'Ryobi');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (8, 'Craftsman');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (9, 'Husky');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (10, 'Irwin');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (11, 'Channellock');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (12, 'Klein Tools');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (13, 'Dremel');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (14, 'RIDGID');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (15, 'Hitachi');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (16, 'Kobalt');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (17, 'Porter-Cable');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (18, 'Crescent');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (19, 'Estwing');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (20, 'Lenox');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (21, 'GearWrench');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (22, 'Koblenz');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (23, 'Tuff Stuff');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (24, 'Master Lock');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (25, 'Schlage');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (26, 'Kwikset');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (27, 'Brinks');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (28, 'Amerock');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (29, 'Rust-Oleum');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (30, 'Behr');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (31, 'Minwax');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (32, '3M');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (33, 'Rustoleum');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (34, 'Rustins');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (35, 'Loctite');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (36, 'Sika');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (37, 'Gorilla Glue');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (38, 'Permatex');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (39, 'Liquid Nails');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (40, 'Red Devil');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (41, 'GE Silicone');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (42, 'WD-40');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (43, 'CRC');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (44, 'Zinsser');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (45, 'Varathane');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (46, 'Krylon');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (47, 'J-B Weld');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (48, 'Plasti Dip');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (49, 'Scotch');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (50, 'Elmer\'s');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: modulo
# ------------------------------------------------------------

INSERT INTO
  `modulo` (`modulo_id`, `descripcion`, `abreviacion`, `estado`)
VALUES
  (1, 'Modulo de finanzas', 'Finan', 1);
INSERT INTO
  `modulo` (`modulo_id`, `descripcion`, `abreviacion`, `estado`)
VALUES
  (2, 'Modulo de compras', 'Compr', 1);
INSERT INTO
  `modulo` (`modulo_id`, `descripcion`, `abreviacion`, `estado`)
VALUES
  (3, 'Modulo de facturacion', 'Factu', 1);
INSERT INTO
  `modulo` (`modulo_id`, `descripcion`, `abreviacion`, `estado`)
VALUES
  (4, 'Modulos de contabilidad', 'Conta', 1);
INSERT INTO
  `modulo` (`modulo_id`, `descripcion`, `abreviacion`, `estado`)
VALUES
  (5, 'Modulo de acopio', 'Acopi', 1);
INSERT INTO
  `modulo` (`modulo_id`, `descripcion`, `abreviacion`, `estado`)
VALUES
  (7, 'Modulo de control de stock', 'Stock', 1);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: moneda
# ------------------------------------------------------------

INSERT INTO
  `moneda` (
    `moneda_id`,
    `descripcion`,
    `abreviacion`,
    `decimal`
  )
VALUES
  (1, 'Guaranies', 'Gs', 0);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: pedido_venta
# ------------------------------------------------------------

INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (
    1,
    '2023-09-20 13:07:01',
    1,
    1,
    1,
    'prueba pedido de venta',
    1,
    1
  );
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (
    2,
    '2023-09-25 10:55:04',
    1,
    1,
    2,
    'prueba impresion',
    1,
    1
  );
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (3, '2023-09-25 10:56:07', 1, 1, 3, 'asdasd', 1, 1);
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (4, '2023-09-25 10:57:02', 1, 1, 4, 'asdasdasd', 1, 1);
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (5, '2023-09-25 11:12:21', 1, 1, 5, 'prueba 2', 1, 1);
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (
    6,
    '2023-09-25 15:36:24',
    1,
    1,
    6,
    'prueba de pedido de ventas',
    1,
    1
  );
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (
    7,
    '2023-09-25 15:38:16',
    1,
    1,
    7,
    'pedido de ventas de pruebas',
    1,
    1
  );
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (8, '2023-09-25 16:19:24', 1, 1, 8, 'asdasd', 1, 1);
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (9, '2023-09-25 16:22:28', 1, 1, 9, 'asdasd', 1, 1);
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (10, '2023-09-25 16:24:14', 1, 1, 10, 'prueba', 1, 1);
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (11, '2023-09-25 16:29:39', 1, 1, 11, 'pupupupu', 1, 1);
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (12, '2023-09-25 16:31:20', 1, 1, 12, 'asdasd', 1, 1);
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (13, '2023-09-25 16:36:47', 1, 1, 13, 'prueba', 1, 1);
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (14, '2023-09-25 16:43:00', 1, 1, 14, 'asdasd', 1, 1);
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (15, '2023-09-25 16:43:46', 1, 1, 15, 'asdas', 1, 1);
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (16, '2023-09-25 16:46:05', 1, 1, 16, 'asdasd', 1, 1);
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (17, '2023-09-25 16:50:18', 1, 1, 17, 'asdasda', 1, 1);
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (18, '2023-09-25 16:52:01', 1, 1, 18, 'asdasd', 1, 1);
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (19, '2023-09-25 16:52:35', 1, 1, 19, 'asdasdasda', 1, 1);
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (20, '2023-09-25 16:53:15', 1, 1, 20, 'asssssss', 1, 1);
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (21, '2023-09-25 16:57:53', 1, 1, 21, 'asdas', 1, 1);
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (22, '2023-09-25 21:06:30', 1, 1, 22, 'prueba', 1, 1);
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (23, '2023-09-25 22:33:11', 1, 1, 23, 'asdasd', 1, 1);
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (24, '2023-09-25 22:34:01', 1, 1, 24, 'asdasd', 1, 1);
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (25, '2023-09-25 22:34:50', 1, 1, 25, 'asdasda', 1, 1);
INSERT INTO
  `pedido_venta` (
    `pedido_venta_id`,
    `fecha_hora`,
    `moneda_id`,
    `lista_precio_id`,
    `numero_pedido`,
    `observacion`,
    `usuario_id`,
    `estado`
  )
VALUES
  (
    26,
    '2023-09-25 22:40:52',
    1,
    1,
    26,
    'prueba de pedido de venta con generacion de informe para impresion',
    1,
    1
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: pedido_venta_detalle
# ------------------------------------------------------------

INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    1,
    1,
    1,
    5.000,
    26550.000,
    120682.000,
    12068.000,
    10.000,
    'MART001'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    1,
    2,
    8,
    2.000,
    65530.000,
    119145.000,
    11915.000,
    10.000,
    'CINT001'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    2,
    1,
    25,
    3.000,
    87880.000,
    239673.000,
    23967.000,
    10.000,
    '25'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    2,
    2,
    6,
    3.000,
    39440.000,
    107564.000,
    10756.000,
    10.000,
    '6'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    2,
    3,
    2,
    1.000,
    65400.000,
    59455.000,
    5945.000,
    10.000,
    '2'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    2,
    4,
    5,
    1.000,
    45140.000,
    41036.000,
    4104.000,
    10.000,
    '5'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    2,
    5,
    3,
    5.000,
    52320.000,
    237818.000,
    23782.000,
    10.000,
    '3'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    2,
    6,
    50,
    1.000,
    26310.000,
    23918.000,
    2392.000,
    10.000,
    '50'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    3,
    1,
    45,
    21.000,
    97220.000,
    1856018.000,
    185602.000,
    10.000,
    '45'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    4,
    1,
    2,
    5.000,
    65400.000,
    297273.000,
    29727.000,
    10.000,
    '2'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    4,
    2,
    8,
    1.000,
    65530.000,
    59573.000,
    5957.000,
    10.000,
    '8'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    5,
    1,
    4,
    1.000,
    60420.000,
    54927.000,
    5493.000,
    10.000,
    '4'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    5,
    2,
    6,
    2.000,
    39440.000,
    71709.000,
    7171.000,
    10.000,
    '6'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    5,
    3,
    8,
    7.000,
    65530.000,
    417009.000,
    41701.000,
    10.000,
    '8'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    6,
    1,
    10,
    1.000,
    85180.000,
    77436.000,
    7744.000,
    10.000,
    '10'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    6,
    2,
    20,
    2.000,
    61350.000,
    111545.000,
    11155.000,
    10.000,
    '20'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    6,
    3,
    30,
    3.000,
    71720.000,
    195600.000,
    19560.000,
    10.000,
    '30'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    6,
    4,
    40,
    4.000,
    63080.000,
    229382.000,
    22938.000,
    10.000,
    '40'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    7,
    1,
    2,
    12.000,
    65400.000,
    713455.000,
    71345.000,
    10.000,
    '2'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    7,
    2,
    6,
    4.000,
    39440.000,
    143418.000,
    14342.000,
    10.000,
    '6'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    8,
    1,
    1,
    5.000,
    26550.000,
    120682.000,
    12068.000,
    10.000,
    '1'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    9,
    1,
    1,
    5.000,
    26550.000,
    120682.000,
    12068.000,
    10.000,
    '1'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    9,
    2,
    2,
    3.000,
    65400.000,
    178364.000,
    17836.000,
    10.000,
    '2'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    9,
    3,
    4,
    7.000,
    60420.000,
    384491.000,
    38449.000,
    10.000,
    '4'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    10,
    1,
    5,
    1.000,
    45140.000,
    41036.000,
    4104.000,
    10.000,
    '5'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    10,
    2,
    10,
    8.000,
    85180.000,
    619491.000,
    61949.000,
    10.000,
    '10'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    11,
    1,
    45,
    1.000,
    97220.000,
    88382.000,
    8838.000,
    10.000,
    '45'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    11,
    2,
    6,
    2.000,
    39440.000,
    71709.000,
    7171.000,
    10.000,
    '6'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    12,
    1,
    5,
    2.000,
    45140.000,
    82073.000,
    8207.000,
    10.000,
    '5'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    12,
    2,
    47,
    1.000,
    40610.000,
    36918.000,
    3692.000,
    10.000,
    '47'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    13,
    1,
    45,
    12.000,
    97220.000,
    1060582.000,
    106058.000,
    10.000,
    '45'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    13,
    2,
    24,
    5.000,
    25890.000,
    117682.000,
    11768.000,
    10.000,
    'CEME001'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    13,
    3,
    32,
    4.000,
    6630.000,
    24109.000,
    2411.000,
    10.000,
    'CEPI001'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    14,
    1,
    1,
    5.000,
    26550.000,
    120682.000,
    12068.000,
    10.000,
    '1'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    14,
    2,
    2,
    5.000,
    65400.000,
    297273.000,
    29727.000,
    10.000,
    '2'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    14,
    3,
    3,
    4.000,
    52320.000,
    190255.000,
    19025.000,
    10.000,
    '3'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    15,
    1,
    1,
    5.000,
    26550.000,
    120682.000,
    12068.000,
    10.000,
    '1'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    15,
    2,
    2,
    6.000,
    65400.000,
    356727.000,
    35673.000,
    10.000,
    '2'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    15,
    3,
    3,
    8.000,
    52320.000,
    380509.000,
    38051.000,
    10.000,
    '3'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    16,
    1,
    1,
    2.000,
    26550.000,
    48273.000,
    4827.000,
    10.000,
    '1'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    16,
    2,
    2,
    1.000,
    65400.000,
    59455.000,
    5945.000,
    10.000,
    '2'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    16,
    3,
    3,
    1.000,
    52320.000,
    47564.000,
    4756.000,
    10.000,
    '3'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    16,
    4,
    4,
    1.000,
    60420.000,
    54927.000,
    5493.000,
    10.000,
    '4'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    17,
    1,
    40,
    1.000,
    63080.000,
    57345.000,
    5735.000,
    10.000,
    '40'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    17,
    2,
    39,
    2.000,
    43320.000,
    78764.000,
    7876.000,
    10.000,
    '39'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    17,
    3,
    38,
    1.000,
    49510.000,
    45009.000,
    4501.000,
    10.000,
    '38'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    18,
    1,
    1,
    5.000,
    26550.000,
    120682.000,
    12068.000,
    10.000,
    '1'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    18,
    2,
    2,
    6.000,
    65400.000,
    356727.000,
    35673.000,
    10.000,
    '2'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    18,
    3,
    3,
    5.000,
    52320.000,
    237818.000,
    23782.000,
    10.000,
    '3'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    19,
    1,
    5,
    6.000,
    45140.000,
    246218.000,
    24622.000,
    10.000,
    '5'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    19,
    2,
    15,
    2.000,
    26490.000,
    48164.000,
    4816.000,
    10.000,
    '15'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    19,
    3,
    7,
    6.000,
    56770.000,
    309655.000,
    30965.000,
    10.000,
    '7'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    20,
    1,
    1,
    8.000,
    26550.000,
    193091.000,
    19309.000,
    10.000,
    '1'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    20,
    2,
    9,
    3.000,
    57360.000,
    156436.000,
    15644.000,
    10.000,
    '9'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    20,
    3,
    13,
    1.000,
    81630.000,
    74209.000,
    7421.000,
    10.000,
    '13'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    20,
    4,
    47,
    5.000,
    40610.000,
    184591.000,
    18459.000,
    10.000,
    '47'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    20,
    5,
    25,
    5.000,
    87880.000,
    399455.000,
    39945.000,
    10.000,
    '25'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    21,
    1,
    1,
    5.000,
    26550.000,
    120682.000,
    12068.000,
    10.000,
    '1'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    22,
    1,
    5,
    1.000,
    45140.000,
    41036.000,
    4104.000,
    10.000,
    '5'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    22,
    2,
    6,
    1.000,
    39440.000,
    35855.000,
    3585.000,
    10.000,
    '6'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    23,
    1,
    1,
    5.000,
    26550.000,
    120682.000,
    12068.000,
    10.000,
    '1'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    23,
    2,
    2,
    5.000,
    65400.000,
    297273.000,
    29727.000,
    10.000,
    '2'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    23,
    3,
    3,
    5.000,
    52320.000,
    237818.000,
    23782.000,
    10.000,
    '3'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    23,
    4,
    4,
    4.000,
    60420.000,
    219709.000,
    21971.000,
    10.000,
    '4'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    23,
    5,
    8,
    9.000,
    65530.000,
    536155.000,
    53615.000,
    10.000,
    '8'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    24,
    1,
    1,
    5.000,
    26550.000,
    120682.000,
    12068.000,
    10.000,
    '1'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    24,
    2,
    3,
    7.000,
    52320.000,
    332945.000,
    33295.000,
    10.000,
    '3'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    24,
    3,
    9,
    6.000,
    57360.000,
    312873.000,
    31287.000,
    10.000,
    '9'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    24,
    4,
    8,
    5.000,
    65530.000,
    297864.000,
    29786.000,
    10.000,
    '8'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    24,
    5,
    15,
    4.000,
    26490.000,
    96327.000,
    9633.000,
    10.000,
    '15'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    24,
    6,
    12,
    8.000,
    33630.000,
    244582.000,
    24458.000,
    10.000,
    '12'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    24,
    7,
    19,
    8.000,
    71120.000,
    517236.000,
    51724.000,
    10.000,
    '19'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    24,
    8,
    27,
    4.000,
    90070.000,
    327527.000,
    32753.000,
    10.000,
    '27'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    24,
    9,
    21,
    6.000,
    88370.000,
    482018.000,
    48202.000,
    10.000,
    '21'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    25,
    1,
    1,
    2.000,
    26550.000,
    48273.000,
    4827.000,
    10.000,
    '1'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    25,
    2,
    2,
    8.000,
    65400.000,
    475636.000,
    47564.000,
    10.000,
    '2'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    25,
    3,
    8,
    10.000,
    65530.000,
    595727.000,
    59573.000,
    10.000,
    '8'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    25,
    4,
    50,
    1.000,
    26310.000,
    23918.000,
    2392.000,
    10.000,
    '50'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    26,
    1,
    43,
    5.000,
    47940.000,
    217909.000,
    21791.000,
    10.000,
    'MARC001'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    26,
    2,
    17,
    1.000,
    8660.000,
    7873.000,
    787.000,
    10.000,
    'CLAV001'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    26,
    3,
    31,
    7.000,
    7360.000,
    46836.000,
    4684.000,
    10.000,
    'CINT002'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    26,
    4,
    38,
    3.000,
    49510.000,
    135027.000,
    13503.000,
    10.000,
    'DEST003'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    26,
    5,
    8,
    8.000,
    65530.000,
    476582.000,
    47658.000,
    10.000,
    'CINT001'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    26,
    6,
    29,
    2.000,
    20420.000,
    37127.000,
    3713.000,
    10.000,
    'FUNT001'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    26,
    7,
    9,
    1.000,
    57360.000,
    52145.000,
    5215.000,
    10.000,
    'NIVE001'
  );
INSERT INTO
  `pedido_venta_detalle` (
    `pedido_venta_id`,
    `item_numero`,
    `articulo_id`,
    `cantidad`,
    `precio`,
    `monto_neto`,
    `monto_iva`,
    `porcentaje_iva`,
    `referencia`
  )
VALUES
  (
    26,
    8,
    4,
    5.000,
    60420.000,
    274636.000,
    27464.000,
    10.000,
    'SIEC001'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: rol
# ------------------------------------------------------------

INSERT INTO
  `rol` (`rol_id`, `descripcion`)
VALUES
  (1, 'Administrador General');
INSERT INTO
  `rol` (`rol_id`, `descripcion`)
VALUES
  (2, 'Contabilidad');
INSERT INTO
  `rol` (`rol_id`, `descripcion`)
VALUES
  (3, 'Recursos Humanos');
INSERT INTO
  `rol` (`rol_id`, `descripcion`)
VALUES
  (4, 'Acopio');
INSERT INTO
  `rol` (`rol_id`, `descripcion`)
VALUES
  (5, 'Vendedor/a');
INSERT INTO
  `rol` (`rol_id`, `descripcion`)
VALUES
  (6, 'Basculero/a');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: tipo_programa
# ------------------------------------------------------------

INSERT INTO
  `tipo_programa` (`tipo_programa_id`, `descripcion`)
VALUES
  (1, 'Mantenimientos');
INSERT INTO
  `tipo_programa` (`tipo_programa_id`, `descripcion`)
VALUES
  (2, 'Movimientos');
INSERT INTO
  `tipo_programa` (`tipo_programa_id`, `descripcion`)
VALUES
  (3, 'Consultas');
INSERT INTO
  `tipo_programa` (`tipo_programa_id`, `descripcion`)
VALUES
  (4, 'Listados');
INSERT INTO
  `tipo_programa` (`tipo_programa_id`, `descripcion`)
VALUES
  (5, 'Procesos');
INSERT INTO
  `tipo_programa` (`tipo_programa_id`, `descripcion`)
VALUES
  (6, 'Esporádicos');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: unidad_medida
# ------------------------------------------------------------

INSERT INTO
  `unidad_medida` (`unidad_medida_id`, `descripcion`, `abreviacion`)
VALUES
  (1, 'Unidad', 'Un');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: usuario
# ------------------------------------------------------------

INSERT INTO
  `usuario` (
    `usuario_id`,
    `alias`,
    `clave`,
    `nombre`,
    `apellido`,
    `email`,
    `cedula_identidad`,
    `fecha_registro`,
    `fecha_actualizacion`,
    `estado`
  )
VALUES
  (
    1,
    'Admin',
    '$2b$10$ysqi3MXVmfqewTvWrocDW.GmSrQnkb4uKibqXvfoWpSpYKZjZbqEa',
    'Administrador',
    'Sistema',
    'admin@mail.com',
    '',
    '2023-09-01 13:25:41',
    '2023-09-05 11:57:45',
    1
  );

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;