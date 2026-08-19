import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Permiso } from '../../permisos/entities/permiso.entity';

@Entity('cargos')
export class Cargo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  nombre!: string; // Ej: 'Secretaria', 'Docente'

  // 👇 Esta es la magia: crea una tabla intermedia 'cargo_permisos' automáticamente
  @ManyToMany(() => Permiso)
  @JoinTable({ name: 'cargo_permisos' })
  permisos!: Permiso[];
}