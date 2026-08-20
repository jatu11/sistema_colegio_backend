import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
// Importamos el guardián del JWT (que ya deberías tener de sesiones previas)
// y nuestros nuevos archivos de roles
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  //Ruta temporal de configuración inicial
 /*  @Get('setup-cargos')
  inicializarSistema() {
    return this.usuariosService.inicializarCargosYPermisos();
  } */

  //Ruta temporal para ascender tu cuenta
  /* @Get('ascender/:cedula')
  ascenderUsuario(@Param('cedula') cedula: string) {
    return this.usuariosService.darPoderesAdmin(cedula);
  } */

  @UseGuards(JwtAuthGuard, RolesGuard) // 1. Exige Token, 2. Exige el Rol
  @Roles('ADMIN')
  @Post()
  create(@Body() createUsuarioDto: any) {
    return this.usuariosService.create(createUsuarioDto);
  }

  /* @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  } */
}
