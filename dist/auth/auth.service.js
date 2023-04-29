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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const constants_1 = require("./constants");
let AuthService = class AuthService {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async generateToken(userId) {
        const access_token = await this.jwtService.signAsync({ id: userId });
        const refresh_token = await this.jwtService.signAsync({ id: userId }, { secret: constants_1.jwtConstants.secretRefresh, expiresIn: '1d' });
        return [access_token, refresh_token];
    }
    validadeToken(token, options) {
        const isRefresh = options === null || options === void 0 ? void 0 : options.isRefresh;
        const secret = isRefresh ? constants_1.jwtConstants.secretRefresh : constants_1.jwtConstants.secret;
        const userId = this.jwtService.decode(token)['id'];
        try {
            this.jwtService.verify(token, { secret });
            return userId;
        }
        catch (err) {
            return null;
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map