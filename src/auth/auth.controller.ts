import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { excludingFieldsHelper } from 'src/helpers/excluding-fields-helper';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUserDto } from 'src/users/dtos/get-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { HashService } from 'src/services/hash.service';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('authenticate')
  @ApiResponse({ status: 200, type: GetUserDto })
  async loginUser(
    @Body()
    userData: LoginUserDto,
  ): Promise<any> {
    const { email, password } = userData;
    const user = await this.usersService.getUser({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const authorized = await this.hashService.compare(password, user.password);

    if (!authorized) {
      throw new UnauthorizedException();
    }

    const userWithoutPassword = excludingFieldsHelper.exclude(user, [
      'password',
    ]);

    const access_token = await this.jwtService.signAsync({ sub: user.id });

    return { ...userWithoutPassword, access_token };
  }
}
