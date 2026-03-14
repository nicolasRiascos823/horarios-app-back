import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Ficha } from '../entities/Ficha';

export class FichaRepository {
  private repository: Repository<Ficha>;

  constructor() {
    this.repository = AppDataSource.getRepository(Ficha);
  }

  async findAll(): Promise<Ficha[]> {
    return await this.repository.find({
      relations: ['horarios', 'horarios.instructor', 'horarios.ambiente'],
      order: { codigo: 'ASC' }
    });
  }

  async findById(id: number): Promise<Ficha | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['horarios', 'horarios.instructor', 'horarios.ambiente']
    });
  }

  async findByCodigo(codigo: string): Promise<Ficha | null> {
    return await this.repository.findOne({
      where: { codigo }
    });
  }

  async create(fichaData: Partial<Ficha>): Promise<Ficha> {
    const ficha = this.repository.create(fichaData);
    return await this.repository.save(ficha);
  }

  async update(id: number, fichaData: Partial<Ficha>): Promise<Ficha | null> {
    await this.repository.update(id, fichaData);
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async existsByCodigo(codigo: string, excludeId?: number): Promise<boolean> {
    const query = this.repository.createQueryBuilder('ficha')
      .where('ficha.codigo = :codigo', { codigo });
    
    if (excludeId) {
      query.andWhere('ficha.id != :excludeId', { excludeId });
    }

    const count = await query.getCount();
    return count > 0;
  }
}

