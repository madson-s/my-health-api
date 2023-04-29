import { UsersService } from './users.service';
import { User as UserModel } from '@prisma/client';
import { SignupUserDto } from './dtos/signup-user.dto';
import { HashService } from 'src/services/hash.service';
import { MailService } from 'src/services/mail.service';
import { PrismaService } from 'src/database/prisma.service';
export declare class UsersController {
    private readonly hashService;
    private readonly userService;
    private readonly mailService;
    private readonly prisma;
    constructor(hashService: HashService, userService: UsersService, mailService: MailService, prisma: PrismaService);
    signupUser(userData: SignupUserDto): Promise<Omit<UserModel, 'password'>>;
    forgotPassword(userData: {
        email: string;
    }): Promise<any>;
    updatePassword(userData: {
        password: string;
        confirmPassword: string;
        pin: string;
    }): Promise<Omit<UserModel, 'password'>>;
}
