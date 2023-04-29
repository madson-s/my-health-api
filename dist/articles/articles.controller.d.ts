import { ArticlesService } from './articles.service';
import { Article as ArticleModel } from '@prisma/client';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';
export declare class ArticlesController {
    private readonly articleService;
    constructor(articleService: ArticlesService);
    getArticles(): Promise<ArticleModel[]>;
    getPublishedArticles(): Promise<ArticleModel[]>;
    getArticleById(id: string): Promise<ArticleModel>;
    createDraft(articleData: CreateArticleDto): Promise<ArticleModel>;
    updateArticle(id: string, articleData: UpdateArticleDto): Promise<ArticleModel>;
    publishArticle(id: string): Promise<ArticleModel>;
}
