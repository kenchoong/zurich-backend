import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    allowedHeaders: '*',
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Zurich API')
    .setDescription('API for zurich assessment')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  // The Swagger UI will be available at the '/api' endpoint
  SwaggerModule.setup('api', app, document);

  const config = app.get<ConfigService>(ConfigService);
  const port = config.get('zurich.port') || 3336;
  await app.listen(port, '0.0.0.0');

  Logger.log(`🚀 Zurich Backend is running on: http://localhost:${port}}`);
}
bootstrap();
