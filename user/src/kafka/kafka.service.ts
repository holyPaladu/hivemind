// src/kafka/kafka.service.ts
import {
  Injectable,
  Inject,
  Logger,
  OnModuleInit,
  BadRequestException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { validateOrReject } from 'class-validator';

@Injectable()
export class KafkaService implements OnModuleInit {
  private readonly logger = new Logger(KafkaService.name);

  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
    this.logger.log('Kafka client connected');
  }

  async emit<T extends object>(topic: string, payload: T, Dto?: new () => T) {
    try {
      if (Dto) {
        const dtoInstance = Object.assign(new Dto(), payload);
        await validateOrReject(dtoInstance);
      }

      this.kafkaClient.emit(topic, payload);
      this.logger.log(`Kafka event emitted: ${topic}`, JSON.stringify(payload));
    } catch (err) {
      this.logger.error(`Failed to emit Kafka event: ${topic}`, err);
      throw new BadRequestException('Invalid Kafka payload');
    }
  }
}
