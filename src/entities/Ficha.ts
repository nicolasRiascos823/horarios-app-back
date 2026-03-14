import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany('Horario', 'ficha')
  horarios: any[];
}
