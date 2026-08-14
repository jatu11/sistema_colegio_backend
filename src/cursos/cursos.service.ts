import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
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

  // POST: Crear
  async create(createCursoDto: any) {
    try {
      return await this.cursoRepository.save(createCursoDto);
    } catch (error) {
      // Si PostgreSQL lanza el error 23505 (Duplicado)
      if (error.code === '23505') {
        throw new ConflictException(
          'La asignatura ya existe para este nivel y especialidad.',
        );
      }
      throw new InternalServerErrorException('Error interno del servidor.');
    }
  }

  // GET: Leer
  findAll() {
    return this.cursoRepository.find({ order: { id: 'ASC' } }); // Los ordenamos por ID
  }

  // PUT: Actualizar
  async update(id: number, updateCursoDto: any) {
    try {
      await this.cursoRepository.update(id, updateCursoDto);
      return this.cursoRepository.findOneBy({ id });
    } catch (error) {
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
}
