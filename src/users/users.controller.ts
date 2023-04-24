import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User as UserModel } from '@prisma/client';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignupUserDto } from './dtos/signup-user.dto';
import { GetUserDto } from './dtos/get-user.dto';
import { excludingFieldsHelper } from 'src/helpers/excluding-fields-helper';

@Controller('user')
@ApiTags('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('')
  @ApiResponse({ status: 200, type: GetUserDto })
  async signupUser(
    @Body()
    userData: SignupUserDto,
  ): Promise<Omit<UserModel, 'password'>> {
    const user = await this.userService.createUser(userData);
    const userWithoutPassword = excludingFieldsHelper.exclude(user, [
      'password',
    ]);
    return userWithoutPassword;
  }
}
