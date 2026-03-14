import { IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateHorarioDto {
  @IsNumber()
  @IsNotEmpty()
  fichaId: number;

  @IsNumber()
  @IsNotEmpty()
  instructorId: number;

  @IsNumber()
  @IsNotEmpty()
  ambienteId: number;

  @IsNumber()
  @Min(1)
  @Max(6)
  diaSemana: number; // 1=Lunes, 2=Martes, ..., 6=Sábado

  @IsNumber()
  @Min(6)
  @Max(21)
  horaInicio: number; // Hora en formato 24h (6-21)

  @IsNumber()
  @Min(7)
  @Max(22)
  horaFin: number; // Hora en formato 24h (7-22)

  @IsNumber()
  @Min(1)
  @Max(8)
  duracion: number; // Duración en horas (1-8)
}

