import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User as UserModel } from '@prisma/client';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignupUserDto } from './dtos/signup-user.dto';
import { GetUserDto } from './dtos/get-user.dto';
import { HashService } from 'src/services/hash.service';
import { MailService } from 'src/services/mail.service';
import { FieldService } from 'src/services/field.service';
import { ResetService } from 'src/reset/reset.service';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';

@Controller('user')
@ApiTags('user')
export class UsersController {
  constructor(
    private readonly hashService: HashService,
    private readonly userService: UsersService,
    private readonly resetService: ResetService,
    private readonly mailService: MailService,
    private readonly fieldService: FieldService,
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

    const userWithoutPassword = this.fieldService.exclude(user, ['password']);

    return userWithoutPassword;
  }

  @Post('forgot-password')
  @ApiResponse({ status: 200, type: GetUserDto })
  async forgotPassword(
    @Body()
    userData: ForgotPasswordDto,
  ): Promise<any> {
    const { email } = userData;

    const user = await this.userService.getUser({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException();
    }

    const { pin } = await this.resetService.crete({ userId: user.id });

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
    userData: UpdatePasswordDto,
  ): Promise<Omit<UserModel, 'password'>> {
    const { password, confirmPassword, pin } = userData;

    if (password !== confirmPassword) {
      throw new BadRequestException();
    }

    const reset = await this.resetService.getReset({ where: { pin } });

    const expiryTime = reset.createdAt.getTime() + reset.expiresIn;

    if (expiryTime < Date.now()) {
      throw new BadRequestException();
    }

    const user = await this.userService.getUser({
      where: { id: reset.userId },
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

    await this.resetService.invalidate({ id: reset.id });

    const userWithoutPassword = this.fieldService.exclude(updatedUser, [
      'password',
    ]);

    return userWithoutPassword;
  }
}
