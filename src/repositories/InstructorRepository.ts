import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Instructor } from '../entities/Instructor';

export class InstructorRepository {
  private repository: Repository<Instructor>;

  constructor() {
    this.repository = AppDataSource.getRepository(Instructor);
  }

  async findAll(): Promise<Instructor[]> {
    return await this.repository.find({
      relations: ['horarios', 'horarios.ficha', 'horarios.ambiente'],
      order: { nombre: 'ASC' }
    });
  }

  async findById(id: number): Promise<Instructor | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['horarios', 'horarios.ficha', 'horarios.ambiente']
    });
  }

  async findByDocumento(documento: string): Promise<Instructor | null> {
    return await this.repository.findOne({
      where: { documento }
    });
  }

  async findByEmail(email: string): Promise<Instructor | null> {
    return await this.repository.findOne({
      where: { email }
    });
  }

  async create(instructorData: Partial<Instructor>): Promise<Instructor> {
    const instructor = this.repository.create(instructorData);
    return await this.repository.save(instructor);
  }

  async update(id: number, instructorData: Partial<Instructor>): Promise<Instructor | null> {
    await this.repository.update(id, instructorData);
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async existsByDocumento(documento: string, excludeId?: number): Promise<boolean> {
    const query = this.repository.createQueryBuilder('instructor')
      .where('instructor.documento = :documento', { documento });
    
    if (excludeId) {
      query.andWhere('instructor.id != :excludeId', { excludeId });
    }

    const count = await query.getCount();
    return count > 0;
  }

  async existsByEmail(email: string, excludeId?: number): Promise<boolean> {
    const query = this.repository.createQueryBuilder('instructor')
      .where('instructor.email = :email', { email });
    
    if (excludeId) {
      query.andWhere('instructor.id != :excludeId', { excludeId });
    }

    const count = await query.getCount();
    return count > 0;
  }
}

