import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/services/prisma.service';
import { HashService } from 'src/services/hash.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';
import { FieldService } from 'src/services/field.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    UsersService,
    AuthService,
    PrismaService,
    HashService,
    FieldService,
  ],
})
export class AuthModule {}
