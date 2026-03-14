import { CreateAmbienteDto } from './CreateAmbienteDto';

export class UpdateAmbienteDto implements Partial<CreateAmbienteDto> {
  codigo?: string;
  nombre?: string;
  tipo?: string;
  capacidad?: number;
  activo?: boolean;
}
