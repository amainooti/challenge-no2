import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  register(userDTO) {
    return 'This is the user';
  }

  login(userDTO) {
    return 'This user login';
  }
}
