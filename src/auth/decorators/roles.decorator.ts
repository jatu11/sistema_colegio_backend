import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from '../../usuarios/entities/usuario.entity'; // Ajusta la ruta si es necesario

// Esta es la llave mágica 'ROLES_KEY' que guardará los roles permitidos
export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolUsuario[] | string[]) => SetMetadata(ROLES_KEY, roles);