# Requisitos y estado de cobertura

Estados: **Implementado**, **Implementado**, **Pendiente**. La presencia de una tabla SQL no significa que exista una funcionalidad de aplicación.

## Funcionales

| ID | Requisito | Estado | Evidencia o brecha |
|---|---|---|---|
| RF01-RF03 | Login, rol y cierre de sesión | Implementado | Login bcrypt y cambio/salida de sesión disponibles; no hay gestión de sesiones persistente. |
| RF04-RF05 | Alta/modificación/desactivación de usuarios por admin | Pendiente | Solo existe búsqueda de usuario para login. |
| RF06-RF08 | Registrar, listar y buscar clientes | Implementado | Servicio, repositorio y opciones CLI. |
| RF09-RF10 | Modificar y desactivar clientes | Implementado | Métodos de servicio/repositorio y opciones de CLI; desactivación lógica. |
| RF11-RF12 | Crear y listar planes | Implementado | Servicio, repositorio y CLI. |
| RF13-RF14 | Modificar y desactivar planes | Implementado | Servicio, repositorio y CLI; desactivación lógica. |
| RF15-RF17 | Crear/listar/consultar contratos por cliente | Implementado | Asignar plan crea contrato automáticamente y se listan contratos; consulta dedicada por cliente pendiente. |
| RF18-RF20 | Cancelar/cambiar estado de contrato con transacción | Implementado | Cancelar elimina progreso asociado y actualiza estado atómicamente; renovar/finalizar implementados; falta edición/cambio de estados más completo. |
| RF21-RF24 | Registrar y consultar progreso semanal cronológico | Implementado | Alta limitada a un registro por semana y contrato, listado cronológico y eliminación. |
| RF25-RF29 | Planes nutricionales, alimentos y consulta semanal | Implementado | Alta/listado de planes, alta/listado de alimentos y resumen por día semanal; faltan modificar/desactivar planes nutricionales. |
| RF30-RF31 | Registrar ingresos y egresos | Implementado | Registro disponible en CLI; asociación automatizada mensualidad/sesión pendiente. |
| RF32-RF34 | Consultar/separar movimientos y balance por fecha o cliente | Implementado | CLI y consulta filtran por fechas/cliente; el tipo se conserva en cada fila y se calcula el balance del resultado. |
| RF35-RF37 | Validar entradas, obligatorios, formatos y rangos | Implementado | Modelos y Factory validan campos/fechas; contratos y finanzas validan fechas estrictas y rangos, pero faltan reglas exhaustivas en todos los formularios CLI. |
| RF38-RF39 | Permisos y mensajes claros | Implementado | Menú filtra opciones; servicios también exigen ADMIN para operaciones financieras y cambios de estado contractual. Faltan pruebas de todos los permisos y otras operaciones administrativas. |

## No funcionales

| ID | Requisito | Estado | Evidencia o brecha |
|---|---|---|---|
| RNF01 | Hash de contraseñas | Implementado | bcryptjs en login; seed de demostración contiene hash bcrypt. |
| RNF02 | Integridad, FK y transacciones | Implementado | FK/checks en SQL; transacciones explícitas en asignación/renovación/cancelación de contratos, progreso, nutrición y finanzas. Falta validación de integración real con MySQL. |
| RNF03-RNF04 | Modularidad y separación de capas | Implementado | CLI → services → repositories → MySQL, con entidades en `domain/`; algunas responsabilidades continúan concentradas en `app.js`. |
| RNF05 | Variables de entorno sin dotenv | Implementado | Pool lee `DB_*` de `process.env`; no se carga `.env`. |
| RNF06-RNF08 | Usabilidad, validación y rollback | Implementado | Menú Inquirer, validaciones y rollback en operaciones transaccionales implementadas; falta ampliar cobertura funcional. |
| RNF09 | Persistencia requerida | Desviación | Usa MySQL/mysql2. El requisito académico original solicita MongoDB/driver `mongodb`; se requiere aprobación docente. |
| RNF10 | Pruebas automatizadas | Implementado | 32 pruebas unitarias pasan en la revisión actual; falta integración con MySQL. |

## Requisitos de organización y entrega

- **Estructura:** hay `src/models`, `domain`, `services`, `repositories`, `config`; faltan `/commands` y `/utils` si se interpretan como carpetas obligatorias.
- **Documentación:** README y documentos Markdown disponibles; planeación Scrum en `05_scrum.md`; tablero GitHub Projects v2 creado y público en [github.com/users/steff-360/projects/2](https://github.com/users/steff-360/projects/2) con 25 historias vinculadas. Las ceremonias se registrarán conforme ocurran.

