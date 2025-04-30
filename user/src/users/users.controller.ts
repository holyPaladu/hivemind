import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TOPICS } from 'src/kafka/topics';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //! EVENTS SERVICER
  @EventPattern(TOPICS.USER_REGISTERED)
  async handleUserRegisteredEvent(@Payload() message: any): Promise<void> {
    console.log('Received message:', message);
    return this.usersService.handleKafkaUserEvent(message);
  }
}
