import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dtos/login-user.dto';
import { HashService } from 'src/services/hash.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ValidadeTokenDto } from './dtos/validate-token.dto';
import { AuthUserDto } from './dtos/auth-user.dto';
import { FieldService } from 'src/services/field.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly fieldService: FieldService,
    private readonly authService: AuthService,
  ) {}

  @Post('authenticate')
  @ApiResponse({ status: 200, type: AuthUserDto })
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

    const userWithoutPassword = this.fieldService.exclude(user, ['password']);

    const [access_token, refresh_token] = await this.authService.generateToken(
      user.id,
    );

    return { ...userWithoutPassword, access_token, refresh_token };
  }

  @Post('validate')
  @ApiResponse({ status: 200, type: AuthUserDto })
  async validateToken(@Body() body: ValidadeTokenDto): Promise<any> {
    const accessToken = body.access_token;

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    const userId = this.authService.validadeToken(accessToken);

    if (!userId) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.getUser({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const userWithoutPassword = this.fieldService.exclude(user, ['password']);

    return userWithoutPassword;
  }

  @Post('refresh')
  @ApiResponse({ status: 200, type: AuthUserDto })
  async refreshToken(@Body() body: RefreshTokenDto): Promise<any> {
    const refreshToken = body.refresh_token;

    if (!refreshToken) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const userId = this.authService.validadeToken(refreshToken, {
      isRefresh: true,
    });

    if (!userId) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const user = await this.usersService.getUser({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const userWithoutPassword = this.fieldService.exclude(user, ['password']);

    const [access_token, refresh_token] = await this.authService.generateToken(
      user.id,
    );

    return { ...userWithoutPassword, access_token, refresh_token };
  }
}
