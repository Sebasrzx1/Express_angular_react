-- =================================
-- CONFIGURACION INICIAL
-- =================================

CREATE DATABASE IF NOT EXISTS landing
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE landing;

-- ========================================================
-- NIVEL 1: SISTEMA DE USUARIOS Y ROLES (Base existente)
-- ========================================================

CREATE TABLE roles (
	id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50)
);

CREATE TABLE permiso (
	id_permiso INT AUTO_INCREMENT PRIMARY KEY,
    nombre varchar(50),
    descripcoin TEXT
);

CREATE TABLE rol_permiso (
	id_rol_permiso INT AUTO_INCREMENT PRIMARY KEY,
    id_rol INT,
    id_permiso INT,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE CASCADE,
    FOREIGN KEY (id_permiso) REFERENCES permiso(id_permiso) ON DELETE CASCADE
);

CREATE TABLE usuarios(
	id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    tipo_identificacion enum ("CC","TI","NIT","PASPORTE","CE"),
    nuip varchar(20),
    nombre varchar(30),
    email varchar(200) UNIQUE, -- Integrado por seguridad
    clave varchar(100),
    telefono varchar(20),
    direccion varchar (100),
    fecha_egistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_rol INT,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

CREATE TABLE negocio(
	id_negocio INT PRIMARY KEY AUTO_INCREMENT,
	razon_social varchar(200),
    logo_url varchar(300),
    descripcion text,
    telefono varchar (10),
    email varchar (200),
    direccion varchar(200),
    redes_sociales JSON, -- MEJORA: JSON es mejor para guardar {fb: url, ig: url}
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 1. Roles
INSERT INTO roles (nombre) VALUES ('Administrador'),('Empleado'),('Cliente');

--2. Permisos 
INSERT INTO permisos (nombre, descripcion) VALUES
('Crear','Permite crear nuevos registros'),
('Leer','Permite visualizar registros'),
('Actualizar','Permite modificar registros existentes'),
('Eliminar','Permite eliminar registros');

--3. Asignacion Permisos (admin)
INSERT INTO rol_permiso(id_rol, id_permiso) VALUES (1,1),(1,2),(1,3),(1,4)

-- Asignacion Permisos (Empleado/Cliente)
INSERT INTO rol_permiso (id_rol,id_permiso) VALUES (2,2),(3,2) 

-- 4. Usuarios
--Admin (Pass: 1)
INSERT INTO usuarios (nombre, email, clave, id_rol) VALUE ('admin', 'sramirezcarlosama@gmail.com', '$2b$10$wLyuMd5mP.D5YekcUa2uSOQIRXvXFyKmpz3go/ryHgHUl1hTtioa6',1)
--Empleado/Cliente (Pass: 1)
INSERT INTO usuarios (nombre, email, clave, id_rol) VALUE ('Empleado', 'samuel@gmail.com', '$2b$10$wLyuMd5mP.D5YekcUa2uSOQIRXvXFyKmpz3go/ryHgHUl1hTtioa6',2)
