import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/services/prisma.service';
import { HashService } from 'src/services/hash.service';
import { MailService } from 'src/services/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ResetService } from 'src/reset/reset.service';
import { FieldService } from 'src/services/field.service';

@Module({
  controllers: [UsersController],
  providers: [
    HashService,
    PrismaService,
    UsersService,
    MailService,
    FieldService,
    ResetService,
  ],
  imports: [
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      template: {
        dir: process.cwd() + '/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
})
export class UsersModule {}
