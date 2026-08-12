import { Controller, Post, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  // 🛡️ Este decorador exige que se envíe un Token JWT válido
  @UseGuards(AuthGuard('jwt')) 
  @Post()
  crearCurso(@Body() body: any, @Request() req: any) {
    
    // Verificamos si el usuario que está dentro del token es ADMIN
    const usuarioLogeado = req.user; 
    
    if (usuarioLogeado.rol !== 'ADMIN') {
      throw new UnauthorizedException('No tienes permisos. Solo el Admin puede crear cursos.');
    }

    // Si es ADMIN, pasamos los datos al servicio para que lo guarde en la BD
    return this.cursosService.create(body);
  }
}