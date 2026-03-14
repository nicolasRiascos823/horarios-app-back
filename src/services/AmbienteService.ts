import { AmbienteRepository } from '../repositories/AmbienteRepository';
import { Ambiente } from '../entities/Ambiente';
import { CreateAmbienteDto } from '../dto/CreateAmbienteDto';
import { UpdateAmbienteDto } from '../dto/UpdateAmbienteDto';

export class AmbienteService {
  private ambienteRepository: AmbienteRepository;

  constructor() {
    this.ambienteRepository = new AmbienteRepository();
  }

  async findAll(): Promise<Ambiente[]> {
    return await this.ambienteRepository.findAll();
  }

  async findById(id: number): Promise<Ambiente | null> {
    return await this.ambienteRepository.findById(id);
  }

  async create(createAmbienteDto: CreateAmbienteDto): Promise<Ambiente> {
    // Verificar si el código ya existe
    const existingAmbiente = await this.ambienteRepository.findByCodigo(createAmbienteDto.codigo);
    if (existingAmbiente) {
      throw new Error('Ya existe un ambiente con este código');
    }

    return await this.ambienteRepository.create(createAmbienteDto);
  }

  async update(id: number, updateAmbienteDto: UpdateAmbienteDto): Promise<Ambiente | null> {
    const ambiente = await this.ambienteRepository.findById(id);
    if (!ambiente) {
      throw new Error('Ambiente no encontrado');
    }

    // Verificar si el código ya existe en otro ambiente
    if (updateAmbienteDto.codigo && updateAmbienteDto.codigo !== ambiente.codigo) {
      const codigoExists = await this.ambienteRepository.existsByCodigo(updateAmbienteDto.codigo, id);
      if (codigoExists) {
        throw new Error('Ya existe otro ambiente con este código');
      }
    }

    return await this.ambienteRepository.update(id, updateAmbienteDto);
  }

  async delete(id: number): Promise<boolean> {
    const ambiente = await this.ambienteRepository.findById(id);
    if (!ambiente) {
      throw new Error('Ambiente no encontrado');
    }

    return await this.ambienteRepository.delete(id);
  }
}

