import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('cursos')
export class Curso {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  nombre!: string; // Ej: "Programación Orientada a Objetos"

  @Column()
  nivel!: string; // Ej: "3er Año de Bachillerato" u "8vo Año"

  @Column({ nullable: true })
  especialidad!: string; // Ej: "Informática" o nulo si es ciclo básico


  // 👇 Nueva columna para la gestión de horarios
  @Column({ type: 'int', default: 0 })
  horas_semanales!: number;
}
