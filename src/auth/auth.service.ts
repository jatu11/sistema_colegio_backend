import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService
  ) {}

  async login(cedula: string, contrasenaPlana: string) {
    // 1. Buscamos si existe un cadete, docente o admin con esa cédula
    const usuario = await this.usuariosService.buscarPorCedula(cedula);
    
    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 2. Verificamos si la contraseña plana coincide con el Hash de la base de datos
    const esClaveValida = await bcrypt.compare(contrasenaPlana, usuario.passwordHash);
    
    if (!esClaveValida) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 3. Verificamos que el usuario no haya sido suspendido por la institución
    if (!usuario.activo) {
      throw new UnauthorizedException('Este usuario se encuentra inactivo');
    }

    // 4. Armamos el paquete de información que vivirá dentro del Token
    const payload = { 
      sub: usuario.id, 
      rol: usuario.rol 
    };
    
    // 5. Devolvemos el token firmado y datos básicos para el frontend
    return {
      access_token: await this.jwtService.signAsync(payload),
      usuario: {
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        rol: usuario.rol
      }
    };
  }
}