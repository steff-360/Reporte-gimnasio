
# Reporte-gimnasio
# Gestión de Gimnasio

Aplicación de línea de comandos (CLI) para administrar clientes, planes, contratos, seguimiento, nutrición y movimientos financieros de un gimnasio. Está desarrollada con Node.js, módulos ES y MySQL mediante `mysql2/promise`.

## Requisitos

- Node.js 20 o superior.
- MySQL 8.0.16 o superior.
- npm.

## Instalación

1. Clona el repositorio y entra en la carpeta del proyecto.
2. Crea la base de datos ejecutando, en este orden, `database/01_schema.sql` y `database/02_seed.sql`.
3. Instala las dependencias:

```bash
npm install
```

4. Configura la conexión a MySQL. Puedes usar variables de entorno o un archivo `.env` basado en `.env.example`:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_clave
DB_NAME=gestion_gimnasio
```

5. Inicia la aplicación:

```bash
npm start
```

Las cuentas incluidas en el seed son `admin@gym.com` y `entrenador@gym.com`, ambas con contraseña `123456`. Son únicamente credenciales de demostración.

## Funcionalidades

- Inicio de sesión con roles `ADMIN` y `ENTRENADOR`.
- Registro, consulta, actualización y desactivación de clientes.
- Creación y administración de planes.
- Creación, renovación, finalización y cancelación de contratos.
- Registro y consulta del progreso físico.
- Planes nutricionales y alimentos.
- Registro de ingresos y egresos.
- Consulta de movimientos y balance por rango de fechas y cliente.
- Reporte financiero mensual consolidado o filtrado por cliente.

## Reporte financiero mensual

Desde el menú de administrador se puede seleccionar **Reporte financiero mensual**. El sistema solicita:

1. Año.
2. Mes.
3. Todo el gimnasio o un cliente específico.

El reporte muestra:

- Mensualidades.
- Sesiones individuales.
- Otros ingresos.
- Total de ingresos.
- Gastos operativos.
- Suplementos.
- Devoluciones.
- Total de egresos.
- Balance neto.

El cálculo se realiza directamente en MySQL mediante funciones de agregación `SUM` y expresiones `CASE`. No se recorren los movimientos uno por uno para calcular los totales en JavaScript. El balance neto también se obtiene en la consulta como ingresos menos egresos.

> Nota: el enunciado original de algunas actividades puede mencionar MongoDB y operadores como `$match`, `$group` y `$sum`. Este proyecto está implementado con MySQL. En MySQL, el equivalente de ese enfoque es `WHERE` para filtrar, `GROUP BY` para agrupar y `SUM` para agregar. No se mezcla MongoDB con la arquitectura actual.

Para clasificar los conceptos del reporte se utilizan palabras clave en `concepto`: los ingresos que contienen `mensual` se consideran mensualidades, los que contienen `sesion`/`sesión` se consideran sesiones individuales y los demás son otros ingresos. Para egresos, `suplement` se clasifica como suplementos, `devol` como devoluciones y el resto como gastos operativos.

## Transacciones

El reporte mensual es una operación de solo lectura, por lo que no necesita una transacción. Las operaciones que modifican información financiera sí usan transacciones: `FinanzasRepository.registrar()` inicia una transacción, valida el contrato cuando corresponde, inserta el movimiento y hace `commit`; ante un error ejecuta `rollback`.

## Arquitectura

```text
CLI (Inquirer/Chalk)
        ↓
Services
        ↓
Repositories
        ↓
MySQL (mysql2/promise)
```

- `src/app.js`: interacción con el usuario y composición de dependencias.
- `src/commands/reporte-financiero.js`: flujo de selección y presentación del reporte financiero mensual.
- `src/domain/`: entidades y Factory de movimientos.
- `src/services/`: reglas de aplicación y permisos.
- `src/repositories/`: acceso a datos y consultas SQL.
- `src/models/`: validaciones y modelos auxiliares.
- `src/config/`: configuración de la conexión.

Patrones utilizados:

- **Repository:** separa el acceso a MySQL de la lógica de negocio.
- **Factory:** `MovimientoFactory` valida y construye movimientos financieros.
- **Inyección de dependencias por constructor:** repositorios y servicios reciben sus dependencias.

## Pruebas

Ejecuta:

```bash
npm test
```

Las pruebas cubren validaciones, permisos de finanzas, transacciones y la consulta agregada del reporte mensual.

## Estructura

```text
database/
├── 01_schema.sql
├── 02_seed.sql
└── 03_seguimiento_nutricion.sql

docs/
src/
├── app.js
├── config/
├── domain/
├── models/
├── repositories/
└── services/

tests/
└── unit/
```
