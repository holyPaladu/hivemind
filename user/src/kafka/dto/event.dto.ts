import { IsString, IsEmail } from 'class-validator';

export class UserKafkaDto {
  @IsString()
  id: string;

  @IsEmail()
  email: string;
}
