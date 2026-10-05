# Pruebas

## Pruebas automatizadas

Comando: `npm test` (Node.js `node:test`). Resultado de la última ejecución: **32 pruebas aprobadas, 0 fallidas**.

Cobertura: validación de Cliente, Plan, Progreso, PlanNutricional, Alimento y MovimientoFactory; fechas de contrato y filtros financieros; autorización por rol en contratos/finanzas; pruebas simuladas de `ContratoRepository`, `NutricionRepository` y `FinanzasRepository` que verifican commit, rollback y liberación de conexiones.

La prueba transaccional usa un pool simulado: no demuestra por sí misma el comportamiento ante una instancia MySQL real.

## Integración completada

Ejecutar con MySQL configurado y registrar fecha, versión de MySQL, resultado y evidencia:

- Login correcto/incorrecto y permisos visibles para ambos roles.
- Crear, listar y buscar clientes; probar actualización/desactivación y exclusión de inactivos en la lista normal.
- Crear y listar planes y contratos; cancelar contrato activo y volver a cancelar uno inactivo.
- Registrar/consultar progreso semanal, probar duplicado semanal y rollback real al cancelar contrato.
- Crear plan nutricional bajo contrato activo, añadir alimentos y consultar resumen semanal.
- Registrar ingreso y egreso; comprobar persistencia y balance en SQL.
- Comprobar balance SQL con filtros de fechas/cliente.
- Confirmar que movimientos vinculados a contrato inactivo, inexistente o de otro cliente se rechazan.
- Comprobar rollback real de transacción ante un error controlado.

No se ejecutaron estas pruebas de integración durante esta revisión. Progreso y nutrición cuentan con pruebas unitarias simuladas, pero aún requieren validación contra una base MySQL real.
