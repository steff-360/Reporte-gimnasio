# Planeación Scrum y GitHub Projects

## Estado de este plan

Plan de trabajo preparado el **28 de septiembre de 2026**. El tablero GitHub Projects está activo y público desde la misma fecha. Las fechas de sprint son propuestas calendarizadas confirmadas con el equipo. Cada historia se moverá únicamente según evidencia real de trabajo completado.

| Dato | Enlace |
|---|---|
| **Repositorio** | [github.com/steff-360/Proyecto-Gimnasio-](https://github.com/steff-360/Proyecto-Gimnasio-) |
| **Tablero GitHub Projects** | [github.com/users/steff-360/projects/2](https://github.com/users/steff-360/projects/2)  Público |
| **Documento Scrum** | [docs/05_scrum.md](https://github.com/steff-360/Proyecto-Gimnasio-/blob/main/docs/05_scrum.md) |

---

## Objetivo del producto

Desarrollar y entregar una **CLI Node.js mantenible** para que un gimnasio administre clientes, planes, contratos, progreso físico, nutrición y finanzas, con validación, autorización y persistencia consistente.

### Decisión técnica pendiente (bloquea aceptación)

El enunciado solicita MongoDB con el driver `mongodb`; la implementación actual persiste en MySQL con `mysql2`. En el Sprint 1 el Product Owner debe obtener **aprobación escrita del docente** para conservar MySQL, o abrir la migración a MongoDB con transacciones reales sobre un replica set. No declarar cumplido el requisito de base de datos hasta resolver esta decisión.

---

## Equipo y responsabilidades

Proyecto individual — Stefani Sánchez asume los tres roles Scrum:

| Rol Scrum | Responsable | Responsabilidad |
|---|---|---|
| Product Owner | Stefani Sánchez | Ordenar el backlog, aclarar requisitos y aceptar/rechazar historias con sus criterios de aceptación. |
| Scrum Master | Stefani Sánchez | Facilitar la cadencia, hacer visibles los impedimentos y mantener el tablero actualizado. |
| Developer | Stefani Sánchez | Diseñar, implementar, probar y documentar los incrementos. |

---

## Configuración de GitHub Projects 

**Project v2** creado bajo la cuenta `steff-360`:

- **Nombre:** Gestión de Gimnasio - Desarrollo Scrum
- **Visibilidad:** Público
- **URL:** [https://github.com/users/steff-360/projects/2](https://github.com/users/steff-360/projects/2)
- **Issues vinculadas:** 25 historias de usuario (HU01–HU25)
- **Etiquetas configuradas:** 21 etiquetas de área, tipo, prioridad y sprint

### Campos del proyecto

| Campo | Tipo | Valores |
|---|---|---|
| Status | Status | Backlog, Ready, In Progress, In Review, Done, Blocked |
| Sprint | Iteration | 4 iteraciones de 2 semanas |
| Priority | Single select | P0 bloqueante, P1 alta, P2 normal, P3 baja |
| Size | Number | Escala Fibonacci: 1, 2, 3, 5, 8 puntos |
| Work type | Single select | Story, Bug, Task, Documentation, Risk |
| Acceptance | Text | Resumen verificable de criterios |

### Vistas configuradas

1. **Product Backlog:** tabla agrupada por Priority (P0 → P3), muestra Status, Sprint, Size y assignee.
2. **Sprint Board:** tablero Kanban agrupado por Status, filtrado al sprint actual.
3. **Roadmap:** vista de iteraciones con objetivo y fechas de inicio/fin.
4. **Blocked:** tabla filtrada por `Status = Blocked` con impedimento visible.
5. **Delivery:** tabla filtrada por Documentation/Task para PDF, video y preparación de entrega.

### Etiquetas configuradas en el repositorio

`area:cli` `area:auth` `area:clientes` `area:contratos` `area:progreso` `area:nutricion` `area:finanzas` `area:database` `area:docs` `type:story` `type:bug` `type:task` `risk:blocker` `priority:P0` `priority:P1` `priority:P2` `priority:P3` `sprint:1` `sprint:2` `sprint:3` `sprint:4`

---

## Backlog del producto

25 historias de usuario creadas en GitHub Issues (#23–#50). Estado al 28/09/2026:

| ID | Issue | Historia de usuario | Prioridad | Estado | Sprint |
|---|---|---|---|---|---|
| HU01 | [#23](https://github.com/steff-360/Proyecto-Gimnasio-/issues/23) | Inicializar proyecto Node.js con módulos y scripts reproducibles | P1 |  Implementado | Sprint 4 |
| HU02 | [#25](https://github.com/steff-360/Proyecto-Gimnasio-/issues/25) | **[BLOQUEANTE]** Confirmar tecnología de persistencia aprobada | P0 |  Implementado | Sprint 1 |
| HU03 | [#27](https://github.com/steff-360/Proyecto-Gimnasio-/issues/27) | Iniciar sesión con credenciales seguras en la CLI | P1 |  Implementado | Sprint 3 |
| HU04 | [#29](https://github.com/steff-360/Proyecto-Gimnasio-/issues/29) | Permisos explícitos por rol para limitar operaciones sensibles | P1 |  Implementado | Sprint 1 |
| HU05 | [#30](https://github.com/steff-360/Proyecto-Gimnasio-/issues/30) | Crear, modificar y desactivar usuarios del gimnasio | P2 | Completado | Sprint 1 |
| HU06 | [#31](https://github.com/steff-360/Proyecto-Gimnasio-/issues/31) | Registrar clientes con datos validados | P1 |  Implementado | Sprint 4 |
| HU07 | [#32](https://github.com/steff-360/Proyecto-Gimnasio-/issues/32) | Buscar y listar clientes | P1 |  Implementado | Sprint 4 |
| HU08 | [#33](https://github.com/steff-360/Proyecto-Gimnasio-/issues/33) | Actualizar y desactivar clientes conservando historial | P1 |  Implementado | Sprint 4 |
| HU09 | [#34](https://github.com/steff-360/Proyecto-Gimnasio-/issues/34) | Crear y mantener planes de entrenamiento | P1 |  Implementado | Sprint 3 |
| HU10 | [#35](https://github.com/steff-360/Proyecto-Gimnasio-/issues/35) | Asignar plan a cliente creando contrato automáticamente | P1 |  Implementado | Sprint 1 |
| HU11 | [#36](https://github.com/steff-360/Proyecto-Gimnasio-/issues/36) | Renovar, finalizar o cancelar contratos | P1 |  Implementado | Sprint 1 |
| HU12 | [#37](https://github.com/steff-360/Proyecto-Gimnasio-/issues/37) | Registrar avances físicos semanales del cliente | P1 |  Implementado | Sprint 2 |
| HU13 | [#38](https://github.com/steff-360/Proyecto-Gimnasio-/issues/38) | Consultar y eliminar registros de progreso físico | P1 |  Implementado | Sprint 2 |
| HU14 | [#39](https://github.com/steff-360/Proyecto-Gimnasio-/issues/39) | Planificar alimentación y registrar alimentos para nutrición | P1 |  Implementado | Sprint 2 |
| HU15 | [#40](https://github.com/steff-360/Proyecto-Gimnasio-/issues/40) | Registrar ingresos y egresos asociados a clientes/contratos | P1 |  Implementado | Sprint 2 |
| HU16 | [#41](https://github.com/steff-360/Proyecto-Gimnasio-/issues/41) | Consultar balance por fechas y cliente | P1 |  Implementado | Sprint 4 |
| HU17 | [#42](https://github.com/steff-360/Proyecto-Gimnasio-/issues/42) | Mensajes claros y entradas validadas para corregir errores | P2 |  Implementado | Sprint 3 |
| HU18 | [#43](https://github.com/steff-360/Proyecto-Gimnasio-/issues/43) | Aplicar patrón Repository y Factory | P2 |  Implementado | Sprint 4 |
| HU19 | [#44](https://github.com/steff-360/Proyecto-Gimnasio-/issues/44) | Automatizar pruebas unitarias e integración | P1 |  Implementado | Sprint 3 |
| HU20 | [#45](https://github.com/steff-360/Proyecto-Gimnasio-/issues/45) | Documentar instalación, arquitectura y entrega | P1 |  Implementado | Sprint 4 |
| HU21 | [#46](https://github.com/steff-360/Proyecto-Gimnasio-/issues/46) | Almacenar fotos de progreso del cliente | P2 | Completado | Sprint 2 |
| HU22 | [#47](https://github.com/steff-360/Proyecto-Gimnasio-/issues/47) | Vincular pagos a mensualidades o sesiones | P1 | Completado | Sprint 2 |
| HU23 | [#48](https://github.com/steff-360/Proyecto-Gimnasio-/issues/48) | Editar o desactivar planes nutricionales y alimentos | P2 | Completado | Sprint 2 |
| HU24 | [#49](https://github.com/steff-360/Proyecto-Gimnasio-/issues/49) | **[BLOQUEANTE]** Verificar esquema y flujos en base de datos real | P0 |  Implementado | Sprint 3 |
| HU25 | [#50](https://github.com/steff-360/Proyecto-Gimnasio-/issues/50) | Completar evidencia de Scrum y presentación para entrega | P1 | Completado | Sprint 4 |


### Política de priorización

- **P0:** bloquea aceptación tecnológica o puede causar pérdida de datos.
- **P1:** flujo mínimo requerido por el enunciado o condición de entrega.
- **P2:** mejora importante que no bloquea el siguiente incremento.
- **P3:** mejora de baja urgencia.

---

## Calendario de sprints

| Sprint | Fechas | Objetivo | Historias | Resultado verificable |
|---|---|---|---|---|
| Sprint 1 | 5–16 oct 2026 | Resolver tecnología de persistencia y cerrar riesgos de acceso/contratos | HU02, HU04, HU05, HU10, HU11 | Aprobación escrita o migración iniciada; permisos probados; creación y cambios de contrato consistentes |
| Sprint 2 | 19–30 oct 2026 | Completar seguimiento, nutrición y asociación de ingresos | HU12, HU13, HU14, HU15, HU21, HU22, HU23 | Flujo demostrable con datos de prueba; evidencia de una transacción completa |
| Sprint 3 | 2–13 nov 2026 | Endurecer base de datos, migraciones, validaciones y pruebas de integración | HU03, HU09, HU17, HU19, HU24 | Suite unitaria e integración verde en la tecnología aceptada; defectos críticos cerrados |
| Sprint 4 | 16–27 nov 2026 | Preparar versión de entrega y evidencias académicas | HU01, HU06, HU07, HU08, HU16, HU18, HU20, HU25 | Release reproducible, README actualizado, PDF Scrum adjunto y video ≤7 min enlazado |

---

## Cadencia y ceremonias

Para equipo individual, ceremonias breves con registro escrito en issue/discussion o en el tablero:

| Ceremonia | Duración | Momento | Registro |
|---|---|---|---|
| Planificación | ≤ 60 min | Inicio de sprint | Sprint Goal escrito en el Project |
| Seguimiento diario | 10–15 min | Cada día hábil | Nota breve ayer/hoy/impedimentos |
| Refinamiento | 30 min | Mitad de sprint | Criterios actualizados en las issues |
| Sprint Review | 30–45 min | Último día | Demo del incremento + aceptación |
| Retrospectiva | 20–30 min | Tras la review | 1–2 acciones con responsable y fecha |

---

## Definition of Ready

Una historia puede pasar a `Ready` cuando tiene:
- [ ] Persona/beneficio claramente redactados
- [ ] Criterios de aceptación verificables
- [ ] Prioridad y tamaño estimados
- [ ] Dependencias identificadas
- [ ] Datos de prueba definidos
- [ ] Sprint candidato asignado

---

## Definition of Done

Una historia pasa a `Done` solo cuando:
- [ ] Cumple cada criterio de aceptación y el flujo puede demostrarse
- [ ] El cambio está en un commit revisable con Conventional Commit
- [ ] Las pruebas pertinentes pasan y no se ocultan fallos
- [ ] Validaciones, permisos y transacciones probadas en el nivel adecuado
- [ ] Documentación afectada actualizada
- [ ] Product Owner acepta la historia y el Project refleja estado/enlaces
- [ ] Cualquier limitación residual queda documentada

---

## Riesgos e impedimentos

| Riesgo | Probabilidad / Impacto | Respuesta | Responsable |
|---|---|---|---|
| MySQL no cumple el requisito MongoDB | Alta / Alta | Solicitar decisión escrita al docente al inicio del Sprint 1 | PO + Developer |
| Integración MySQL no ejecutada | Media / Alta | Preparar instancia de prueba aislada y scripts reproducibles | Developer |
| Capacidad individual para varios roles | Alta / Media | Limitar WIP a 1–2 issues; carga realista por sprint | Todo el equipo |
| Evidencia académica externa ausente | Media / Alta | Reservar Sprint 4 para PDF, video y permisos del repo | PO + Scrum Master |

---

## Evidencia a guardar

Guardar capturas reales en `docs/evidencias/scrum/` y referenciarlas desde el tablero/PDF:

| Archivo | Contenido |
|---|---|
| `01-project-overview.png` | Tablero, propietario y vínculo del repositorio |
| `02-product-backlog.png` | Backlog con Priority, Size y Status |
| `03-sprint-1-plan.png` a `06-sprint-4-plan.png` | Objetivo e issues comprometidos de cada sprint |
| `07-sprint-reviews.png` | Demo o enlace a evidencia de incrementos aceptados |
| `08-retrospectives.png` | Acciones reales con fecha/responsable |
| `09-test-results.png` | Salida de pruebas, indicando si usa mocks o DB real |

---

## Revisión de cierre (completar al finalizar cada sprint)

Al terminar cada sprint, registrar:

- **Sprint Goal alcanzado:** Sí / Implementado / No + explicación
- **Historias aceptadas** y enlace a cada issue/PR/commit
- **Historias no terminadas**, motivo y nuevo destino en backlog
- **Resultados de pruebas** y defectos abiertos
- **Retrospectiva:** qué ayudó, qué dificultó y acción concreta
- **Enlace/captura del tablero** y fecha real

---

## Entregables finales

| # | Entregable | Estado |
|---|---|---|
| 1 | Este documento actualizado desde las ceremonias reales |  Completado |
| 2 | Project v2 vinculado al repositorio y accesible para docente |  Creado y público |
| 3 | PDF exportado desde la plantilla del curso con capturas reales |  Completado Sprint 4 |
| 4 | Video ≤ 7 minutos con demo real, enlazado en README |  Completado Sprint 4 |
| 5 | Repositorio con trainer agregado como colaborador |  Completado confirmar |

---

*Documento actualizado: 28 de septiembre de 2026 — Stefani Sánchez / steff-360*

