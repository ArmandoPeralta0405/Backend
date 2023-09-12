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
) ENGINE = InnoDB AUTO_INCREMENT = 7 DEFAULT CHARSET = utf8mb4 COMMENT = 'Tabla que almacena información sobre artículos en el sistema';

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = 'Tabla que almacena información sobre clientes en el sistema';

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
  PRIMARY KEY (`impuesto_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COMMENT = 'Tabla que almacena información sobre impuestos en el sistema';

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
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COMMENT = 'Tabla que almacena información sobre marcas en el sistema';

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
  PRIMARY KEY (`moneda_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COMMENT = 'Tabla que almacena información sobre monedas en el sistema';

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
  (
    1,
    'Papel Higiénico Cacia 4 Rollos de 30 metros',
    '7840173030014',
    1,
    3,
    1,
    1
  );
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
  (
    2,
    'Coca Cola Sabor Original 2 Litros',
    '7840058008084',
    2,
    3,
    1,
    1
  );
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
  (
    3,
    'Jabón de Olor Mar Sweet Temptation 90g',
    '7840010038012',
    3,
    3,
    1,
    1
  );
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
  (
    4,
    'Jabón Agricultor 150g',
    '7840118221286',
    4,
    3,
    1,
    1
  );
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
  (
    5,
    'Esponja multiusos Esponflora 110MM x 75MM x 20MM',
    '7908099200161',
    5,
    3,
    1,
    1
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: articulo_lista_precio
# ------------------------------------------------------------

INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (1, 1, 8500.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (1, 2, 1.254);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (2, 1, 12500.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (2, 2, 1.990);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (3, 1, 4500.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (3, 2, 0.750);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (4, 1, 8500.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (4, 2, 1.200);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (5, 1, 3500.000);
INSERT INTO
  `articulo_lista_precio` (`articulo_id`, `lista_precio_id`, `precio`)
VALUES
  (5, 2, 0.250);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: cliente
# ------------------------------------------------------------


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
  `impuesto` (`impuesto_id`, `descripcion`, `valor`)
VALUES
  (1, 'Iva Exento', 0.000);
INSERT INTO
  `impuesto` (`impuesto_id`, `descripcion`, `valor`)
VALUES
  (2, 'Iva 5%', 21.000);
INSERT INTO
  `impuesto` (`impuesto_id`, `descripcion`, `valor`)
VALUES
  (3, 'Iva 10%', 11.000);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: lista_precio
# ------------------------------------------------------------

INSERT INTO
  `lista_precio` (`lista_precio_id`, `descripcion`, `moneda_id`)
VALUES
  (1, 'Precios en Guaranies', 1);
INSERT INTO
  `lista_precio` (`lista_precio_id`, `descripcion`, `moneda_id`)
VALUES
  (2, 'Precios en Dolares', 2);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: marca
# ------------------------------------------------------------

INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (1, 'Cacia');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (2, 'Coca Cola');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (3, 'Mar');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (4, 'Agricultor');
INSERT INTO
  `marca` (`marca_id`, `descripcion`)
VALUES
  (5, 'Esponflora');

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
  `moneda` (`moneda_id`, `descripcion`, `abreviacion`)
VALUES
  (1, 'Guaranies', 'Gs');
INSERT INTO
  `moneda` (`moneda_id`, `descripcion`, `abreviacion`)
VALUES
  (2, 'Dolares', 'Us');
INSERT INTO
  `moneda` (`moneda_id`, `descripcion`, `abreviacion`)
VALUES
  (3, 'Real', 'Rl');
INSERT INTO
  `moneda` (`moneda_id`, `descripcion`, `abreviacion`)
VALUES
  (4, 'Peso Argentino', 'Pz A');
INSERT INTO
  `moneda` (`moneda_id`, `descripcion`, `abreviacion`)
VALUES
  (5, 'Peso Uruguayo', 'Ps U');

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
