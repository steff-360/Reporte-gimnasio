USE gestion_gimnasio;
-- Hash bcrypt de prueba para 123456. Si el login falla, crea otro hash con bcryptjs.
INSERT INTO usuarios(nombre,correo,password_hash,rol) VALUES
('Administrador','admin@gym.com','$2a$10$v4zh5Wh5DBFq1/97nNtcc.g1qCjOVhtZdiCQf.XWZShkWPy.v1gjO','ADMIN'),
('Entrenador','entrenador@gym.com','$2a$10$v4zh5Wh5DBFq1/97nNtcc.g1qCjOVhtZdiCQf.XWZShkWPy.v1gjO','ENTRENADOR')
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash),rol=VALUES(rol),activo=TRUE;
INSERT INTO planes(nombre,descripcion,duracion_dias,nivel,meta,precio) VALUES
('Acondicionamiento básico','Plan general',30,'PRINCIPIANTE','Mejorar condición física',350.00),
('Fuerza intermedia','Desarrollo de fuerza',30,'INTERMEDIO','Desarrollar fuerza',450.00);
