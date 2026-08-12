import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Curso } from '../../cursos/entities/curso.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export enum DiaSemana {
  LUNES = 'LUNES',
  MARTES = 'MARTES',
  MIERCOLES = 'MIERCOLES',
  JUEVES = 'JUEVES',
  VIERNES = 'VIERNES',
}

@Entity('horarios')
export class Horario {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'enum', enum: DiaSemana })
  dia!: DiaSemana;

  @Column({ type: 'time' })
  horaInicio!: string; // Formato HH:MM

  @Column({ type: 'time' })
  horaFin!: string; // Formato HH:MM

  // Relación: Muchos bloques de horario pertenecen a un Curso
  @ManyToOne(() => Curso)
  curso!: Curso;

  // Relación: Muchos bloques de horario son dictados por un Docente
  @ManyToOne(() => Usuario)
  docente!: Usuario;
}