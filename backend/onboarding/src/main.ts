import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
      transform: true, // Transforma automáticamente los tipos
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Onboarding Microservice')
    .setDescription(
      'API para gestionar el proceso de onboarding de usuarios. Implementa Clean Architecture con principios SOLID y seguridad basada en JWT.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT emitido por el servicio de autenticación',
      },
      'JWT',
    )
    .addTag('Onboarding', 'Endpoints para gestión de onboarding')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT ?? 3002;
  await app.listen(port);

  logger.log(`🚀 Onboarding Microservice ejecutándose en puerto ${port}`);
  logger.log(`📚 Documentación Swagger disponible en: http://localhost:${port}/api/docs`);
}

bootstrap();
