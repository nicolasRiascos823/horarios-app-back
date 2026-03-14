import { HorarioRepository } from '../repositories/HorarioRepository';
import { FichaRepository } from '../repositories/FichaRepository';
import { InstructorRepository } from '../repositories/InstructorRepository';
import { AmbienteRepository } from '../repositories/AmbienteRepository';
import { Horario } from '../entities/Horario';
import { CreateHorarioDto } from '../dto/CreateHorarioDto';
import { UpdateHorarioDto } from '../dto/UpdateHorarioDto';

export class HorarioService {
  private horarioRepository: HorarioRepository;
  private fichaRepository: FichaRepository;
  private instructorRepository: InstructorRepository;
  private ambienteRepository: AmbienteRepository;

  constructor() {
    this.horarioRepository = new HorarioRepository();
    this.fichaRepository = new FichaRepository();
    this.instructorRepository = new InstructorRepository();
    this.ambienteRepository = new AmbienteRepository();
  }

  async findAll(filters?: {
    fichaId?: number;
    instructorId?: number;
    ambienteId?: number;
    diaSemana?: number;
  }): Promise<Horario[]> {
    return await this.horarioRepository.findAll(filters);
  }

  async findById(id: number): Promise<Horario | null> {
    return await this.horarioRepository.findById(id);
  }

  async create(createHorarioDto: CreateHorarioDto): Promise<Horario> {
    // Validar que la hora de fin sea mayor que la de inicio
    if (createHorarioDto.horaFin <= createHorarioDto.horaInicio) {
      throw new Error('La hora de fin debe ser mayor que la hora de inicio');
    }

    // Validar que la duración coincida con las horas
    if (createHorarioDto.horaFin - createHorarioDto.horaInicio !== createHorarioDto.duracion) {
      throw new Error('La duración debe coincidir con la diferencia entre hora de fin e inicio');
    }

    // Verificar que los recursos existan
    const [ficha, instructor, ambiente] = await Promise.all([
      this.fichaRepository.findById(createHorarioDto.fichaId),
      this.instructorRepository.findById(createHorarioDto.instructorId),
      this.ambienteRepository.findById(createHorarioDto.ambienteId)
    ]);

    if (!ficha) {
      throw new Error('Ficha no encontrada');
    }
    if (!instructor) {
      throw new Error('Instructor no encontrado');
    }
    if (!ambiente) {
      throw new Error('Ambiente no encontrado');
    }

    // Validar conflictos
    const conflictos = await this.horarioRepository.findConflicts(
      createHorarioDto.instructorId,
      createHorarioDto.ambienteId,
      createHorarioDto.fichaId,
      createHorarioDto.diaSemana,
      createHorarioDto.horaInicio,
      createHorarioDto.horaFin
    );

    if (conflictos.length > 0) {
      const conflictosInfo = conflictos.map(conflicto => {
        if (conflicto.instructorId === createHorarioDto.instructorId) {
          return { tipo: 'instructor', mensaje: 'El instructor ya tiene una clase asignada en este horario' };
        }
        if (conflicto.ambienteId === createHorarioDto.ambienteId) {
          return { tipo: 'ambiente', mensaje: 'El ambiente ya está ocupado en este horario' };
        }
        if (conflicto.fichaId === createHorarioDto.fichaId) {
          return { tipo: 'ficha', mensaje: 'La ficha ya tiene una clase asignada en este horario' };
        }
        return null;
      }).filter(Boolean);

      throw new Error(`Conflicto de horarios: ${conflictosInfo.map(c => c?.mensaje).join(', ')}`);
    }

    return await this.horarioRepository.create(createHorarioDto);
  }

  async update(id: number, updateHorarioDto: UpdateHorarioDto): Promise<Horario | null> {
    const horario = await this.horarioRepository.findById(id);
    if (!horario) {
      throw new Error('Horario no encontrado');
    }

    // Validar que la hora de fin sea mayor que la de inicio
    if (updateHorarioDto.horaFin && updateHorarioDto.horaInicio && 
        updateHorarioDto.horaFin <= updateHorarioDto.horaInicio) {
      throw new Error('La hora de fin debe ser mayor que la hora de inicio');
    }

    // Validar que la duración coincida con las horas
    if (updateHorarioDto.horaFin && updateHorarioDto.horaInicio && updateHorarioDto.duracion &&
        updateHorarioDto.horaFin - updateHorarioDto.horaInicio !== updateHorarioDto.duracion) {
      throw new Error('La duración debe coincidir con la diferencia entre hora de fin e inicio');
    }

    // Verificar que los recursos existan si se están actualizando
    if (updateHorarioDto.fichaId) {
      const ficha = await this.fichaRepository.findById(updateHorarioDto.fichaId);
      if (!ficha) {
        throw new Error('Ficha no encontrada');
      }
    }

    if (updateHorarioDto.instructorId) {
      const instructor = await this.instructorRepository.findById(updateHorarioDto.instructorId);
      if (!instructor) {
        throw new Error('Instructor no encontrado');
      }
    }

    if (updateHorarioDto.ambienteId) {
      const ambiente = await this.ambienteRepository.findById(updateHorarioDto.ambienteId);
      if (!ambiente) {
        throw new Error('Ambiente no encontrado');
      }
    }

    // Validar conflictos
    const conflictos = await this.horarioRepository.findConflicts(
      updateHorarioDto.instructorId || horario.instructorId,
      updateHorarioDto.ambienteId || horario.ambienteId,
      updateHorarioDto.fichaId || horario.fichaId,
      updateHorarioDto.diaSemana || horario.diaSemana,
      updateHorarioDto.horaInicio || horario.horaInicio,
      updateHorarioDto.horaFin || horario.horaFin,
      id
    );

    if (conflictos.length > 0) {
      const conflictosInfo = conflictos.map(conflicto => {
        if (conflicto.instructorId === (updateHorarioDto.instructorId || horario.instructorId)) {
          return { tipo: 'instructor', mensaje: 'El instructor ya tiene una clase asignada en este horario' };
        }
        if (conflicto.ambienteId === (updateHorarioDto.ambienteId || horario.ambienteId)) {
          return { tipo: 'ambiente', mensaje: 'El ambiente ya está ocupado en este horario' };
        }
        if (conflicto.fichaId === (updateHorarioDto.fichaId || horario.fichaId)) {
          return { tipo: 'ficha', mensaje: 'La ficha ya tiene una clase asignada en este horario' };
        }
        return null;
      }).filter(Boolean);

      throw new Error(`Conflicto de horarios: ${conflictosInfo.map(c => c?.mensaje).join(', ')}`);
    }

    return await this.horarioRepository.update(id, updateHorarioDto);
  }

  async delete(id: number): Promise<boolean> {
    const horario = await this.horarioRepository.findById(id);
    if (!horario) {
      throw new Error('Horario no encontrado');
    }

    return await this.horarioRepository.delete(id);
  }

  async getMatrizHorarios(fichaId: number): Promise<{ matriz: any[][]; horarios: Horario[] }> {
    return await this.horarioRepository.getMatrizHorarios(fichaId);
  }
}

