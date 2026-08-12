import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, RolUsuario } from 'src/usuarios/entities/usuario.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // Busca un usuario exacto por su cédula para el login
  async buscarPorCedula(cedula: string) {
    return this.usuarioRepository.findOne({ where: { cedula } });
  }

  // Método especial para crear el primer administrador del sistema
  async crearAdminInicial(datos: any) {
    const existe = await this.buscarPorCedula(datos.cedula);
    if (existe) {
      throw new BadRequestException('Esta cédula ya está registrada.');
    }

    // La magia de Bcrypt: encriptamos la contraseña con un nivel de salting de 10
    const passwordEncriptada = await bcrypt.hash(datos.password, 10);

    const nuevoAdmin = this.usuarioRepository.create({
      cedula: datos.cedula,
      nombres: datos.nombres,
      apellidos: datos.apellidos,
      passwordHash: passwordEncriptada,
      rol: RolUsuario.ADMIN, // Asignamos el control total
    });

    return this.usuarioRepository.save(nuevoAdmin);
  }
}
