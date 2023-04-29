"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const swagger_1 = require("@nestjs/swagger");
const signup_user_dto_1 = require("./dtos/signup-user.dto");
const get_user_dto_1 = require("./dtos/get-user.dto");
const excluding_fields_helper_1 = require("../helpers/excluding-fields-helper");
const hash_service_1 = require("../services/hash.service");
const mail_service_1 = require("../services/mail.service");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../database/prisma.service");
let UsersController = class UsersController {
    constructor(hashService, userService, mailService, prisma) {
        this.hashService = hashService;
        this.userService = userService;
        this.mailService = mailService;
        this.prisma = prisma;
    }
    async signupUser(userData) {
        const { password } = userData;
        const hashedPassword = await this.hashService.hash(password);
        const user = await this.userService.createUser({
            ...userData,
            password: hashedPassword,
        });
        const userWithoutPassword = excluding_fields_helper_1.excludingFieldsHelper.exclude(user, [
            'password',
        ]);
        return userWithoutPassword;
    }
    async forgotPassword(userData) {
        const { email } = userData;
        const user = await this.userService.getUser({
            where: { email },
        });
        if (!user) {
            throw new common_1.BadRequestException();
        }
        const passwordResetExists = await this.userService.getPin({
            where: { userId: user.id },
        });
        const oneHour = 60 * 60 * 1000;
        const pin = (0, crypto_1.randomBytes)(6).toString('hex');
        if (!passwordResetExists) {
            await this.prisma.passwordReset.create({
                data: {
                    pin,
                    userId: user.id,
                    expiresIn: oneHour,
                },
            });
        }
        else {
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
    async updatePassword(userData) {
        const { password, confirmPassword, pin } = userData;
        if (password !== confirmPassword) {
            throw new common_1.BadRequestException();
        }
        const passwordReset = await this.userService.getPin({ where: { pin } });
        if (passwordReset.expiresIn + passwordReset.createdAt.getTime() >
            Date.now()) {
            throw new common_1.BadRequestException();
        }
        const user = await this.userService.getUser({
            where: { id: passwordReset.userId },
        });
        if (!user) {
            throw new common_1.BadRequestException();
        }
        const hashedPassword = await this.hashService.hash(password);
        const updatedUser = await this.userService.updateUser({
            data: {
                password: hashedPassword,
            },
            where: { id: user.id },
        });
        const userWithoutPassword = excluding_fields_helper_1.excludingFieldsHelper.exclude(updatedUser, [
            'password',
        ]);
        return userWithoutPassword;
    }
};
__decorate([
    (0, common_1.Post)(''),
    (0, swagger_1.ApiResponse)({ status: 200, type: get_user_dto_1.GetUserDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_user_dto_1.SignupUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "signupUser", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiResponse)({ status: 200, type: get_user_dto_1.GetUserDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiResponse)({ status: 200, type: get_user_dto_1.GetUserDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePassword", null);
UsersController = __decorate([
    (0, common_1.Controller)('user'),
    (0, swagger_1.ApiTags)('user'),
    __metadata("design:paramtypes", [hash_service_1.HashService,
        users_service_1.UsersService,
        mail_service_1.MailService,
        prisma_service_1.PrismaService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map