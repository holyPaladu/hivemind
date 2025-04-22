import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Documentations')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, documentFactory);

  // Подключаем Kafka как микросервис
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'auht-service',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'auth-consumer',
      },
    },
  });

  await app.startAllMicroservices(); // Запуск Kafka
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
