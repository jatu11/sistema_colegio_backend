import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 👇 Esta es la llave mágica que permite la conexión
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
