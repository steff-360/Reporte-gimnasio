# ============================================================
#  setup-mysql.ps1 — Instala MySQL Server y carga la BD
#  Proyecto: gestion-gimnasio
#  Uso: Ejecutar como Administrador en PowerShell
# ============================================================

$ErrorActionPreference = "Stop"

Write-Host "`n=== SETUP MYSQL — Gestion Gimnasio ===" -ForegroundColor Cyan

# ── 1. Verificar privilegios de administrador ──────────────
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "[ERROR] Ejecuta este script como Administrador." -ForegroundColor Red
    exit 1
}

# ── 2. Verificar si MySQL Server ya está instalado ────────
$mysqlService = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue
$mysqlExe = Get-Command mysql -ErrorAction SilentlyContinue

if ($mysqlExe) {
    Write-Host "[OK] MySQL ya está instalado en: $($mysqlExe.Source)" -ForegroundColor Green
} else {
    Write-Host "[INFO] MySQL Server no encontrado. Instalando via winget..." -ForegroundColor Yellow
    winget install Oracle.MySQL --accept-package-agreements --accept-source-agreements
    
    # Refrescar PATH
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    $mysqlExe = Get-Command mysql -ErrorAction SilentlyContinue
    if (-not $mysqlExe) {
        Write-Host "[WARN] mysql.exe no encontrado en PATH. Buscando manualmente..." -ForegroundColor Yellow
        $found = Get-ChildItem "C:\Program Files\MySQL" -Recurse -Filter "mysql.exe" -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notlike "*Workbench*" } | Select-Object -First 1
        if ($found) {
            $env:Path += ";$($found.DirectoryName)"
            Write-Host "[OK] Encontrado en: $($found.FullName)" -ForegroundColor Green
        } else {
            Write-Host "[ERROR] No se pudo encontrar mysql.exe. Reinstala MySQL Server manualmente." -ForegroundColor Red
            exit 1
        }
    }
}

# ── 3. Iniciar el servicio MySQL ───────────────────────────
$svc = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($svc) {
    if ($svc.Status -ne "Running") {
        Write-Host "[INFO] Iniciando servicio $($svc.Name)..." -ForegroundColor Yellow
        Start-Service $svc.Name
        Start-Sleep -Seconds 3
    }
    Write-Host "[OK] Servicio $($svc.Name) corriendo." -ForegroundColor Green
} else {
    Write-Host "[WARN] Servicio MySQL no registrado. Intentando iniciar mysqld..." -ForegroundColor Yellow
}

# ── 4. Crear .env si no existe ────────────────────────────
$projectRoot = Split-Path $PSScriptRoot -Parent
$envFile = Join-Path $projectRoot ".env"

if (-not (Test-Path $envFile)) {
    Write-Host "[INFO] Creando archivo .env..." -ForegroundColor Yellow
    @"
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=gestion_gimnasio
"@ | Set-Content $envFile -Encoding UTF8
    Write-Host "[OK] .env creado en $envFile" -ForegroundColor Green
    Write-Host "[AVISO] Si tu root tiene contraseña, edita DB_PASSWORD en .env" -ForegroundColor Magenta
} else {
    Write-Host "[OK] .env ya existe." -ForegroundColor Green
}

# ── 5. Cargar scripts SQL ──────────────────────────────────
$dbDir = Join-Path $projectRoot "database"
$scripts = @("01_schema.sql", "02_seed.sql", "03_seguimiento_nutricion.sql")

# Leer credenciales del .env
$envContent = Get-Content $envFile
$dbUser = ($envContent | Where-Object { $_ -match "^DB_USER=" }) -replace "^DB_USER=", ""
$dbPass = ($envContent | Where-Object { $_ -match "^DB_PASSWORD=" }) -replace "^DB_PASSWORD=", ""
$dbHost = ($envContent | Where-Object { $_ -match "^DB_HOST=" }) -replace "^DB_HOST=", ""
$dbPort = ($envContent | Where-Object { $_ -match "^DB_PORT=" }) -replace "^DB_PORT=", ""

if (-not $dbUser) { $dbUser = "root" }
if (-not $dbHost) { $dbHost = "127.0.0.1" }
if (-not $dbPort) { $dbPort = "3306" }

$passArg = if ($dbPass) { "-p$dbPass" } else { "" }

Write-Host "`n[INFO] Cargando scripts SQL en MySQL..." -ForegroundColor Cyan

foreach ($script in $scripts) {
    $path = Join-Path $dbDir $script
    if (Test-Path $path) {
        Write-Host "  -> Ejecutando $script ..." -ForegroundColor Yellow
        if ($passArg) {
            mysql -h $dbHost -P $dbPort -u $dbUser $passArg -e "source $path" 2>&1
        } else {
            mysql -h $dbHost -P $dbPort -u $dbUser -e "source $path" 2>&1
        }
        Write-Host "  [OK] $script cargado." -ForegroundColor Green
    } else {
        Write-Host "  [SKIP] $script no encontrado." -ForegroundColor Gray
    }
}

# ── 6. Verificar conexión final ───────────────────────────
Write-Host "`n[INFO] Verificando conexion a gestion_gimnasio..." -ForegroundColor Cyan
if ($passArg) {
    $result = mysql -h $dbHost -P $dbPort -u $dbUser $passArg -e "SELECT COUNT(*) as usuarios FROM gestion_gimnasio.usuarios;" 2>&1
} else {
    $result = mysql -h $dbHost -P $dbPort -u $dbUser -e "SELECT COUNT(*) as usuarios FROM gestion_gimnasio.usuarios;" 2>&1
}

if ($result -match "\d+") {
    Write-Host "[OK] Base de datos lista. Usuarios encontrados: $result" -ForegroundColor Green
} else {
    Write-Host "[WARN] Verifica manualmente con MySQL Workbench." -ForegroundColor Yellow
}

Write-Host "`n=== SETUP COMPLETADO. Ahora corre: npm start ===" -ForegroundColor Cyan
