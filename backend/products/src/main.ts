import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config } from '@infrastructure/config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix(config.apiPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle(config.swagger.title)
    .setDescription(config.swagger.description)
    .setVersion(config.swagger.version)
    .addTag(config.swagger.tag)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Products API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  await app.listen(config.port);

  console.log(`🚀 ${config.serviceName} is running on: http://localhost:${config.port}`);
  console.log(`📚 Swagger documentation available at: http://localhost:${config.port}/api/docs`);
  console.log(`🔍 Health check: http://localhost:${config.port}/api/health`);
}

bootstrap();
