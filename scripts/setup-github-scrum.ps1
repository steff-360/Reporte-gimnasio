# ============================================================
# setup-github-scrum.ps1
# Crea el tablero Scrum en GitHub Projects + todas las issues
# del Proyecto Gimnasio para steff-360/Proyecto-Gimnasio-
# ============================================================

$OWNER     = "steff-360"
$REPO      = "Proyecto-Gimnasio-"
$REPO_FULL = "$OWNER/$REPO"
$GH        = "C:\Program Files\GitHub CLI\gh.exe"

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  SETUP SCRUM - GitHub Projects + Issues" -ForegroundColor Cyan
Write-Host "  Repo: $REPO_FULL" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# ──────────────────────────────────────────────
# 1. Verificar autenticacion
# ──────────────────────────────────────────────
Write-Host "[1/5] Verificando autenticacion de GitHub CLI..." -ForegroundColor Yellow
$authStatus = & $GH auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: No estas autenticado." -ForegroundColor Red
    Write-Host "  Ejecuta en la terminal: & '$GH' auth login" -ForegroundColor Yellow
    Write-Host "  Luego vuelve a correr este script." -ForegroundColor Yellow
    exit 1
}
Write-Host "  OK - Autenticado correctamente" -ForegroundColor Green

# ──────────────────────────────────────────────
# 2. Crear etiquetas (labels)
# ──────────────────────────────────────────────
Write-Host ""
Write-Host "[2/5] Creando etiquetas..." -ForegroundColor Yellow

$labels = @(
    @{ name = "area:cli";        color = "0075ca"; description = "Interfaz de linea de comandos" },
    @{ name = "area:auth";       color = "e4e669"; description = "Autenticacion y autorizacion" },
    @{ name = "area:clientes";   color = "d93f0b"; description = "Gestion de clientes" },
    @{ name = "area:contratos";  color = "0e8a16"; description = "Contratos y ciclo de vida" },
    @{ name = "area:progreso";   color = "5319e7"; description = "Seguimiento fisico" },
    @{ name = "area:nutricion";  color = "fbca04"; description = "Planes nutricionales" },
    @{ name = "area:finanzas";   color = "006b75"; description = "Control financiero" },
    @{ name = "area:database";   color = "b60205"; description = "Base de datos y migraciones" },
    @{ name = "area:docs";       color = "1d76db"; description = "Documentacion" },
    @{ name = "type:story";      color = "0052cc"; description = "Historia de usuario" },
    @{ name = "type:bug";        color = "ee0701"; description = "Defecto" },
    @{ name = "type:task";       color = "bfd4f2"; description = "Tarea tecnica" },
    @{ name = "risk:blocker";    color = "b60205"; description = "Bloquea avance" },
    @{ name = "priority:P0";     color = "b60205"; description = "P0 - Bloqueante critico" },
    @{ name = "priority:P1";     color = "d93f0b"; description = "P1 - Alta prioridad" },
    @{ name = "priority:P2";     color = "fbca04"; description = "P2 - Prioridad normal" },
    @{ name = "priority:P3";     color = "0e8a16"; description = "P3 - Baja prioridad" },
    @{ name = "sprint:1";        color = "c5def5"; description = "Sprint 1 (5-16 oct)" },
    @{ name = "sprint:2";        color = "bfd4f2"; description = "Sprint 2 (19-30 oct)" },
    @{ name = "sprint:3";        color = "d4c5f9"; description = "Sprint 3 (2-13 nov)" },
    @{ name = "sprint:4";        color = "e1d5f9"; description = "Sprint 4 (16-27 nov)" }
)

