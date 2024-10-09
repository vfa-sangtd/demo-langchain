import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomLogger } from './config/logger/custom-logger.service';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { ValidationPipe } from './shared/pipes/validation.pipe';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new CustomLogger(null, { timestamp: true }),
  });

  // Cross-origin resource sharing (CORS) is a mechanism that allows resources
  // to be requested from another domain
  app.enableCors({
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  });

  app.use(
    rateLimit({
      // How long we should remember the requests? - 15 minutes
      windowMs: 15 * 60 * 1000,
      // Limit each IP to 100 requests per windowMs
      max: 100,
    }),
  );
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  // Use DocumentBuilder to create a new Swagger document configuration
  const swaggerConfig = new DocumentBuilder()
    // Set the title of the API
    .setTitle('Demo Langchain API')
    // Set the version of the API
    .setVersion('1.0')
    // Set the description of the API
    .setDescription('Demo API')
    // Build the document
    .build();
  // Create a Swagger document using the application instance
  // and the document configuration
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  // Setup Swagger module with the application instance and the Swagger document
  SwaggerModule.setup('api', app, document);

  // Start the application and listen for requests on port 3000
  await app.listen(3000, '127.0.0.1');
  Logger.log(`Hell-o! ${await app.getUrl()}/api/test`);
}

bootstrap();
