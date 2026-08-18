import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// Al heredar de AuthGuard('jwt'), este guardián automáticamente 
// buscará y ejecutará tu archivo jwt.strategy.ts
export class JwtAuthGuard extends AuthGuard('jwt') {}