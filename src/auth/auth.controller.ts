import { Body, Controller, Post } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { AuthService } from './auth.service';
import { excludingFieldsHelper } from 'src/helpers/excluding-fields-helper';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUserDto } from 'src/users/dtos/get-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('authenticate')
  @ApiResponse({ status: 200, type: GetUserDto })
  async loginUser(
    @Body()
    userData: LoginUserDto,
  ): Promise<Omit<UserModel, 'password'>> {
    const { email, password } = userData;
    const user = await this.authService.login({
      where: {
        email,
        password,
      },
    });
    const userWithoutPassword = excludingFieldsHelper.exclude(user, [
      'password',
    ]);
    return userWithoutPassword;
  }
}
