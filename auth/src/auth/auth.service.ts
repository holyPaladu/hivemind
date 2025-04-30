import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from 'src/entities/auth.entity';
import { CreateUserDto, UserDto, UserRegisteredTopicDto } from './dto/user.dto';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { KafkaService } from 'src/kafka/kafka.service';
import { TOPICS } from 'src/kafka/topics';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
    private kafkaService: KafkaService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findByEmailOrThrow(email: string): Promise<User> {
    //! Поиск по email с выбросом при неудачном поиске
    const user = await this.findByEmail(email);
    if (!user)
      throw new NotFoundException({
        field: ['email'],
        message: `Пользователь с email ${email} не найден`,
      });
    return user;
  }

  async create(bd: CreateUserDto): Promise<UserDto> {
    const user = this.userRepo.create(bd);
    return this.userRepo.save(user);
  }

  async register(bd: CreateUserDto): Promise<UserDto> {
    //! Проверка на есть такой пользователь уже
    const existingUser = await this.findByEmail(bd.email);
    if (existingUser)
      throw new ConflictException(`Email ${bd.email} is already taken`);

    //! Хешируем пароль
    const hashedPassword = await bcrypt.hash(bd.password, 10);
    //! Сохраняем пользователя с захешированным паролем
    const newUser = await this.create({
      ...bd,
      password: hashedPassword,
    });
    await this.kafkaService.emit(
      TOPICS.USER_REGISTERED,
      {
        userId: newUser.id,
        email: newUser.email,
      },
      UserRegisteredTopicDto,
    );
    return newUser;
  }

  async login(bd: LoginDto): Promise<LoginResponseDto> {
    let user: User;
    try {
      user = await this.findByEmailOrThrow(bd.email);
    } catch (error) {
      throw new UnauthorizedException({
        field: ['email'],
        message: `Пользователь с email ${bd.email} не найден`,
      });
    }

    const isPasswordValid = await bcrypt.compare(bd.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        field: ['password'],
        message: 'Неверный пароль',
      });
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