foreach ($label in $labels) {
    $result = & $GH label create $label.name `
        --color $label.color `
        --description $label.description `
        --repo $REPO_FULL 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  + $($label.name)" -ForegroundColor Green
    } else {
        Write-Host "  ~ Ya existe: $($label.name)" -ForegroundColor DarkYellow
    }
}

# ──────────────────────────────────────────────
# 3. Crear issues (User Stories)
# ──────────────────────────────────────────────
Write-Host ""
Write-Host "[3/5] Creando Issues / Historias de Usuario..." -ForegroundColor Yellow

$issues = @(
    @{
        title  = "HU01: Inicializar proyecto Node.js con modulos y scripts reproducibles"
        body   = @"
## Historia de usuario
**Como** equipo, **quiero** iniciar el proyecto Node.js con modulos y scripts reproducibles **para** ejecutar y probar la CLI.

## Estado inicial
Implementado antes del plan

## Criterios de aceptacion
- [ ] ``npm install`` termina sin errores
- [ ] ``npm start`` arranca con configuracion valida
- [ ] ``npm test`` ejecuta las pruebas correctamente

## Sprint
Sprint 4 (16-27 nov 2026)
"@
        labels = "type:story,priority:P1,area:cli,sprint:4"
    },
    @{
        title  = "HU02: [BLOQUEANTE] Confirmar tecnologia de persistencia aprobada por el curso"
        body   = @"
## Historia de usuario
**Como** responsable tecnico, **quiero** persistir en la tecnologia aprobada por el curso **para** cumplir la arquitectura requerida.

## Estado inicial
**BLOQUEADO** - requiere aprobacion del docente

## Bloqueo activo
El enunciado solicita MongoDB con driver ``mongodb``; la implementacion actual usa MySQL con ``mysql2``.
Obtener aprobacion escrita del docente para conservar MySQL o abrir migracion a MongoDB.

## Criterios de aceptacion
- [ ] Existe aprobacion escrita de MySQL o migracion aprobada a ``mongodb``
- [ ] README, esquema y pruebas coinciden con la decision
- [ ] No se declara cumplido hasta resolver esta decision

## Sprint
Sprint 1 (5-16 oct 2026)
"@
        labels = "type:story,priority:P0,area:database,risk:blocker,sprint:1"
    },
    @{
        title  = "HU03: Iniciar sesion con credenciales seguras en la CLI"
        body   = @"
## Historia de usuario
**Como** entrenador, **quiero** iniciar sesion con credenciales seguras **para** acceder a la CLI.

## Estado inicial
Parcial

## Criterios de aceptacion
- [ ] Usuario activo y contrasena correcta permiten acceso
- [ ] Contrasena incorrecta se rechaza sin revelar cual campo fallo
- [ ] Sesion expira correctamente

## Sprint
Sprint 3 (2-13 nov 2026)
"@
        labels = "type:story,priority:P1,area:auth,sprint:3"
    },
    @{
        title  = "HU04: Permisos explicitos por rol para limitar operaciones sensibles"
        body   = @"
## Historia de usuario
**Como** administrador, **quiero** que cada rol tenga permisos explicitos **para** limitar operaciones sensibles.

## Estado inicial
Parcial

## Criterios de aceptacion
- [ ] ADMIN puede realizar funciones administrativas
- [ ] ENTRENADOR no puede acceder a finanzas ni mutar contratos aunque invoque servicios directamente
- [ ] Existen pruebas para ambos roles

## Sprint
Sprint 1 (5-16 oct 2026)
"@
        labels = "type:story,priority:P1,area:auth,sprint:1"
    },
    @{
        title  = "HU05: Crear, modificar y desactivar usuarios del gimnasio"
        body   = @"
## Historia de usuario
**Como** administrador, **quiero** crear, modificar y desactivar usuarios **para** mantener las cuentas del gimnasio.

## Estado inicial
Pendiente

## Criterios de aceptacion
- [ ] Operaciones validan correo, rol y estado
- [ ] La contrasena se guarda solo como hash
- [ ] No se puede desactivar el ultimo administrador activo

## Sprint
Sprint 1 (5-16 oct 2026)
"@
        labels = "type:story,priority:P2,area:auth,sprint:1"
    },
    @{
        title  = "HU06: Registrar clientes con datos validados"
        body   = @"
## Historia de usuario
**Como** entrenador, **quiero** registrar clientes con datos validados **para** conservar informacion consistente.

## Estado inicial
Implementado antes del plan

## Criterios de aceptacion
- [ ] Nombre/apellido requeridos
- [ ] Correo valido si se proporciona
- [ ] Edad dentro del rango aceptado
- [ ] Datos persisten correctamente

## Sprint
Sprint 4 (16-27 nov 2026)
"@
        labels = "type:story,priority:P1,area:clientes,sprint:4"
    },
    @{
        title  = "HU07: Buscar y listar clientes"
        body   = @"
## Historia de usuario
**Como** entrenador, **quiero** buscar y listar clientes **para** consultar su ficha rapidamente.

## Estado inicial
Implementado antes del plan

## Criterios de aceptacion
- [ ] Busqueda por ID funciona
- [ ] Listado de activos funciona
- [ ] Los inactivos no aparecen salvo consulta explicita de auditoria

## Sprint
Sprint 4 (16-27 nov 2026)
"@
        labels = "type:story,priority:P1,area:clientes,sprint:4"
    },
    @{
        title  = "HU08: Actualizar y desactivar clientes conservando historial"
        body   = @"
## Historia de usuario
**Como** administrador, **quiero** actualizar y desactivar clientes **para** mantener informacion vigente sin borrar historial.

## Estado inicial
Implementado antes del plan

## Criterios de aceptacion
- [ ] Se actualiza ficha correctamente
- [ ] La desactivacion es logica (no elimina datos)
- [ ] Contratos y movimientos historicos siguen relacionados

## Sprint
Sprint 4 (16-27 nov 2026)
"@
        labels = "type:story,priority:P1,area:clientes,sprint:4"
    },
    @{
        title  = "HU09: Crear y mantener planes de entrenamiento"
        body   = @"
## Historia de usuario
**Como** entrenador, **quiero** crear y mantener planes de entrenamiento **para** ofrecer programas actualizados.

## Estado inicial
Parcial

## Criterios de aceptacion
- [ ] Nombre, duracion positiva, nivel permitido, meta y precio no negativo se validan
- [ ] Listar/actualizar/desactivar conserva contratos historicos

## Sprint
Sprint 3 (2-13 nov 2026)
"@
        labels = "type:story,priority:P1,area:contratos,sprint:3"
    },
    @{
        title  = "HU10: Asignar plan a cliente creando contrato automaticamente"
        body   = @"
## Historia de usuario
**Como** entrenador, **quiero** asignar un plan a un cliente **para** crear su contrato automaticamente.

## Estado inicial
Parcial

## Criterios de aceptacion
- [ ] Cliente y plan deben estar activos
- [ ] Contrato conserva precio/duracion acordados y fechas validas
- [ ] Se registra de forma atomica

## Sprint
Sprint 1 (5-16 oct 2026)
"@
        labels = "type:story,priority:P1,area:contratos,sprint:1"
    },
    @{
        title  = "HU11: Renovar, finalizar o cancelar contratos"
        body   = @"
## Historia de usuario
**Como** administrador, **quiero** renovar, finalizar o cancelar contratos **para** gestionar su ciclo de vida.

## Estado inicial
Parcial

## Criterios de aceptacion
- [ ] Solo contrato activo cambia de estado
- [ ] Renovacion termina el previo y crea el siguiente atomicamente
- [ ] Cancelacion elimina seguimientos asociados o revierte todo

## Sprint
Sprint 1 (5-16 oct 2026)
"@
        labels = "type:story,priority:P1,area:contratos,sprint:1"
    },
    @{
        title  = "HU12: Registrar avances fisicos semanales del cliente"
        body   = @"
## Historia de usuario
**Como** entrenador, **quiero** registrar avances fisicos semanales **para** observar la evolucion del cliente.

## Estado inicial
Parcial

## Criterios de aceptacion
- [ ] Maximo un progreso por contrato/semana
- [ ] Peso es positivo
- [ ] Porcentaje de grasa entre 0 y 100
- [ ] Contrato activo pertenece al cliente

## Sprint
Sprint 2 (19-30 oct 2026)
"@
        labels = "type:story,priority:P1,area:progreso,sprint:2"
    },
    @{
        title  = "HU13: Consultar y eliminar registros de progreso fisico"
        body   = @"
## Historia de usuario
**Como** entrenador, **quiero** consultar y eliminar registros de progreso **para** mantener un historial cronologico correcto.

## Estado inicial
Parcial

## Criterios de aceptacion
- [ ] Historial ordenado por fecha
- [ ] Eliminacion transaccional
- [ ] La politica de cancelacion de contrato esta probada contra MySQL

## Sprint
Sprint 2 (19-30 oct 2026)
"@
        labels = "type:story,priority:P1,area:progreso,sprint:2"
    },
    @{
        title  = "HU14: Planificar alimentacion y registrar alimentos para nutricion"
        body   = @"
## Historia de usuario
**Como** entrenador, **quiero** planificar alimentacion y registrar alimentos **para** asociar nutricion al entrenamiento.

## Estado inicial
Parcial

## Criterios de aceptacion
- [ ] Plan nutricional pertenece a cliente y plan
- [ ] Requiere contrato activo
- [ ] Dia, comida y calorias se validan
- [ ] Se puede consultar resumen semanal

## Sprint
Sprint 2 (19-30 oct 2026)
"@
        labels = "type:story,priority:P1,area:nutricion,sprint:2"
    },
    @{
        title  = "HU15: Registrar ingresos y egresos asociados a clientes/contratos"
        body   = @"
## Historia de usuario
**Como** administrador, **quiero** registrar ingresos y egresos asociados a clientes/contratos **para** llevar control financiero.

## Estado inicial
Parcial

## Criterios de aceptacion
- [ ] Monto positivo, fecha valida y usuario creador obligatorios
- [ ] Contrato opcional activo y del cliente
- [ ] Persistencia transaccional

## Sprint
Sprint 2 (19-30 oct 2026)
"@
        labels = "type:story,priority:P1,area:finanzas,sprint:2"
    },
    @{
        title  = "HU16: Consultar balance por fechas y cliente"
        body   = @"
## Historia de usuario
**Como** administrador, **quiero** consultar balance por fechas y cliente **para** revisar resultados financieros.

## Estado inicial
Implementado antes del plan

## Criterios de aceptacion
- [ ] SQL calcula ingresos/egresos con filtros parametrizados
- [ ] Inicio no posterior al fin
- [ ] No requiere cargar todos los movimientos en memoria

## Sprint
Sprint 4 (16-27 nov 2026)
"@
        labels = "type:story,priority:P1,area:finanzas,sprint:4"
    },
    @{
        title  = "HU17: Mensajes claros y entradas validadas para corregir errores"
        body   = @"
## Historia de usuario
**Como** usuario, **quiero** mensajes claros y entradas validadas **para** corregir errores sin perder el flujo.

## Estado inicial
Parcial

## Criterios de aceptacion
- [ ] Fechas y rangos invalidos se explican con claridad
- [ ] No se filtran errores SQL ni secretos
- [ ] El menu vuelve a un estado utilizable

## Sprint
Sprint 3 (2-13 nov 2026)
"@
        labels = "type:story,priority:P2,area:cli,sprint:3"
    },
    @{
        title  = "HU18: Aplicar patron Repository y Factory para separacion de responsabilidades"
        body   = @"
## Historia de usuario
**Como** equipo, **quiero** aplicar Repository y Factory **para** separar persistencia y creacion validada de movimientos.

## Estado inicial
Implementado antes del plan

## Criterios de aceptacion
- [ ] Repositorios encapsulan SQL correctamente
- [ ] Factory valida movimiento antes de crear
- [ ] La documentacion identifica responsabilidades y pruebas

## Sprint
Sprint 4 (16-27 nov 2026)
"@
        labels = "type:story,priority:P2,area:database,sprint:4"
    },
    @{
        title  = "HU19: Automatizar pruebas unitarias e integracion"
        body   = @"
## Historia de usuario
**Como** equipo, **quiero** automatizar pruebas unitarias e integracion **para** reducir regresiones.

## Estado inicial
Parcial

## Criterios de aceptacion
- [ ] Pruebas unitarias pasan correctamente
- [ ] Integracion ejecuta contra instancia real aprobada
- [ ] Resultado/version de base se registra en evidencia

## Sprint
Sprint 3 (2-13 nov 2026)
"@
        labels = "type:story,priority:P1,area:docs,sprint:3"
    },
    @{
        title  = "HU20: Documentar instalacion, arquitectura y entrega para el evaluador"
        body   = @"
## Historia de usuario
**Como** equipo, **quiero** documentar instalacion, arquitectura y entrega **para** que el evaluador reproduzca el proyecto.

## Estado inicial
Parcial

## Criterios de aceptacion
- [ ] README y docs coherentes con el estado real
- [ ] PDF segun plantilla adjunto al repo
- [ ] Video maximo 7 minutos enlazado
- [ ] Repo/colaborador comprobados

## Sprint
Sprint 4 (16-27 nov 2026)
"@
        labels = "type:story,priority:P1,area:docs,sprint:4"
    },
    @{
        title  = "HU21: Almacenar fotos de progreso del cliente de forma segura"
        body   = @"
## Historia de usuario
**Como** entrenador, **quiero** almacenar fotos de progreso **para** comparar cambios visuales de forma segura.

## Estado inicial
Pendiente

## Criterios de aceptacion
- [ ] Carga valida tipo y tamano del archivo
- [ ] Almacena de forma segura
- [ ] Guarda referencia en base de datos
- [ ] README explica ubicacion y privacidad

## Sprint
Sprint 2 (19-30 oct 2026)
"@
        labels = "type:story,priority:P2,area:progreso,sprint:2"
    },
    @{
        title  = "HU22: Vincular pagos a mensualidades o sesiones para conciliar ingresos"
        body   = @"
## Historia de usuario
**Como** administrador, **quiero** vincular pagos a mensualidades o sesiones **para** conciliar ingresos con el servicio prestado.

## Estado inicial
Pendiente

## Criterios de aceptacion
- [ ] Tipo de ingreso y cliente/contrato obligatorios segun regla
- [ ] Transaccion evita pago duplicado
- [ ] Balance refleja el asiento correctamente

## Sprint
Sprint 2 (19-30 oct 2026)
"@
        labels = "type:story,priority:P1,area:finanzas,sprint:2"
    },
    @{
        title  = "HU23: Editar o desactivar planes nutricionales y alimentos"
        body   = @"
## Historia de usuario
**Como** entrenador, **quiero** editar o desactivar planes nutricionales y alimentos **para** mantenerlos actualizados.

## Estado inicial
Pendiente

## Criterios de aceptacion
- [ ] Edicion valida rangos y fechas
- [ ] Desactivacion conserva historial
- [ ] Alimentos asociados se manejan segun politica documentada

## Sprint
Sprint 2 (19-30 oct 2026)
"@
        labels = "type:story,priority:P2,area:nutricion,sprint:2"
    },
    @{
        title  = "HU24: [BLOQUEANTE] Verificar esquema y flujos en base de datos real"
        body   = @"
## Historia de usuario
**Como** equipo, **quiero** verificar el esquema y los flujos en la base real **para** validar transacciones y migraciones.

## Estado inicial
Pendiente

## Bloqueo activo
Depende de la resolucion de HU02 (decision tecnologica).

## Criterios de aceptacion
- [ ] Pruebas corren contra MySQL aprobado o MongoDB replica set aprobado
- [ ] Restauracion/migracion se prueba sin perdida no prevista

## Sprint
Sprint 3 (2-13 nov 2026)
"@
        labels = "type:story,priority:P0,area:database,risk:blocker,sprint:3"
    },
    @{
        title  = "HU25: Completar evidencia de Scrum y presentacion para entrega"
        body   = @"
## Historia de usuario
**Como** equipo, **quiero** completar evidencia de Scrum y presentacion **para** entregar el trabajo verificablemente.

## Estado inicial
Pendiente

## Criterios de aceptacion
- [ ] Tablero GitHub Projects contiene issues y sprints reales
- [ ] Se documentan revisiones y retrospectivas reales
- [ ] PDF y video enlazados correctamente
- [ ] No hay evidencia fabricada

## Sprint
Sprint 4 (16-27 nov 2026)
"@
        labels = "type:story,priority:P1,area:docs,sprint:4"
    }
)

foreach ($issue in $issues) {
    Write-Host "  Creando: $($issue.title.Substring(0, [Math]::Min(65, $issue.title.Length)))..." -ForegroundColor White

    $result = & $GH issue create `
        --repo $REPO_FULL `
        --title $issue.title `
        --body $issue.body `
        --label $issue.labels 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host "    OK -> $result" -ForegroundColor Green
    } else {
        Write-Host "    ERROR: $result" -ForegroundColor Red
    }

    Start-Sleep -Milliseconds 500
}

# ──────────────────────────────────────────────
# 4. Crear el GitHub Project
# ──────────────────────────────────────────────
Write-Host ""
Write-Host "[4/5] Creando GitHub Project..." -ForegroundColor Yellow

$projectResult = & $GH project create `
    --owner $OWNER `
    --title "Gestion de Gimnasio - Desarrollo Scrum" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "  OK - Proyecto creado" -ForegroundColor Green
    Write-Host "  $projectResult" -ForegroundColor Cyan
} else {
    Write-Host "  Nota: $projectResult" -ForegroundColor DarkYellow
}

# Obtener numero del proyecto (nuevo o existente)
$projectsJson = & $GH project list --owner $OWNER --format json 2>&1
$projectNumber = ($projectsJson | ConvertFrom-Json) |
    Where-Object { $_.title -like "*Gimnasio*" } |
    Select-Object -ExpandProperty number -First 1

if ($projectNumber) {
    Write-Host "  Numero del proyecto: $projectNumber" -ForegroundColor Cyan
}

# ──────────────────────────────────────────────
# 5. Agregar issues al proyecto
# ──────────────────────────────────────────────
Write-Host ""
Write-Host "[5/5] Agregando issues al proyecto..." -ForegroundColor Yellow

if ($projectNumber) {
    $allIssuesJson = & $GH issue list --repo $REPO_FULL --limit 50 --json url 2>&1
    $allIssues = $allIssuesJson | ConvertFrom-Json

    foreach ($issue in $allIssues) {
        $addResult = & $GH project item-add $projectNumber `
            --owner $OWNER `
            --url $issue.url 2>&1

        if ($LASTEXITCODE -eq 0) {
            Write-Host "  + $($issue.url)" -ForegroundColor Green
        } else {
            Write-Host "  ~ Error: $addResult" -ForegroundColor DarkYellow
        }
        Start-Sleep -Milliseconds 300
    }
} else {
    Write-Host "  No se encontro el proyecto. Agrega las issues manualmente." -ForegroundColor Red
}

# ──────────────────────────────────────────────
# Resumen final
# ──────────────────────────────────────────────
Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  SETUP COMPLETADO" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Proximos pasos manuales en github.com:" -ForegroundColor White
Write-Host "  1. Ve a https://github.com/$OWNER?tab=projects" -ForegroundColor Yellow
Write-Host "  2. Abre 'Gestion de Gimnasio - Desarrollo Scrum'" -ForegroundColor Yellow
Write-Host "  3. Agrega campos: Sprint, Priority, Size, Work type" -ForegroundColor Yellow
Write-Host ""
Write-Host "Para ver issues en VS Code:" -ForegroundColor White
Write-Host "  Instala: GitHub Pull Requests and Issues" -ForegroundColor Yellow
Write-Host "  ID extension: GitHub.vscode-pull-request-github" -ForegroundColor Yellow
Write-Host ""
Write-Host "Repo: https://github.com/$REPO_FULL" -ForegroundColor Cyan
Write-Host ""
