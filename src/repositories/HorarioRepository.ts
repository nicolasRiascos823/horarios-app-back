import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Horario } from '../entities/Horario';

export class HorarioRepository {
  private repository: Repository<Horario>;

  constructor() {
    this.repository = AppDataSource.getRepository(Horario);
  }

  async findAll(filters?: {
    fichaId?: number;
    instructorId?: number;
    ambienteId?: number;
    diaSemana?: number;
  }): Promise<Horario[]> {
    const query = this.repository.createQueryBuilder('horario')
      .leftJoinAndSelect('horario.ficha', 'ficha')
      .leftJoinAndSelect('horario.instructor', 'instructor')
      .leftJoinAndSelect('horario.ambiente', 'ambiente');

    if (filters?.fichaId) {
      query.andWhere('horario.fichaId = :fichaId', { fichaId: filters.fichaId });
    }
    if (filters?.instructorId) {
      query.andWhere('horario.instructorId = :instructorId', { instructorId: filters.instructorId });
    }
    if (filters?.ambienteId) {
      query.andWhere('horario.ambienteId = :ambienteId', { ambienteId: filters.ambienteId });
    }
    if (filters?.diaSemana) {
      query.andWhere('horario.diaSemana = :diaSemana', { diaSemana: filters.diaSemana });
    }

    return await query
      .orderBy('horario.diaSemana', 'ASC')
      .addOrderBy('horario.horaInicio', 'ASC')
      .getMany();
  }

  async findById(id: number): Promise<Horario | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['ficha', 'instructor', 'ambiente']
    });
  }

  async create(horarioData: Partial<Horario>): Promise<Horario> {
    const horario = this.repository.create(horarioData);
    return await this.repository.save(horario);
  }

  async update(id: number, horarioData: Partial<Horario>): Promise<Horario | null> {
    await this.repository.update(id, horarioData);
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async findConflicts(
    instructorId: number,
    ambienteId: number,
    fichaId: number,
    diaSemana: number,
    horaInicio: number,
    horaFin: number,
    excludeId?: number
  ): Promise<Horario[]> {
    const query = this.repository.createQueryBuilder('horario')
      .where('horario.diaSemana = :diaSemana', { diaSemana })
      .andWhere('horario.horaInicio < :horaFin', { horaFin })
      .andWhere('horario.horaFin > :horaInicio', { horaInicio })
      .andWhere(
        '(horario.instructorId = :instructorId OR horario.ambienteId = :ambienteId OR horario.fichaId = :fichaId)',
        { instructorId, ambienteId, fichaId }
      );

    if (excludeId) {
      query.andWhere('horario.id != :excludeId', { excludeId });
    }

    return await query.getMany();
  }

  async getMatrizHorarios(fichaId: number): Promise<{ matriz: any[][]; horarios: Horario[] }> {
    const horarios = await this.findAll({ fichaId });
    
    // Crear matriz de horarios (6 días x 16 horas)
    const matriz = Array(6).fill(null).map(() => Array(16).fill(null));
    
    horarios.forEach(horario => {
      const diaIndex = horario.diaSemana - 1;
      const horaIndex = horario.horaInicio - 6;
      
      for (let i = 0; i < horario.duracion; i++) {
        if (horaIndex + i < 16) {
          matriz[diaIndex][horaIndex + i] = {
            id: horario.id,
            instructor: horario.instructor,
            ambiente: horario.ambiente,
            duracion: horario.duracion,
            esInicio: i === 0
          };
        }
      }
    });

    return { matriz, horarios };
  }
}

