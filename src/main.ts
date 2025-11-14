import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Genera un estandar sobre la llamada de api
  // tambien funcionaria para versionar
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // quita propiedades extra
      forbidNonWhitelisted: true, // lanza error si llegan props extra
      transform: true,  // convierte tipos (string -> number)
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
