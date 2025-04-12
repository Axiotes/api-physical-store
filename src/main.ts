import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ErrorInterceptor } from './common/interceptors/error/error.interceptor';
import { LoggerService } from './common/utils/logger/logger.service';
import { LoggerInterceptor } from './common/interceptors/logger/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ErrorInterceptor());

  const logger = app.get(LoggerService);
  app.useGlobalInterceptors(new LoggerInterceptor(logger));
  
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Physical Store')
    .setDescription(
      'API RESTful desenvolvida para gerenciar lojas físicas de um eCommerce',
    )
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(3000);
}
bootstrap();
