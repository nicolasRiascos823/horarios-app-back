import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CreateFichaDto {
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  programa: string;

  @IsString()
  @IsIn(['Diurna', 'Nocturna', 'Mixta'])
  jornada: 'Diurna' | 'Nocturna' | 'Mixta';
}

