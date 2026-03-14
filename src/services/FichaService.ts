import { FichaRepository } from '../repositories/FichaRepository';
import { Ficha } from '../entities/Ficha';
import { CreateFichaDto } from '../dto/CreateFichaDto';
import { UpdateFichaDto } from '../dto/UpdateFichaDto';

export class FichaService {
  private fichaRepository: FichaRepository;

  constructor() {
    this.fichaRepository = new FichaRepository();
  }

  async findAll(): Promise<Ficha[]> {
    return await this.fichaRepository.findAll();
  }

  async findById(id: number): Promise<Ficha | null> {
    return await this.fichaRepository.findById(id);
  }

  async create(createFichaDto: CreateFichaDto): Promise<Ficha> {
    // Verificar si el código ya existe
    const existingFicha = await this.fichaRepository.findByCodigo(createFichaDto.codigo);
    if (existingFicha) {
      throw new Error('Ya existe una ficha con este código');
    }

    return await this.fichaRepository.create(createFichaDto);
  }

  async update(id: number, updateFichaDto: UpdateFichaDto): Promise<Ficha | null> {
    const ficha = await this.fichaRepository.findById(id);
    if (!ficha) {
      throw new Error('Ficha no encontrada');
    }

    // Verificar si el código ya existe en otra ficha
    if (updateFichaDto.codigo && updateFichaDto.codigo !== ficha.codigo) {
      const codigoExists = await this.fichaRepository.existsByCodigo(updateFichaDto.codigo, id);
      if (codigoExists) {
        throw new Error('Ya existe otra ficha con este código');
      }
    }

    return await this.fichaRepository.update(id, updateFichaDto);
  }

  async delete(id: number): Promise<boolean> {
    const ficha = await this.fichaRepository.findById(id);
    if (!ficha) {
      throw new Error('Ficha no encontrada');
    }

    return await this.fichaRepository.delete(id);
  }
}

