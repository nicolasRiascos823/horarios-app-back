import { CreateInstructorDto } from './CreateInstructorDto';

export class UpdateInstructorDto implements Partial<CreateInstructorDto> {
  documento?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  especialidad?: string;
  activo?: boolean;
}
