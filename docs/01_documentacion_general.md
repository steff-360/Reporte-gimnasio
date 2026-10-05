# Documento general

## Problema y objetivo
La información de clientes, planes, contratos y finanzas puede estar dispersa y ser difícil de consultar. El objetivo es centralizar esa gestión en una aplicación CLI de Node.js con persistencia relacional.

## Estado actual
La versión disponible implementa acceso por rol, gestión básica de clientes y planes, asignación/renovación/finalización/cancelación de contratos, seguimiento asociado a contratos, planes nutricionales y alimentos, y consultas financieras con filtros básicos. Persisten brechas: falta almacenamiento real de fotos, edición/desactivación de planes nutricionales, pagos automatizados y pruebas de integración con MySQL. El detalle está en `README.md` y `02_requisitos.md`.

## Tecnologías y decisión de base de datos
Node.js con módulos ES, MySQL y `mysql2/promise`, Inquirer, Chalk y bcryptjs. No se usa MongoDB, Mongoose ni dotenv. MySQL fue seleccionado en la implementación, aunque el enunciado original exige MongoDB con el driver oficial `mongodb`; esta desviación requiere aprobación del docente y puede afectar la calificación.

## Actores considerados
- Administrador: acceso a gestión general y finanzas según el menú actual.
- Entrenador: acceso a las opciones no financieras disponibles.
- Cliente: no cuenta con inicio de sesión en esta versión.

## Fuera de alcance actual
Aplicación web/móvil, pagos bancarios e inicio de sesión de clientes. 
