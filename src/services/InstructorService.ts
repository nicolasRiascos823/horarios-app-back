import { InstructorRepository } from '../repositories/InstructorRepository';
import { Instructor } from '../entities/Instructor';
import { CreateInstructorDto } from '../dto/CreateInstructorDto';
import { UpdateInstructorDto } from '../dto/UpdateInstructorDto';

export class InstructorService {
  private instructorRepository: InstructorRepository;

  constructor() {
    this.instructorRepository = new InstructorRepository();
  }

  async findAll(): Promise<Instructor[]> {
    return await this.instructorRepository.findAll();
  }

  async findById(id: number): Promise<Instructor | null> {
    return await this.instructorRepository.findById(id);
  }

  async create(createInstructorDto: CreateInstructorDto): Promise<Instructor> {
    // Verificar si el documento ya existe
    const existingByDocumento = await this.instructorRepository.findByDocumento(createInstructorDto.documento);
    if (existingByDocumento) {
      throw new Error('Ya existe un instructor con este documento');
    }

    // Verificar si el email ya existe
    const existingByEmail = await this.instructorRepository.findByEmail(createInstructorDto.email);
    if (existingByEmail) {
      throw new Error('Ya existe un instructor con este email');
    }

    return await this.instructorRepository.create(createInstructorDto);
  }

  async update(id: number, updateInstructorDto: UpdateInstructorDto): Promise<Instructor | null> {
    const instructor = await this.instructorRepository.findById(id);
    if (!instructor) {
      throw new Error('Instructor no encontrado');
    }

    // Verificar si el documento ya existe en otro instructor
    if (updateInstructorDto.documento && updateInstructorDto.documento !== instructor.documento) {
      const documentoExists = await this.instructorRepository.existsByDocumento(updateInstructorDto.documento, id);
      if (documentoExists) {
        throw new Error('Ya existe otro instructor con este documento');
      }
    }

    // Verificar si el email ya existe en otro instructor
    if (updateInstructorDto.email && updateInstructorDto.email !== instructor.email) {
      const emailExists = await this.instructorRepository.existsByEmail(updateInstructorDto.email, id);
      if (emailExists) {
        throw new Error('Ya existe otro instructor con este email');
      }
    }

    return await this.instructorRepository.update(id, updateInstructorDto);
  }

  async delete(id: number): Promise<boolean> {
    const instructor = await this.instructorRepository.findById(id);
    if (!instructor) {
      throw new Error('Instructor no encontrado');
    }

    return await this.instructorRepository.delete(id);
  }
}

