import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export enum UserRole {
  CLIENT = 'client',
  FREELANCER = 'freelancer',
  GUEST = 'guest',
}

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ example: '12345678', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password: string;

  @ApiProperty({
    enum: UserRole,
    description: 'User role',
    example: UserRole.CLIENT,
  })
  @IsEnum(UserRole)
  role: UserRole;
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  password?: string;

  @ApiProperty({
    enum: UserRole,
    description: 'User role',
    example: UserRole.CLIENT,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

export class UserRegisteredTopicDto {
  @IsString()
  userId: string;

  @IsEmail()
  email: string;
}

export class UserDto {
  id: string;
  email?: string;
  password: string;
  role: 'client' | 'freelancer' | 'guest';
}
