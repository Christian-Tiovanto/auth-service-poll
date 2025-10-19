import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dtos/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from '@app/interfaces/jwt-payload.interface';
import { SignupDto } from '../dtos/signup.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (
      !user ||
      !(await bcrypt.compare(
        loginDto.password.toString(),
        user ? user.password : 'null',
      ))
    )
      throw new UnauthorizedException('Invalid Email | password');
    const payload: JwtPayload = {
      id: user.id,
      fullname: user.fullname,
      // role: user.role,
    };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    return {
      message: 'Login Successfull',
      token,
    };
  }

  async signup(signUpDto: SignupDto) {
    const user = await this.userService.createUser(signUpDto);
    return user;
  }

  async registerAdmin(signUpDto: SignupDto) {
    const user = await this.userService.createUserAdmin(signUpDto);
    return user;
  }
}
