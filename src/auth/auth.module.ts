import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/database/prisma.service';
import { HashService } from 'src/services/hash.service';

@Module({
  controllers: [AuthController],
  providers: [PrismaService, HashService, AuthService],
})
export class AuthModule {}
