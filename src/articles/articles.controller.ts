import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article as ArticleModel } from '@prisma/client';
import { GetArticleDto } from './dtos/get-article.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('article')
@ApiBearerAuth()
@ApiTags('article')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @Get('')
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, type: [GetArticleDto] })
  async getArticles(): Promise<ArticleModel[]> {
    return this.articleService.articles({});
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, type: [GetArticleDto] })
  async getPublishedArticles(): Promise<ArticleModel[]> {
    return this.articleService.articles({
      where: { status: 'PUBLISHED' },
    });
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, type: GetArticleDto })
  async getArticleById(@Param('id') id: string): Promise<ArticleModel> {
    return this.articleService.article({ id });
  }

  @Post('')
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, type: GetArticleDto })
  async createDraft(
    @Body() articleData: CreateArticleDto,
  ): Promise<ArticleModel> {
    const { title, content, authorId } = articleData;
    const data: {
      title: string;
      content: string;
      author?: { connect: { id: string } };
    } = {
      title,
      content,
    };
    if (authorId) {
      data.author = {
        connect: { id: authorId },
      };
    }
    return this.articleService.createArticle(data);
  }

  @Put('')
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, type: GetArticleDto })
  async updateArticle(
    @Param('id') id: string,
    @Body() articleData: UpdateArticleDto,
  ): Promise<ArticleModel> {
    const { title, content } = articleData;
    return this.articleService.updatePost({
      where: { id },
      data: { title, content },
    });
  }

  @Put('publish/:id')
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, type: GetArticleDto })
  async publishArticle(@Param('id') id: string): Promise<ArticleModel> {
    return this.articleService.updatePost({
      where: { id },
      data: { status: 'PUBLISHED' },
    });
  }
}
