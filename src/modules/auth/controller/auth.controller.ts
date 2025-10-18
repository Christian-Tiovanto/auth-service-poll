import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.services';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtTokenResponse } from '../classes/auth.class';
import { ApiTag } from '@app/enums/api-tags';
import { LoginDto } from '../dtos/login.dto';
import { AuthenticateGuard } from '@app/guards/authenticate.guard';
import { SignupDto } from '../dtos/signup.dto';
import { PermissionsMetatada } from '@app/decorators/permission.decorator';
import { UserPermission } from '@app/enums/permission';
import { AuthorizeGuard } from '@app/guards/authorize.guard';

@ApiTags(ApiTag.AUTH)
@Controller('api/v1/auth')
@ApiExtraModels(JwtTokenResponse)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({
    summary: 'Create a User',
  })
  @Post('signup')
  async signup(@Body() signUpDto: SignupDto) {
    return this.authService.signup(signUpDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticateGuard, AuthorizeGuard)
  @PermissionsMetatada(UserPermission.CREATE)
  @ApiOperation({
    summary: 'Create a User',
  })
  @Post('register/admin')
  async registerAdmin(@Body() signUpDto: SignupDto) {
    return this.authService.signup(signUpDto);
  }
}
