# Modelo de datos
## Diagrama relacional

![Diagrama del modelo relacional MySQL](diagramas/modelo-relacional.svg)

Tablas: usuarios, clientes, planes, contratos, progresos, planes_nutricionales, alimentos, movimientos.
Relaciones: clientes 1:N contratos; planes 1:N contratos; contratos 1:N progresos; clientes 1:N progresos; clientes 1:N planes_nutricionales; planes 1:N planes_nutricionales; planes_nutricionales 1:N alimentos; clientes y contratos pueden asociarse a movimientos; usuarios registran progresos y movimientos.
No se agrega cliente_planes porque contratos ya representa la contratación del plan. Contratos conserva precio_acordado y duracion_dias como fotografía histórica de lo pactado, aunque cambie el catálogo.
**1FN:** valores atómicos y alimentos en filas separadas. **2FN:** atributos dependen de la clave de su entidad. **3FN:** los datos de clientes, planes y usuarios permanecen en sus tablas; contrato guarda claves y términos propios.
El SQL para instalaciones nuevas está en `database/01_schema.sql`. `database/03_seguimiento_nutricion.sql` agrega los vínculos y referencia de foto para bases previas. En migraciones antiguas los campos se agregan inicialmente como nullable para permitir asignación manual de registros existentes; antes de imponer `NOT NULL`, completar sus claves foráneas de negocio.
