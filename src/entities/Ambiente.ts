import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('ambientes')
export class Ambiente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  codigo: string;

  @Column()
  nombre: string;

  @Column()
  tipo: string;

  @Column()
  capacidad: number;

  @Column({ default: true })
  activo: boolean;

  @Column({ type: 'datetime', nullable: false, update: false })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany('Horario', 'ambiente')
  horarios: any[];
}
