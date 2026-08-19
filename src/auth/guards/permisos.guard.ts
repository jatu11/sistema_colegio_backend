import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISOS_KEY } from '../decorators/roles.decorator';

@Injectable()
export class PermisosGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permisosRequeridos = this.reflector.getAllAndOverride<string[]>(PERMISOS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!permisosRequeridos) return true; // Si la ruta no exige permisos, pasa libre

    const request = context.switchToHttp().getRequest();
    const usuario = request.user;

    // Asumiremos que al iniciar sesión, metimos sus permisos en el JWT
    const permisosDelUsuario = usuario.permisos || [];

    // Verificamos que el usuario tenga TODOS los permisos que exige la ruta
    const tienePermiso = permisosRequeridos.every(permiso => permisosDelUsuario.includes(permiso));
    
    if (!tienePermiso) {
      throw new ForbiddenException(`Acceso Denegado. Faltan permisos: ${permisosRequeridos.join(', ')}`);
    }

    return true;
  }
}