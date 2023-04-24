import { Body, Controller, Post } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { AuthService } from './auth.service';
import { excludingFieldsHelper } from 'src/helpers/excluding-fields-helper';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUserDto } from 'src/users/dtos/get-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { HashService } from 'src/services/hash.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly hashService: HashService,
    private readonly authService: AuthService,
  ) {}

  @Post('authenticate')
  @ApiResponse({ status: 200, type: GetUserDto })
  async loginUser(
    @Body()
    userData: LoginUserDto,
  ): Promise<any> {
    const { email, password } = userData;
    const user = await this.authService.login({
      where: {
        email,
      },
    });

    const authorized = await this.hashService.compare(password, user.password);

    if (!authorized)
      return {
        statusCode: 401,
        message: 'Usuário ou senha invalido!',
        error: 'Unauthorized',
      };

    const userWithoutPassword = excludingFieldsHelper.exclude(user, [
      'password',
    ]);
    return userWithoutPassword;
  }
}
