import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('instructores')
export class Instructor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  documento: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  telefono?: string;

  @Column()
  especialidad: string;

  @Column({ default: true })
  activo: boolean;

  @Column({ type: 'datetime', nullable: false, update: false })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany('Horario', 'instructor')
  horarios: any[];
}
