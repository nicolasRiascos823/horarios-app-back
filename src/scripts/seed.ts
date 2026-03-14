import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { Ficha } from '../entities/Ficha';
import { Instructor } from '../entities/Instructor';
import { Ambiente } from '../entities/Ambiente';
import { Horario } from '../entities/Horario';

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  try {
    // Inicializar conexión a la base de datos
    await AppDataSource.initialize();

    // Crear fichas de ejemplo
    const fichas = await Promise.all([
      AppDataSource.getRepository(Ficha).save({
        codigo: 'FIC-001',
        nombre: 'Técnico en Programación de Software',
        programa: 'Tecnología en Análisis y Desarrollo de Software',
        jornada: 'Diurna'
      }),
      AppDataSource.getRepository(Ficha).save({
        codigo: 'FIC-002',
        nombre: 'Técnico en Sistemas',
        programa: 'Tecnología en Sistemas',
        jornada: 'Nocturna'
      }),
      AppDataSource.getRepository(Ficha).save({
        codigo: 'FIC-003',
        nombre: 'Técnico en Electrónica',
        programa: 'Tecnología en Electrónica',
        jornada: 'Mixta'
      })
    ]);

    console.log('✅ Fichas creadas:', fichas.length);

    // Crear instructores de ejemplo
    const instructores = await Promise.all([
      AppDataSource.getRepository(Instructor).save({
        documento: '12345678',
        nombre: 'Juan Carlos',
        apellido: 'Pérez García',
        email: 'juan.perez@sena.edu.co',
        telefono: '3001234567',
        especialidad: 'Programación de Software',
        activo: true
      }),
      AppDataSource.getRepository(Instructor).save({
        documento: '87654321',
        nombre: 'María Elena',
        apellido: 'Rodríguez López',
        email: 'maria.rodriguez@sena.edu.co',
        telefono: '3007654321',
        especialidad: 'Bases de Datos',
        activo: true
      }),
      AppDataSource.getRepository(Instructor).save({
        documento: '11223344',
        nombre: 'Carlos Alberto',
        apellido: 'González Martínez',
        email: 'carlos.gonzalez@sena.edu.co',
        telefono: '3009876543',
        especialidad: 'Redes de Computadores',
        activo: true
      }),
      AppDataSource.getRepository(Instructor).save({
        documento: '55667788',
        nombre: 'Ana María',
        apellido: 'Silva Torres',
        email: 'ana.silva@sena.edu.co',
        telefono: '3004567890',
        especialidad: 'Electrónica Digital',
        activo: true
      })
    ]);

    console.log('✅ Instructores creados:', instructores.length);

    // Crear ambientes de ejemplo
    const ambientes = await Promise.all([
      AppDataSource.getRepository(Ambiente).save({
        codigo: 'AULA-101',
        nombre: 'Aula de Programación',
        tipo: 'Aula',
        capacidad: 30,
        activo: true
      }),
      AppDataSource.getRepository(Ambiente).save({
        codigo: 'LAB-201',
        nombre: 'Laboratorio de Sistemas',
        tipo: 'Laboratorio',
        capacidad: 25,
        activo: true
      }),
      AppDataSource.getRepository(Ambiente).save({
        codigo: 'TALL-301',
        nombre: 'Taller de Electrónica',
        tipo: 'Taller',
        capacidad: 20,
        activo: true
      }),
      AppDataSource.getRepository(Ambiente).save({
        codigo: 'AULA-102',
        nombre: 'Aula de Redes',
        tipo: 'Aula',
        capacidad: 35,
        activo: true
      })
    ]);

    console.log('✅ Ambientes creados:', ambientes.length);

    // Crear horarios de ejemplo
    const horarios = await Promise.all([
      // Lunes - FIC-001 - Programación
      AppDataSource.getRepository(Horario).save({
        fichaId: fichas[0].id,
        instructorId: instructores[0].id,
        ambienteId: ambientes[0].id,
        diaSemana: 1, // Lunes
        horaInicio: 8,
        horaFin: 10,
        duracion: 2
      }),
      // Lunes - FIC-001 - Bases de Datos
      AppDataSource.getRepository(Horario).save({
        fichaId: fichas[0].id,
        instructorId: instructores[1].id,
        ambienteId: ambientes[1].id,
        diaSemana: 1, // Lunes
        horaInicio: 10,
        horaFin: 12,
        duracion: 2
      }),
      // Martes - FIC-002 - Redes
      AppDataSource.getRepository(Horario).save({
        fichaId: fichas[1].id,
        instructorId: instructores[2].id,
        ambienteId: ambientes[3].id,
        diaSemana: 2, // Martes
        horaInicio: 14,
        horaFin: 16,
        duracion: 2
      }),
      // Miércoles - FIC-003 - Electrónica
      AppDataSource.getRepository(Horario).save({
        fichaId: fichas[2].id,
        instructorId: instructores[3].id,
        ambienteId: ambientes[2].id,
        diaSemana: 3, // Miércoles
        horaInicio: 16,
        horaFin: 18,
        duracion: 2
      }),
      // Jueves - FIC-001 - Programación
      AppDataSource.getRepository(Horario).save({
        fichaId: fichas[0].id,
        instructorId: instructores[0].id,
        ambienteId: ambientes[0].id,
        diaSemana: 4, // Jueves
        horaInicio: 8,
        horaFin: 10,
        duracion: 2
      }),
      // Viernes - FIC-002 - Sistemas
      AppDataSource.getRepository(Horario).save({
        fichaId: fichas[1].id,
        instructorId: instructores[1].id,
        ambienteId: ambientes[1].id,
        diaSemana: 5, // Viernes
        horaInicio: 10,
        horaFin: 12,
        duracion: 2
      })
    ]);

    console.log('✅ Horarios creados:', horarios.length);

    console.log('🎉 Seed completado exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`- Fichas: ${fichas.length}`);
    console.log(`- Instructores: ${instructores.length}`);
    console.log(`- Ambientes: ${ambientes.length}`);
    console.log(`- Horarios: ${horarios.length}`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  });

