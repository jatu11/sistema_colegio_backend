import {
  Injectable,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, RolUsuario } from 'src/usuarios/entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import { EntityManager } from 'typeorm';
import { Cargo } from 'src/cargos/entities/cargo.entity';
import { Permiso } from 'src/permisos/entities/permiso.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    //Agregamos el gestor de entidades
    private entityManager: EntityManager,
  ) {}

  // Busca un usuario exacto por su cédula para el login
  async buscarPorCedula(cedula: string) {
    return await this.usuarioRepository.findOne({
      where: { cedula },
      // 👇 Sintaxis moderna de TypeORM 0.3+
      relations: {
        cargo: {
          permisos: true,
        },
      },
    });
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

  // 🚀 LÓGICA DE GENERACIÓN DE CORREO
  async generarCorreoInstitucional(
    nombres: string,
    apellidos: string,
  ): Promise<string> {
    const dominio = '@jatudev.com';

    // 1. Limpiar tildes, eñes y convertir a minúsculas
    const limpiarTexto = (texto: string) =>
      texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ñ/g, 'n')
        .toLowerCase()
        .trim();

    const nombresLimpios = limpiarTexto(nombres).split(' ');
    const apellidosLimpios = limpiarTexto(apellidos).split(' ');

    const primerNombre = nombresLimpios[0];
    const primerApellido = apellidosLimpios[0];
    // Por si acaso tiene un solo apellido registrado
    const segundoApellido =
      apellidosLimpios.length > 1 ? apellidosLimpios[1] : '';

    // 2. Intento 1: Primera letra del nombre + Primer apellido completo
    let correoPropuesto = `${primerNombre.charAt(0)}${primerApellido}${dominio}`;
    let existe = await this.usuarioRepository.findOne({
      where: { correo_institucional: correoPropuesto },
    });

    if (!existe) return correoPropuesto;

    // 3. Intento 2 (Coincidencia): Primera letra nombre + Primer apellido + Primera letra segundo apellido
    const letraSegundoApellido = segundoApellido
      ? segundoApellido.charAt(0)
      : 'x';
    correoPropuesto = `${primerNombre.charAt(0)}${primerApellido}${letraSegundoApellido}${dominio}`;
    existe = await this.usuarioRepository.findOne({
      where: { correo_institucional: correoPropuesto },
    });

    if (!existe) return correoPropuesto;

    // 4. Intento 3 (Red de seguridad): Si increíblemente Juan Perez Sanchez y Jose Perez Silva entraron al sistema...
    // agregamos un número al final para no romper la base de datos.
    let contador = 1;
    let correoSeguro = `${primerNombre.charAt(0)}${primerApellido}${letraSegundoApellido}${contador}${dominio}`;

    while (
      await this.usuarioRepository.findOne({
        where: { correo_institucional: correoSeguro },
      })
    ) {
      contador++;
      correoSeguro = `${primerNombre.charAt(0)}${primerApellido}${letraSegundoApellido}${contador}${dominio}`;
    }

    return correoSeguro;
  }

  // 👇 2. EL NUEVO MÉTODO DE REGISTRO
  async create(createUsuarioDto: any) {
    // A. Verificamos que la cédula no exista para evitar errores SQL feos
    const existeCedula = await this.usuarioRepository.findOne({
      where: { cedula: createUsuarioDto.cedula },
    });
    if (existeCedula) {
      throw new ConflictException(
        'Esta cédula ya se encuentra registrada en el sistema.',
      );
    }

    // B. Generamos el correo institucional mágicamente
    const correoGenerado = await this.generarCorreoInstitucional(
      createUsuarioDto.nombres,
      createUsuarioDto.apellidos,
    );

    // C. Encriptamos la contraseña (Por defecto será su cédula si no envían una)
    const passwordPlana = createUsuarioDto.password || createUsuarioDto.cedula;
    const saltos = 10;
    const passwordHash = await bcrypt.hash(passwordPlana, saltos);

    // D. Preparamos el objeto final
    const nuevoUsuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      correo_institucional: correoGenerado,
      passwordHash: passwordHash,
    });

    try {
      // E. Guardamos en Base de Datos
      const usuarioGuardado: any =
        await this.usuarioRepository.save(nuevoUsuario);

      // F. Retornamos la info, pero ELIMINAMOS el passwordHash por seguridad (para que no viaje al frontend)
      const { passwordHash: _, ...usuarioSinPassword } = usuarioGuardado;
      return {
        mensaje: 'Usuario registrado con éxito',
        usuario: usuarioSinPassword,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al registrar el usuario en la base de datos.',
      );
    }
  }

  // Ejecutar esto UNA SOLA VEZ para configurar el sistema
  async inicializarCargosYPermisos() {
    // 1. Creamos los Permisos Base
    const permMatricular = this.entityManager.create(Permiso, {
      nombre: 'matricular:estudiantes',
      descripcion: 'Matricular en periodo lectivo',
    });
    const permVerGlobal = this.entityManager.create(Permiso, {
      nombre: 'ver:global',
      descripcion: 'Ver todo el personal y cadetes',
    });
    const permUsuarios = this.entityManager.create(Permiso, {
      nombre: 'gestionar:usuarios',
      descripcion: 'Control total de usuarios',
    });
    const permNovedades = this.entityManager.create(Permiso, {
      nombre: 'gestionar:novedades',
      descripcion: 'Crear y editar novedades disciplinarias',
    });

    // Guardamos los permisos en la base de datos
    await this.entityManager.save([
      permMatricular,
      permVerGlobal,
      permUsuarios,
      permNovedades,
    ]);

    // 2. Creamos los Cargos Institucionales y les asignamos sus poderes
    const cargoAdmin = this.entityManager.create(Cargo, {
      nombre: 'Administrador',
      permisos: [permUsuarios, permVerGlobal, permMatricular, permNovedades],
    });

    const cargoRector = this.entityManager.create(Cargo, {
      nombre: 'Rector',
      permisos: [permVerGlobal],
    });

    const cargoSecretaria = this.entityManager.create(Cargo, {
      nombre: 'Secretaria',
      permisos: [permMatricular, permVerGlobal],
    });

    const cargoDocente = this.entityManager.create(Cargo, {
      nombre: 'Docente',
      permisos: [permNovedades],
    });

    // Guardamos los cargos en la base de datos
    await this.entityManager.save([
      cargoAdmin,
      cargoRector,
      cargoSecretaria,
      cargoDocente,
    ]);

    return {
      mensaje: '¡Operación Exitosa! Cargos y Permisos institucionales creados.',
    };
  }

  // 👇 Atajo temporal para ascender a tu usuario principal
  async darPoderesAdmin(cedula: string) {
    // Buscamos a tu usuario
    const usuario = await this.usuarioRepository.findOne({ where: { cedula } });

    // Buscamos el cargo de Administrador (asumiendo que fue el primero en crearse y su ID es 1)
    const cargoAdmin = await this.entityManager.findOne(Cargo, {
      where: { nombre: 'Administrador' },
    });

    if (usuario && cargoAdmin) {
      usuario.cargo = cargoAdmin;
      await this.usuarioRepository.save(usuario);
      return {
        mensaje: `¡Listo! El usuario ${usuario.nombres} ahora es Administrador Supremo.`,
      };
    }

    return { mensaje: 'Error: No se encontró el usuario o el cargo.' };
  }
}
