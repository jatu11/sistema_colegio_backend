import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cargo } from './entities/cargo.entity';

@Module({
  // 👇 Le decimos a este módulo que administre la tabla Cargo
  imports: [TypeOrmModule.forFeature([Cargo])], 
  providers: [],
  controllers: []
})
export class CargosModule {}