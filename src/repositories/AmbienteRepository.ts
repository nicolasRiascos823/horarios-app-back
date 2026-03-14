import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Ambiente } from '../entities/Ambiente';

export class AmbienteRepository {
  private repository: Repository<Ambiente>;

  constructor() {
    this.repository = AppDataSource.getRepository(Ambiente);
  }

  async findAll(): Promise<Ambiente[]> {
    return await this.repository.find({
      relations: ['horarios', 'horarios.ficha', 'horarios.instructor'],
      order: { codigo: 'ASC' }
    });
  }

  async findById(id: number): Promise<Ambiente | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['horarios', 'horarios.ficha', 'horarios.instructor']
    });
  }

  async findByCodigo(codigo: string): Promise<Ambiente | null> {
    return await this.repository.findOne({
      where: { codigo }
    });
  }

  async create(ambienteData: Partial<Ambiente>): Promise<Ambiente> {
    const ambiente = this.repository.create(ambienteData);
    return await this.repository.save(ambiente);
  }

  async update(id: number, ambienteData: Partial<Ambiente>): Promise<Ambiente | null> {
    await this.repository.update(id, ambienteData);
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async existsByCodigo(codigo: string, excludeId?: number): Promise<boolean> {
    const query = this.repository.createQueryBuilder('ambiente')
      .where('ambiente.codigo = :codigo', { codigo });
    
    if (excludeId) {
      query.andWhere('ambiente.id != :excludeId', { excludeId });
    }

    const count = await query.getCount();
    return count > 0;
  }
}

