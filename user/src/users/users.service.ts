import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserKafkaDto } from 'src/kafka/dto/event.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async handleKafkaUserEvent(msg: UserKafkaDto): Promise<void> {
    const { id, email } = msg;

    // Проверка на существующего пользователя по id
    let user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      // Если пользователь не найден, создаем нового
      user = this.userRepository.create({ id, email });
      await this.userRepository.save(user);
    } else {
      // Если пользователь найден, обновляем его email
      user.email = email;
      await this.userRepository.save(user);
    }
  }
}
