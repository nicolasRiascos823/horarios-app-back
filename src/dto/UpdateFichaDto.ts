import { CreateFichaDto } from './CreateFichaDto';

export class UpdateFichaDto implements Partial<CreateFichaDto> {
  codigo?: string;
  nombre?: string;
  programa?: string;
  jornada?: 'Diurna' | 'Nocturna' | 'Mixta';
}
