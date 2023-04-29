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
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const googleapis_1 = require("googleapis");
let MailService = class MailService {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async setTransport() {
        const OAuth2 = googleapis_1.google.auth.OAuth2;
        const oauth2Client = new OAuth2(process.env.CLIENT_ID ||
            '447771726838-lgm57bnombccmu9j6vchnf3gs4j88nk3.apps.googleusercontent.com', process.env.CLIENT_SECRET || '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', 'https://developers.google.com/oauthplayground');
        oauth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN ||
                '1//04svz8R-Uv11WCgYIARAAGAQSNwF-L9IrWBuAMdFxC-UuSAxnJJFkPXtSY1bNi3euZr6nadNTAeycISvrAuZqXef80Tsl2aUO6IU',
        });
        const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    reject('Failed to create access token :(');
                }
                resolve(token);
            });
        });
        const config = {
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL || 'myhealthappes2@gmail.com',
                clientId: process.env.CLIENT_ID ||
                    '447771726838-lgm57bnombccmu9j6vchnf3gs4j88nk3.apps.googleusercontent.com',
                clientSecret: process.env.CLIENT_SECRET || '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',
                accessToken,
            },
        };
        this.mailerService.addTransporter('gmail', config);
    }
    async sendMail(options) {
        const { transporterName, to, from, subject, template, context } = options;
        await this.setTransport();
        try {
            const response = await this.mailerService.sendMail({
                transporterName,
                to,
                from,
                subject,
                template,
                context,
            });
            console.log(response);
            return true;
        }
        catch (error) {
            return false;
        }
    }
};
MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mail.service.js.map