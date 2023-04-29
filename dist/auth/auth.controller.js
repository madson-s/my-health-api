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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const excluding_fields_helper_1 = require("../helpers/excluding-fields-helper");
const swagger_1 = require("@nestjs/swagger");
const login_user_dto_1 = require("./dtos/login-user.dto");
const hash_service_1 = require("../services/hash.service");
const users_service_1 = require("../users/users.service");
const auth_service_1 = require("./auth.service");
const refresh_token_dto_1 = require("./dtos/refresh-token.dto");
const validate_token_dto_1 = require("./dtos/validate-token.dto");
const auth_user_dto_1 = require("./dtos/auth-user.dto");
let AuthController = class AuthController {
    constructor(usersService, hashService, authService) {
        this.usersService = usersService;
        this.hashService = hashService;
        this.authService = authService;
    }
    async loginUser(userData) {
        const { email, password } = userData;
        const user = await this.usersService.getUser({
            where: {
                email,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        const authorized = await this.hashService.compare(password, user.password);
        if (!authorized) {
            throw new common_1.UnauthorizedException();
        }
        const userWithoutPassword = excluding_fields_helper_1.excludingFieldsHelper.exclude(user, [
            'password',
        ]);
        const [access_token, refresh_token] = await this.authService.generateToken(user.id);
        return { ...userWithoutPassword, access_token, refresh_token };
    }
    async validateToken(body) {
        const accessToken = body.access_token;
        if (!accessToken) {
            throw new common_1.UnauthorizedException();
        }
        const userId = this.authService.validadeToken(accessToken);
        if (!userId) {
            throw new common_1.UnauthorizedException();
        }
        const user = await this.usersService.getUser({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        const userWithoutPassword = excluding_fields_helper_1.excludingFieldsHelper.exclude(user, [
            'password',
        ]);
        return userWithoutPassword;
    }
    async refreshToken(body) {
        const refreshToken = body.refresh_token;
        if (!refreshToken) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        const userId = this.authService.validadeToken(refreshToken, {
            isRefresh: true,
        });
        if (!userId) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        const user = await this.usersService.getUser({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        const userWithoutPassword = excluding_fields_helper_1.excludingFieldsHelper.exclude(user, [
            'password',
        ]);
        const [access_token, refresh_token] = await this.authService.generateToken(user.id);
        return { ...userWithoutPassword, access_token, refresh_token };
    }
};
__decorate([
    (0, common_1.Post)('authenticate'),
    (0, swagger_1.ApiResponse)({ status: 200, type: auth_user_dto_1.AuthUserDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginUser", null);
__decorate([
    (0, common_1.Post)('validate'),
    (0, swagger_1.ApiResponse)({ status: 200, type: auth_user_dto_1.AuthUserDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [validate_token_dto_1.ValidadeTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validateToken", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiResponse)({ status: 200, type: auth_user_dto_1.AuthUserDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('auth'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        hash_service_1.HashService,
        auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map