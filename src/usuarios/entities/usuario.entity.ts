import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// Definimos los roles exactos permitidos en el sistema
export enum RolUsuario {
  ADMIN = 'ADMIN',
  DOCENTE = 'DOCENTE',
  CADETE = 'CADETE',
  INSPECTOR = 'INSPECTOR',
  SECRETARIA = 'SECRETARIA',
}

@Entity('usuarios') // Nombre de la tabla en Supabase
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  cedula!: string; // Mejor identificador que el email para instituciones

  @Column()
  nombres!: string;

  @Column()
  apellidos!: string;

  @Column()
  passwordHash!: string; // Aquí guardaremos la contraseña encriptada más adelante

  @Column({
    type: 'enum',
    enum: RolUsuario,
    default: RolUsuario.CADETE,
  })
  rol!: RolUsuario;

  @Column({ default: true })
  activo!: boolean; // Para suspender cuentas sin borrarlas

  @CreateDateColumn()
  fechaCreacion!: Date;
}