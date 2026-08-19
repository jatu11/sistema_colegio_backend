import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cargo } from 'src/cargos/entities/cargo.entity';

// Evolucionamos los roles para soportar la jerarquía
export enum RolUsuario {
  ADMIN = 'ADMIN', // Rol maestro para ti (Sistemas)
  ADMINISTRACION = 'ADMINISTRACION', // Agrupa a Rector, Vicerrector, Secretaria
  DOCENTE = 'DOCENTE',
  INSPECTOR = 'INSPECTOR',
  CADETE = 'CADETE',
}

@Entity('usuarios') // Nombre de la tabla en Supabase
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  cedula!: string;

  @Column()
  nombres!: string;

  @Column()
  apellidos!: string;

  @Column({ unique: true, nullable: true })
  correo_institucional!: string;

  @Column()
  passwordHash!: string;

  @Column({
    type: 'enum',
    enum: RolUsuario,
    default: RolUsuario.CADETE,
  })
  rol!: RolUsuario;

  // 👇 NUEVOS CAMPOS DE JERARQUÍA

  @ManyToOne(() => Cargo)
  @JoinColumn({ name: 'cargo_id' })
  cargo!: Cargo;

  @Column({ nullable: true })
  area_academica!: string; // Ej: 'Informática', 'Matemática' (Solo se llena si es DOCENTE)

  @Column({ default: true })
  activo!: boolean;

  @CreateDateColumn()
  fechaCreacion!: Date;
}
