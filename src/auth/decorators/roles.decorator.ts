import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from '../../usuarios/entities/usuario.entity'; // Ajusta la ruta si es necesario

// Esta es la llave mágica 'ROLES_KEY' que guardará los roles permitidos
export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolUsuario[] | string[]) =>
  SetMetadata(ROLES_KEY, roles);
export const PERMISOS_KEY = 'permisos';
// Permite exigir uno o varios permisos a la vez
export const RequirePermisos = (...permisos: string[]) =>
  SetMetadata(PERMISOS_KEY, permisos);
