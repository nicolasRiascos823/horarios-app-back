import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('fichas')
export class Ficha {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  codigo: string;

  @Column()
  nombre: string;

  @Column()
  programa: string;

  @Column({ type: 'enum', enum: ['Diurna', 'Nocturna', 'Mixta'] })
  jornada: 'Diurna' | 'Nocturna' | 'Mixta';

  @Column({ type: 'datetime', nullable: false, update: false })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany('Horario', 'ficha')
  horarios: any[];
}
