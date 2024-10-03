import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO, userLoginDTO } from './DTO/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() userDTO: UserDTO) {
    return this.auth.register(userDTO);
  }

  @Post('login')
  login(@Body() userDTO: userLoginDTO) {
    return this.auth.login(userDTO);
  }
}
