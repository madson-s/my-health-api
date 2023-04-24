import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/database/prisma.service';
import { HashService } from 'src/services/hash.service';

@Module({
  controllers: [UsersController],
  providers: [HashService, PrismaService, UsersService],
  imports: [],
})
export class UsersModule {}
