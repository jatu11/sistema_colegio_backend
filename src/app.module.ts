import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuariosModule } from './usuarios/usuarios.module';
import { CursosModule } from './cursos/cursos.module';
import { HorariosModule } from './horarios/horarios.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 1. Cargamos la configuración globalmente 
    ConfigModule.forRoot({ 
      isGlobal: true, 
    }), 
    
    // 2. Usamos forRootAsync para esperar a que el .env esté listo
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'), // Lee de Supabase
        autoLoadEntities: true,
        synchronize: true,
        logging: true
      }),
    }),
    
    UsuariosModule,
    CursosModule,
    HorariosModule,
    AuthModule,
  ],
})
export class AppModule {}
