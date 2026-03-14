import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Ficha } from '../entities/Ficha';
import { Instructor } from '../entities/Instructor';
import { Ambiente } from '../entities/Ambiente';
import { Horario } from '../entities/Horario';

config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'sena_horarios',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'true',
  entities: [Ficha, Instructor, Ambiente, Horario],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Base de datos conectada exitosamente');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    throw error;
  }
};

