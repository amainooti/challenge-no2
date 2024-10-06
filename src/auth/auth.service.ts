import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserDTO, userLoginDTO } from './DTO';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    readonly jwtService: JwtService,
    readonly config: ConfigService,
  ) {}

  async register(userDTO: UserDTO) {
    // hash password
    const hash = await argon2.hash(userDTO.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          name: userDTO.name,
          email: userDTO.email,
          password: hash,
        },
      });
      delete user.password;
      return {
        message: 'User created successfully',
        payload: user,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exist!');
        }
        throw new InternalServerErrorException(
          'An Unexpected Error occured. Please try again later.',
        );
      }
    }
  }

  async login(userDTO: userLoginDTO) {
    try {
      const userExist = await this.prisma.user.findUnique({
        where: {
          email: userDTO.email,
        },
      });
      if (!userExist) throw new NotFoundException('User not found');

      const passwordMatch = await argon2.verify(
        userExist.password,
        userDTO.password,
      );
      if (!passwordMatch)
        throw new ForbiddenException('Password Incorrect, try again.');
      const payload = { email: userExist.email, sub: userExist.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Something happened check back again',
      );
    }
  }
}
