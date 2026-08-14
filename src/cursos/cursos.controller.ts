import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { CursosService } from './cursos.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Get()
  findAll() {
    return this.cursosService.findAll();
  }

  @Post()
  create(@Body() createCursoDto: any) {
    return this.cursosService.create(createCursoDto);
  }

  // 👇 Nueva ruta para Editar
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCursoDto: any) {
    return this.cursosService.update(+id, updateCursoDto);
  }

  // 👇 Nueva ruta para Eliminar
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cursosService.remove(+id);
  }
}
