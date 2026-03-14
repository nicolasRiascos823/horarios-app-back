# Backend - Sistema de Horarios SENA

Backend desarrollado con **Node.js**, **TypeScript**, **TypeORM** y **MySQL** siguiendo principios de **Clean Code** y **Arquitectura MVC**.

## 🏗️ Arquitectura

### Estructura del Proyecto
```
src/
├── config/           # Configuraciones
│   └── database.ts   # Configuración de TypeORM
├── controllers/      # Controladores (MVC)
│   ├── FichaController.ts
│   ├── InstructorController.ts
│   ├── AmbienteController.ts
│   └── HorarioController.ts
├── dto/             # Data Transfer Objects
│   ├── CreateFichaDto.ts
│   ├── UpdateFichaDto.ts
│   └── ...
├── entities/        # Entidades de TypeORM
│   ├── Ficha.ts
│   ├── Instructor.ts
│   ├── Ambiente.ts
│   └── Horario.ts
├── repositories/    # Repositorios (Patrón Repository)
│   ├── FichaRepository.ts
│   ├── InstructorRepository.ts
│   ├── AmbienteRepository.ts
│   └── HorarioRepository.ts
├── services/        # Lógica de negocio
│   ├── FichaService.ts
│   ├── InstructorService.ts
│   ├── AmbienteService.ts
│   └── HorarioService.ts
├── routes/          # Rutas de Express
│   ├── fichas.ts
│   ├── instructores.ts
│   ├── ambientes.ts
│   └── horarios.ts
├── migrations/      # Migraciones de base de datos
└── scripts/         # Scripts utilitarios
    └── seed.ts
```

## 🚀 Instalación

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp env.example .env
```

Editar `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=sena_horarios
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Ejecutar migraciones
```bash
npm run migrate
```

### 4. Poblar con datos de ejemplo (opcional)
```bash
npm run seed
```

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

## 📊 Base de Datos

### Entidades Principales

- **Ficha**: Información de las fichas de formación
- **Instructor**: Datos de los instructores
- **Ambiente**: Espacios de formación (aulas, laboratorios, etc.)
- **Horario**: Horarios asignados con relaciones a las otras entidades

### Validaciones Implementadas

- Un instructor no puede tener dos clases al mismo tiempo
- Un ambiente no puede estar ocupado por dos clases simultáneamente
- Una ficha no puede tener dos clases en el mismo horario
- Validación de rangos horarios (6:00 AM - 10:00 PM)
- Validación de días de la semana (Lunes a Sábado)

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start

# Migraciones
npm run migrate                    # Ejecutar migraciones
npm run migration:generate         # Generar nueva migración
npm run migration:create           # Crear migración vacía

# Datos de ejemplo
npm run seed
```

## 🔧 Tecnologías

- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **TypeORM** - ORM para MySQL
- **MySQL** - Base de datos
- **Class Validator** - Validación de DTOs
- **Class Transformer** - Transformación de objetos
- **Helmet** - Seguridad
- **CORS** - Cross-Origin Resource Sharing
- **Morgan** - Logging HTTP

## 📝 Principios Aplicados

### Clean Code
- Nombres descriptivos y significativos
- Funciones pequeñas y con una sola responsabilidad
- Comentarios solo cuando es necesario
- Código autodocumentado

### SOLID Principles
- **S** - Single Responsibility Principle
- **O** - Open/Closed Principle
- **L** - Liskov Substitution Principle
- **I** - Interface Segregation Principle
- **D** - Dependency Inversion Principle

### Patrones de Diseño
- **Repository Pattern** - Abstracción de acceso a datos
- **Service Layer** - Lógica de negocio
- **DTO Pattern** - Transferencia de datos
- **MVC** - Separación de responsabilidades

## 🚀 API Endpoints

### Fichas
- `GET /api/fichas` - Obtener todas las fichas
- `GET /api/fichas/:id` - Obtener ficha por ID
- `POST /api/fichas` - Crear nueva ficha
- `PUT /api/fichas/:id` - Actualizar ficha
- `DELETE /api/fichas/:id` - Eliminar ficha

### Instructores
- `GET /api/instructores` - Obtener todos los instructores
- `GET /api/instructores/:id` - Obtener instructor por ID
- `POST /api/instructores` - Crear nuevo instructor
- `PUT /api/instructores/:id` - Actualizar instructor
- `DELETE /api/instructores/:id` - Eliminar instructor

### Ambientes
- `GET /api/ambientes` - Obtener todos los ambientes
- `GET /api/ambientes/:id` - Obtener ambiente por ID
- `POST /api/ambientes` - Crear nuevo ambiente
- `PUT /api/ambientes/:id` - Actualizar ambiente
- `DELETE /api/ambientes/:id` - Eliminar ambiente

### Horarios
- `GET /api/horarios` - Obtener todos los horarios
- `GET /api/horarios/:id` - Obtener horario por ID
- `POST /api/horarios` - Crear nuevo horario
- `PUT /api/horarios/:id` - Actualizar horario
- `DELETE /api/horarios/:id` - Eliminar horario
- `GET /api/horarios/matriz/:fichaId` - Obtener matriz de horarios

## 🔍 Health Check

```bash
GET /api/health
```

Respuesta:
```json
{
  "status": "OK",
  "message": "Servidor de horarios SENA funcionando correctamente",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🚨 Manejo de Errores

El sistema implementa un manejo centralizado de errores con:
- Validación de entrada con Class Validator
- Respuestas consistentes en formato JSON
- Logging detallado para debugging
- Códigos de estado HTTP apropiados

## 📈 Logging

- **Morgan** para logs HTTP
- **Console** para logs de aplicación
- Diferentes niveles según el entorno (desarrollo/producción)

---

**Desarrollado con ❤️ para el SENA**

