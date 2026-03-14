import { CreateHorarioDto } from './CreateHorarioDto';

export class UpdateHorarioDto implements Partial<CreateHorarioDto> {
  fichaId?: number;
  instructorId?: number;
  ambienteId?: number;
  diaSemana?: number;
  horaInicio?: number;
  horaFin?: number;
  duracion?: number;
}
