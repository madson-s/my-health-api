import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  private async setTransport() {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID ||
        '447771726838-lgm57bnombccmu9j6vchnf3gs4j88nk3.apps.googleusercontent.com',
      process.env.CLIENT_SECRET || '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',
      'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
      refresh_token:
        process.env.REFRESH_TOKEN ||
        '1//04svz8R-Uv11WCgYIARAAGAQSNwF-L9IrWBuAMdFxC-UuSAxnJJFkPXtSY1bNi3euZr6nadNTAeycISvrAuZqXef80Tsl2aUO6IU',
    });

    const accessToken: string = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject('Failed to create access token :(');
        }
        resolve(token);
      });
    });

    const config: Options = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL || 'myhealthappes2@gmail.com',
        clientId:
          process.env.CLIENT_ID ||
          '447771726838-lgm57bnombccmu9j6vchnf3gs4j88nk3.apps.googleusercontent.com',
        clientSecret:
          process.env.CLIENT_SECRET || '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',
        accessToken,
      },
    };
    this.mailerService.addTransporter('gmail', config);
  }

  public async sendMail(options: any) {
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
    } catch (error) {
      return false;
    }
  }
}
