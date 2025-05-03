import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, UserDto } from './dto/user.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto, LoginResponseDto } from './dto/login.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'User register' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Successful register' })
  async register(@Body() bd: CreateUserDto): Promise<UserDto> {
    return this.authService.register(bd);
  }

  @Post('login')
  @UseInterceptors(NoFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'User Login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Successful login' })
  async login(@Body() bd: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(bd);
  }
}
