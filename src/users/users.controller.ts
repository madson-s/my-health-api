import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User as UserModel } from '@prisma/client';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignupUserDto } from './dtos/signup-user.dto';
import { GetUserDto } from './dtos/get-user.dto';
import { excludingFieldsHelper } from 'src/helpers/excluding-fields-helper';
import { HashService } from 'src/services/hash.service';

@Controller('user')
@ApiTags('user')
export class UsersController {
  constructor(
    private readonly hashService: HashService,
    private readonly userService: UsersService,
  ) {}

  @Post('')
  @ApiResponse({ status: 200, type: GetUserDto })
  async signupUser(
    @Body()
    userData: SignupUserDto,
  ): Promise<Omit<UserModel, 'password'>> {
    const { password } = userData;

    const hashedPassword = await this.hashService.hash(password);

    const user = await this.userService.createUser({
      ...userData,
      password: hashedPassword,
    });

    const userWithoutPassword = excludingFieldsHelper.exclude(user, [
      'password',
    ]);

    return userWithoutPassword;
  }
}
