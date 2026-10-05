USE gestion_gimnasio;

ALTER TABLE progresos
 ADD COLUMN contrato_id INT NULL AFTER id,
 ADD COLUMN foto_url VARCHAR(500) NULL AFTER pierna_cm;

ALTER TABLE progresos
 ADD CONSTRAINT fk_progresos_contrato FOREIGN KEY (contrato_id) REFERENCES contratos(id);

CREATE INDEX idx_progresos_contrato_fecha ON progresos(contrato_id,fecha);

ALTER TABLE planes_nutricionales
 ADD COLUMN plan_id INT NULL AFTER cliente_id;

ALTER TABLE planes_nutricionales
 ADD CONSTRAINT fk_planes_nutricionales_plan FOREIGN KEY (plan_id) REFERENCES planes(id);

-- Tras asociar los registros históricos con contratos y planes válidos, cambia
-- ambas columnas a NOT NULL para imponer la relación en instalaciones existentes.