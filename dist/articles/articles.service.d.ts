import { PrismaService } from '../database/prisma.service';
import { Article, Prisma } from '@prisma/client';
export declare class ArticlesService {
    private prisma;
    constructor(prisma: PrismaService);
    article(articleWhereUniqueInput: Prisma.ArticleWhereUniqueInput): Promise<Article | null>;
    articles(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.ArticleWhereUniqueInput;
        where?: Prisma.ArticleWhereInput;
        orderBy?: Prisma.ArticleOrderByWithRelationInput;
    }): Promise<Article[]>;
    createArticle(data: Prisma.ArticleCreateInput): Promise<Article>;
    updatePost(params: {
        where: Prisma.ArticleWhereUniqueInput;
        data: Prisma.ArticleUpdateInput;
    }): Promise<Article>;
    deletePost(where: Prisma.ArticleWhereUniqueInput): Promise<Article>;
}
