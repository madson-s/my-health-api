import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User as UserModel } from '@prisma/client';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignupUserDto } from './dtos/signup-user.dto';
import { GetUserDto } from './dtos/get-user.dto';
import { excludingFieldsHelper } from 'src/helpers/excluding-fields-helper';
import { HashService } from 'src/services/hash.service';
import { MailService } from 'src/services/mail.service';
import { randomBytes } from 'crypto';
import { PrismaService } from 'src/database/prisma.service';

@Controller('user')
@ApiTags('user')
export class UsersController {
  constructor(
    private readonly hashService: HashService,
    private readonly userService: UsersService,
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
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

  @Post('forgot-password')
  @ApiResponse({ status: 200, type: GetUserDto })
  async forgotPassword(
    @Body()
    userData: {
      email: string;
    },
  ): Promise<any> {
    const { email } = userData;

    const user = await this.userService.getUser({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException();
    }

    const passwordResetExists = await this.userService.getPin({
      where: { userId: user.id },
    });

    const oneHour = 60 * 60 * 1000;

    const pin = randomBytes(6).toString('hex');

    if (!passwordResetExists) {
      await this.prisma.passwordReset.create({
        data: {
          pin,
          userId: user.id,
          expiresIn: oneHour,
        },
      });
    } else {
      await this.prisma.passwordReset.update({
        where: {
          id: passwordResetExists.id,
        },
        data: {
          pin,
          expiresIn: oneHour,
        },
      });
    }

    const options = {
      transporterName: 'gmail',
      to: user.email,
      from: process.env.EMAIL || 'myhealthappes2@gmail.com',
      subject: 'Código de Verificação - MyHealth',
      template: 'password-reset',
      context: { pin },
    };
    await this.mailService.sendMail(options);
  }

  @Post('reset-password')
  @ApiResponse({ status: 200, type: GetUserDto })
  async updatePassword(
    @Body()
    userData: {
      password: string;
      confirmPassword: string;
      pin: string;
    },
  ): Promise<Omit<UserModel, 'password'>> {
    const { password, confirmPassword, pin } = userData;

    if (password !== confirmPassword) {
      throw new BadRequestException();
    }

    const passwordReset = await this.userService.getPin({ where: { pin } });

    if (
      passwordReset.expiresIn + passwordReset.createdAt.getTime() >
      Date.now()
    ) {
      throw new BadRequestException();
    }

    const user = await this.userService.getUser({
      where: { id: passwordReset.userId },
    });

    if (!user) {
      throw new BadRequestException();
    }

    const hashedPassword = await this.hashService.hash(password);

    const updatedUser = await this.userService.updateUser({
      data: {
        password: hashedPassword,
      },
      where: { id: user.id },
    });

    const userWithoutPassword = excludingFieldsHelper.exclude(updatedUser, [
      'password',
    ]);

    return userWithoutPassword;
  }
}
