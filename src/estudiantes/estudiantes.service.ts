import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';

@Injectable()
export class EstudiantesService {
  constructor(
    @InjectRepository(Estudiante)
    private estudianteRepository: Repository<Estudiante>,
  ) {}

  async create(createEstudianteDto: CreateEstudianteDto) {
    // Verificamos que no exista otro cadete con la misma cédula
    const existe = await this.estudianteRepository.findOne({
      where: { cedula: createEstudianteDto.cedula },
    });

    if (existe) {
      throw new BadRequestException(
        'Ya existe un cadete registrado con esta cédula.',
      );
    }

    const nuevoEstudiante =
      this.estudianteRepository.create(createEstudianteDto);
    return await this.estudianteRepository.save(nuevoEstudiante);
  }

  findAll() {
    return this.estudianteRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} estudiante`;
  }

  update(id: number, updateEstudianteDto: UpdateEstudianteDto) {
    return `This action updates a #${id} estudiante`;
  }

  remove(id: number) {
    return `This action removes a #${id} estudiante`;
  }
}
