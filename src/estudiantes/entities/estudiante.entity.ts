import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('estudiantes')
export class Estudiante {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 10 })
  cedula!: string;

  @Column({ unique: true })
  matricula!: string; // El código naval o institucional del cadete

  @Column()
  nombres!: string;

  @Column()
  apellidos!: string;

  @Column()
  curso!: string; // Ej: '3ro de Bachillerato en Informática'

  @Column({ nullable: true })
  tipoSangre!: string; // Importante para la ficha médica naval

  @Column({ nullable: true })
  nombreRepresentante!: string;

  @Column({ nullable: true })
  telefonoRepresentante!: string;

  @Column({ default: true })
  activo!: boolean; // Para saber si está matriculado actualmente o retirado

  @CreateDateColumn()
  fechaRegistro!: Date;
}