import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from './entities/curso.entity';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso)
    private cursoRepository: Repository<Curso>,
  ) {}

  create(datos: any) {
    const nuevoCurso = this.cursoRepository.create(datos);
    return this.cursoRepository.save(nuevoCurso);
  }
}