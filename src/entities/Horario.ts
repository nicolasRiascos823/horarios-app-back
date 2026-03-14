import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';

@Entity('horarios')
@Unique(['instructor', 'diaSemana', 'horaInicio'])
@Unique(['ambiente', 'diaSemana', 'horaInicio'])
@Unique(['ficha', 'diaSemana', 'horaInicio'])
export class Horario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fichaId: number;

  @Column()
  instructorId: number;

  @Column()
  ambienteId: number;

  @Column({ type: 'int' })
  diaSemana: number; // 1=Lunes, 2=Martes, ..., 6=Sábado

  @Column({ type: 'int' })
  horaInicio: number; // Hora en formato 24h (6-22)

  @Column({ type: 'int' })
  horaFin: number; // Hora en formato 24h (6-22)

  @Column({ type: 'int' })
  duracion: number; // Duración en horas

  @Column({ type: 'datetime', nullable: false, update: false })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne('Ficha', 'horarios', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fichaId' })
  ficha: any;

  @ManyToOne('Instructor', 'horarios', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'instructorId' })
  instructor: any;

  @ManyToOne('Ambiente', 'horarios', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ambienteId' })
  ambiente: any;
}
