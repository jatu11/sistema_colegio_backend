import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // Le decimos que busque el token en la cabecera de la petición (Bearer Token)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Usamos la misma clave secreta del .env para validar que no sea falso
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  // Si el token es real y no ha expirado, esta función extrae quién es el usuario
  async validate(payload: any) {
    return { id: payload.sub, rol: payload.rol };
  }
}