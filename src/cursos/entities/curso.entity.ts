import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('cursos')
@Unique(['nombre', 'nivel', 'figura_profesional'])
export class Curso {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  nombre!: string; // Ej: "Programación Orientada a Objetos"

  @Column()
  nivel!: string; // Ej: "3er Año de Bachillerato" u "8vo Año"

  @Column({ default: 'Tronco Común' })
  area!: string; // Ej: Matemática, Ciencias Naturales, Informática

  @Column({ default: 'Tronco Común' })
  tipo_modulo!: string; // Ej: General, Especialización, Práctico Experimental

  @Column({ nullable: true })
  familia_profesional!: string; // Ej: Tecnologías

  @Column({ nullable: true })
  figura_profesional!: string; // Ej: Soporte Informático (Nulo si es de EBS)

  // 👇 Nueva columna para la gestión de horarios
  @Column({ type: 'int', default: 0 })
  horas_semanales!: number;
}
