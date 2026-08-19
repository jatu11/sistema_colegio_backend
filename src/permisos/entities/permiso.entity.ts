import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('permisos')
export class Permiso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string; // Ej: 'matricular:estudiantes'

  @Column({ nullable: true })
  descripcion: string; // Ej: 'Permite matricular cadetes en el periodo actual'
}