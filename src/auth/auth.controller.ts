import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() userDTO) {
    return this.auth.register(userDTO);
  }

  @Post('login')
  login(@Body() userDTO) {
    return this.auth.login(userDTO);
  }
}
