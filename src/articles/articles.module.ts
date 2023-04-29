import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { PrismaService } from 'src/services/prisma.service';
import { ArticlesService } from './articles.service';

@Module({
  controllers: [ArticlesController],
  providers: [PrismaService, ArticlesService],
})
export class ArticlesModule {}
