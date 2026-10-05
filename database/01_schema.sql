CREATE DATABASE IF NOT EXISTS gestion_gimnasio 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE gestion_gimnasio;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('ADMIN', 'ENTRENADOR') NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE,
    telefono VARCHAR(30),
    edad TINYINT UNSIGNED,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_registro DATE NOT NULL DEFAULT (CURRENT_DATE),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de planes
CREATE TABLE planes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    descripcion TEXT,
    duracion_dias SMALLINT UNSIGNED NOT NULL,
    nivel ENUM('PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO') NOT NULL,
    meta VARCHAR(180) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    CHECK (duracion_dias > 0),
    CHECK (precio >= 0)
);

-- Tabla de contratos
CREATE TABLE contratos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    plan_id INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    precio_acordado DECIMAL(10,2) NOT NULL,
    duracion_dias SMALLINT UNSIGNED NOT NULL,
    estado ENUM('ACTIVO', 'CANCELADO', 'FINALIZADO') NOT NULL DEFAULT 'ACTIVO',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (plan_id) REFERENCES planes(id),
    CHECK (fecha_fin >= fecha_inicio),
    CHECK (precio_acordado >= 0),
    CHECK (duracion_dias > 0)
);

-- Tabla de progresos
CREATE TABLE progresos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contrato_id INT NOT NULL,
    cliente_id INT NOT NULL,
    fecha DATE NOT NULL,
    peso_kg DECIMAL(5,2) NOT NULL,
    grasa_corporal DECIMAL(5,2),
    cintura_cm DECIMAL(5,2),
    brazo_cm DECIMAL(5,2),
    pierna_cm DECIMAL(5,2),
    foto_url VARCHAR(500),
    comentarios VARCHAR(500),
    creado_por INT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contrato_id) REFERENCES contratos(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (creado_por) REFERENCES usuarios(id),
    CHECK (peso_kg > 0),
    CHECK (grasa_corporal IS NULL OR grasa_corporal BETWEEN 0 AND 100)
);

-- Tabla de planes nutricionales
CREATE TABLE planes_nutricionales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    plan_id INT NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    objetivo VARCHAR(180),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_por INT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (plan_id) REFERENCES planes(id),
    FOREIGN KEY (creado_por) REFERENCES usuarios(id),
    CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
);

-- Tabla de alimentos
CREATE TABLE alimentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_nutricional_id INT NOT NULL,
    dia_semana ENUM('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO') NOT NULL,
    tiempo_comida ENUM('DESAYUNO', 'ALMUERZO', 'CENA', 'MERIENDA') NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    porcion VARCHAR(100),
    calorias DECIMAL(7,2),
    FOREIGN KEY (plan_nutricional_id) REFERENCES planes_nutricionales(id) ON DELETE CASCADE,
    CHECK (calorias IS NULL OR calorias >= 0)
);

-- Tabla de movimientos
CREATE TABLE movimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NULL,
    contrato_id INT NULL,
    tipo ENUM('INGRESO', 'EGRESO') NOT NULL,
    concepto VARCHAR(180) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha DATE NOT NULL,
    creado_por INT NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (contrato_id) REFERENCES contratos(id),
    FOREIGN KEY (creado_por) REFERENCES usuarios(id),
    CHECK (monto > 0)
);

-- Índices
CREATE INDEX idx_contratos_cliente ON contratos(cliente_id);
CREATE INDEX idx_progresos_cliente_fecha ON progresos(cliente_id, fecha);
CREATE INDEX idx_progresos_contrato_fecha ON progresos(contrato_id, fecha);
CREATE INDEX idx_movimientos_fecha_tipo ON movimientos(fecha, tipo);