import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Leemos qué roles exige la ruta (ej: ['ADMIN'])
    const rolesRequeridos = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si la ruta no tiene el decorador @Roles, la dejamos pasar
    if (!rolesRequeridos) {
      return true; 
    }

    // 2. Recuperamos el usuario que ya fue validado por el JwtAuthGuard
    const request = context.switchToHttp().getRequest();
    const usuario = request.user;

    // Si no hay usuario logueado, error
    if (!usuario) {
      throw new ForbiddenException('No tienes permisos para realizar esta acción.');
    }

    // 3. Comparamos el rol del token con los roles exigidos
    const tienePermiso = rolesRequeridos.includes(usuario.rol);
    
    if (!tienePermiso) {
      throw new ForbiddenException(`Acceso Denegado. Se requiere nivel de acceso: ${rolesRequeridos.join(' o ')}`);
    }

    return true;
  }
}