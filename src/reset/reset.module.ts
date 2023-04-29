import { Module } from '@nestjs/common';
import { ResetController } from './reset.controller';
import { ResetService } from './reset.service';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  controllers: [ResetController],
  providers: [PrismaService, ResetService],
})
export class ResetModule {}
