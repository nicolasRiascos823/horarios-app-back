#!/bin/bash

echo "🔧 Instalando dependencias del backend..."

# Instalar dependencias principales
npm install

# Verificar que las dependencias críticas estén instaladas
echo "✅ Verificando dependencias instaladas..."

# Verificar TypeORM
if npm list typeorm > /dev/null 2>&1; then
    echo "✅ TypeORM instalado"
else
    echo "❌ TypeORM no encontrado"
    npm install typeorm@^0.3.17
fi

# Verificar MySQL2
if npm list mysql2 > /dev/null 2>&1; then
    echo "✅ MySQL2 instalado"
else
    echo "❌ MySQL2 no encontrado"
    npm install mysql2@^3.6.5
fi

# Verificar Class Validator
if npm list class-validator > /dev/null 2>&1; then
    echo "✅ Class Validator instalado"
else
    echo "❌ Class Validator no encontrado"
    npm install class-validator@^0.14.0
fi

# Verificar Class Transformer
if npm list class-transformer > /dev/null 2>&1; then
    echo "✅ Class Transformer instalado"
else
    echo "❌ Class Transformer no encontrado"
    npm install class-transformer@^0.5.1
fi

# Verificar Reflect Metadata
if npm list reflect-metadata > /dev/null 2>&1; then
    echo "✅ Reflect Metadata instalado"
else
    echo "❌ Reflect Metadata no encontrado"
    npm install reflect-metadata@^0.1.13
fi

echo "🎉 Instalación completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configurar .env: cp env.example .env"
echo "2. Ejecutar migraciones: npm run migrate"
echo "3. Poblar datos: npm run seed"
echo "4. Ejecutar: npm run dev"

