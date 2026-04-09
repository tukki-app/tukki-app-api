import { Controller, Post, Body } from '@nestjs/common';
import { LoginUseCase } from '../../../application/use-cases/login.use-case';
import { RegisterUserUseCase } from '../../../application/use-cases/register-user.use-case';
import { LoginDto } from '../../../application/use-cases/dtos/login.dto';
import { RegisterUserDto } from '../../../application/use-cases/dtos/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.loginUseCase.execute(dto);
  }

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    // Note: Registration can also be kept strictly in IdentityController.
    // Exposing it here in AuthController is a common and convenient pattern.
    return await this.registerUserUseCase.execute(dto);
  }
}
