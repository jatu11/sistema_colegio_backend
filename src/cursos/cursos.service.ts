import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from './entities/curso.entity';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso)
    private cursoRepository: Repository<Curso>,
  ) {}

  async create(createCursoDto: any) {
    const { nivel, nombre, horas_semanales } = createCursoDto;
    const nombreNormalizado = nombre.toUpperCase();

    // Regla de Ética en 1ro
    if (nivel === '1ro Bachillerato' && nombreNormalizado.includes('ÉTICA')) {
      if (horas_semanales !== 3) {
        throw new BadRequestException(
          'La asignatura de Ética en 1ro de Bachillerato debe tener exactamente 3 horas.',
        );
      }
    }

    // CONTROL DE LÍMITE DE HORAS
    const materiasActuales = await this.cursoRepository.find({
      where: { nivel },
    });
    const totalHorasActuales = materiasActuales.reduce(
      (sum, curso) => sum + curso.horas_semanales,
      0,
    );

    // 🔴 AQUÍ PUEDES CAMBIAR EL 40 POR EL 30 SI EL LÍMITE ESTRICTO ES 30 HORAS PEDAGÓGICAS
    const LIMITE_HORAS = 40;

    if (totalHorasActuales + horas_semanales > LIMITE_HORAS) {
      throw new BadRequestException(
        `El nivel ${nivel} ya tiene ${totalHorasActuales} horas. Sumar ${horas_semanales} excede el límite de ${LIMITE_HORAS} horas semanales.`,
      );
    }

    try {
      return await this.cursoRepository.save(createCursoDto);
    } catch (error: any) {
      if (error.code === '23505')
        throw new ConflictException(
          'La asignatura ya existe para este nivel y figura profesional.',
        );
      throw new InternalServerErrorException('Error interno del servidor.');
    }
  }

  // GET: Leer
  findAll() {
    return this.cursoRepository.find({ order: { nivel: 'ASC', id: 'ASC' } });
  }

  // PUT: Actualizar (Lo usarás para ponerle las horas reales al Tronco Común)
  async update(id: number, updateCursoDto: any) {
    try {
      await this.cursoRepository.update(id, updateCursoDto);
      return this.cursoRepository.findOneBy({ id });
    } catch (error: any) {
      if (error.code === '23505')
        throw new ConflictException(
          'Los nuevos datos chocan con una asignatura existente.',
        );
      throw new InternalServerErrorException('Error al actualizar.');
    }
  } 

  // DELETE: Eliminar
  async remove(id: number) {
    await this.cursoRepository.delete(id);
    return { message: `Asignatura #${id} eliminada correctamente` };
  }

 // 🚀 AUTOGENERADOR: Módulos Técnicos + Tronco Común
  async autoGenerarSoporteInformatico() {
    
    const materiasTecnicas = [
      // ... (Materias de 1RO - Técnicas) ...
      { nombre: 'FUNDAMENTOS DE LAS TECNOLOGÍAS', nivel: '1ro Bachillerato', area: 'Informática', tipo_modulo: 'Módulo General', familia_profesional: 'Tecnologías', figura_profesional: 'Soporte Informático', horas_semanales: 4 },
      { nombre: 'PENSAMIENTO COMPUTACIONAL', nivel: '1ro Bachillerato', area: 'Informática', tipo_modulo: 'Módulo General', familia_profesional: 'Tecnologías', figura_profesional: 'Soporte Informático', horas_semanales: 4 },
      { nombre: 'ÉTICA, LEGISLACIÓN Y CIUDADANÍA DIGITAL', nivel: '1ro Bachillerato', area: 'Informática', tipo_modulo: 'Módulo General', familia_profesional: 'Tecnologías', figura_profesional: 'Soporte Informático', horas_semanales: 3 },
      { nombre: 'SISTEMAS OPERATIVOS Y APLICACIONES', nivel: '1ro Bachillerato', area: 'Informática', tipo_modulo: 'Especialización', familia_profesional: 'Tecnologías', figura_profesional: 'Soporte Informático', horas_semanales: 3 },
      { nombre: 'SOPORTE TÉCNICO INFORMÁTICO', nivel: '1ro Bachillerato', area: 'Informática', tipo_modulo: 'Especialización', familia_profesional: 'Tecnologías', figura_profesional: 'Soporte Informático', horas_semanales: 3 },
      { nombre: 'FUNDAMENTOS BÁSICOS DE ELECTRICIDAD Y ELECTRÓNICA', nivel: '1ro Bachillerato', area: 'Informática', tipo_modulo: 'Especialización', familia_profesional: 'Tecnologías', figura_profesional: 'Soporte Informático', horas_semanales: 4 },
      
      // ... (Materias de 2DO - Técnicas) ...
      { nombre: 'FUNDAMENTOS DE LAS TECNOLOGÍAS', nivel: '2do Bachillerato', area: 'Informática', tipo_modulo: 'Módulo General', familia_profesional: 'Tecnologías', figura_profesional: 'Soporte Informático', horas_semanales: 4 },
      { nombre: 'PENSAMIENTO COMPUTACIONAL', nivel: '2do Bachillerato', area: 'Informática', tipo_modulo: 'Módulo General', familia_profesional: 'Tecnologías', figura_profesional: 'Soporte Informático', horas_semanales: 4 },
      { nombre: 'SISTEMAS OPERATIVOS Y APLICACIONES', nivel: '2do Bachillerato', area: 'Informática', tipo_modulo: 'Especialización', familia_profesional: 'Tecnologías', figura_profesional: 'Soporte Informático', horas_semanales: 2 },
      { nombre: 'MANTENIMIENTO PREVENTIVO Y CORRECTIVO', nivel: '2do Bachillerato', area: 'Informática', tipo_modulo: 'Especialización', familia_profesional: 'Tecnologías', figura_profesional: 'Soporte Informático', horas_semanales: 3 },
      { nombre: 'REDES Y CONECTIVIDAD', nivel: '2do Bachillerato', area: 'Informática', tipo_modulo: 'Especialización', familia_profesional: 'Tecnologías', figura_profesional: 'Soporte Informático', horas_semanales: 3 },
      { nombre: 'SOPORTE TÉCNICO INFORMÁTICO', nivel: '2do Bachillerato', area: 'Informática', tipo_modulo: 'Especialización', familia_profesional: 'Tecnologías', figura_profesional: 'Soporte Informático', horas_semanales: 3 },
      { nombre: 'FUNDAMENTOS BÁSICOS DE ELECTRICIDAD Y ELECTRÓNICA', nivel: '2do Bachillerato', area: 'Informática', tipo_modulo: 'Especialización', familia_profesional: 'Tecnologías', figura_profesional: 'Soporte Informático', horas_semanales: 2 },

      // ... (Materias de 3RO - Técnicas) ...
      { nombre: 'SISTEMAS OPERATIVOS Y APLICACIONES', nivel: '3ro Bachillerato', area: 'Informática', tipo_modulo: 'Especialización', familia_profesional: 'Tecnologías', figura_profesional: 'Soporte Informático', horas_semanales: 4 },
      { nombre: 'MANTENIMIENTO PREVENTIVO Y CORRECTIVO', nivel: '3ro Bachillerato', area: 'Informática', tipo_modulo: 'Especialización', familia_profesional: 'Tecnologías', figura_profesional: 'Soporte Informático', horas_semanales: 4 },
      { nombre: 'REDES Y CONECTIVIDAD', nivel: '3ro Bachillerato', area: 'Informática', tipo_modulo: 'Especialización', familia_profesional: 'Tecnologías', figura_profesional: 'Soporte Informático', horas_semanales: 4 },
      { nombre: 'SOPORTE TÉCNICO INFORMÁTICO', nivel: '3ro Bachillerato', area: 'Informática', tipo_modulo: 'Especialización', familia_profesional: 'Tecnologías', figura_profesional: 'Soporte Informático', horas_semanales: 3 },
      { nombre: 'FUNDAMENTOS BÁSICOS DE ELECTRICIDAD Y ELECTRÓNICA', nivel: '3ro Bachillerato', area: 'Informática', tipo_modulo: 'Especialización', familia_profesional: 'Tecnologías', figura_profesional: 'Soporte Informático', horas_semanales: 2 },
      { nombre: 'PROGRAMACIÓN', nivel: '3ro Bachillerato', area: 'Informática', tipo_modulo: 'Práctico Experimental', familia_profesional: 'Tecnologías', figura_profesional: 'Soporte Informático', horas_semanales: 4 }
    ];

    // TRONCO COMÚN (Se crearán con 0 horas. Luego las editas en el sistema)
    const materiasComunes = ['LENGUA Y LITERATURA', 'MATEMÁTICA', 'HISTORIA', 'EDUCACIÓN PARA LA CIUDADANÍA', 'FILOSOFÍA', 'FÍSICA', 'QUÍMICA', 'BIOLOGÍA', 'INGLÉS', 'EDUCACIÓN FÍSICA', 'EDUCACIÓN CULTURAL Y ARTÍSTICA', 'EMPRENDIMIENTO Y GESTIÓN'];
    const nivelesBachillerato = ['1ro Bachillerato', '2do Bachillerato', '3ro Bachillerato'];
    
    let troncoComun: any[] = [];
    
    for (const nivel of nivelesBachillerato) {
      for (const materia of materiasComunes) {
        troncoComun.push({
          nombre: materia,
          nivel: nivel,
          area: 'Tronco Común', // Se podría hacer un mapa exacto por materia luego
          tipo_modulo: 'Tronco Común',
          familia_profesional: null,
          figura_profesional: null,
          horas_semanales: 0 // 👈 Inicializadas en 0 hasta que conozcas la carga
        });
      }
    }

    const mallaCompleta = [...materiasTecnicas, ...troncoComun];

    for (const materia of mallaCompleta) {
      try {
        await this.cursoRepository.save(materia);
      } catch (error: any) {
        if (error.code !== '23505') console.error(`Error al insertar ${materia.nombre}:`, error);
      }
    }
    
    return { message: 'Malla completa (Técnica y Común) autogenerada con éxito' };
  }
}
