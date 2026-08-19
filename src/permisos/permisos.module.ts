import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permiso } from './entities/permiso.entity';

@Module({
  // 👇 Le decimos a este módulo que administre la tabla Permiso
  imports: [TypeOrmModule.forFeature([Permiso])],
  providers: [],
  controllers: []
})
export class PermisosModule {}