@echo off
echo 🔧 Instalando dependencias del backend...

REM Instalar dependencias principales
npm install

REM Verificar que las dependencias críticas estén instaladas
echo ✅ Verificando dependencias instaladas...

REM Verificar TypeORM
npm list typeorm >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ TypeORM instalado
) else (
    echo ❌ TypeORM no encontrado
    npm install typeorm@^0.3.17
)

REM Verificar MySQL2
npm list mysql2 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MySQL2 instalado
) else (
    echo ❌ MySQL2 no encontrado
    npm install mysql2@^3.6.5
)

REM Verificar Class Validator
npm list class-validator >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Class Validator instalado
) else (
    echo ❌ Class Validator no encontrado
    npm install class-validator@^0.14.0
)

REM Verificar Class Transformer
npm list class-transformer >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Class Transformer instalado
) else (
    echo ❌ Class Transformer no encontrado
    npm install class-transformer@^0.5.1
)

REM Verificar Reflect Metadata
npm list reflect-metadata >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Reflect Metadata instalado
) else (
    echo ❌ Reflect Metadata no encontrado
    npm install reflect-metadata@^0.1.13
)

echo 🎉 Instalación completada!
echo.
echo 📋 Próximos pasos:
echo 1. Configurar .env: copy env.example .env
echo 2. Ejecutar migraciones: npm run migrate
echo 3. Poblar datos: npm run seed
echo 4. Ejecutar: npm run dev

