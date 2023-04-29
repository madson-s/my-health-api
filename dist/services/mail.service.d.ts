import { MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    private setTransport;
    sendMail(options: any): Promise<boolean>;
}
