"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesController = void 0;
const common_1 = require("@nestjs/common");
const articles_service_1 = require("./articles.service");
const get_article_dto_1 = require("./dtos/get-article.dto");
const swagger_1 = require("@nestjs/swagger");
const create_article_dto_1 = require("./dtos/create-article.dto");
const update_article_dto_1 = require("./dtos/update-article.dto");
const auth_guard_1 = require("../auth/auth.guard");
let ArticlesController = class ArticlesController {
    constructor(articleService) {
        this.articleService = articleService;
    }
    async getArticles() {
        return this.articleService.articles({});
    }
    async getPublishedArticles() {
        return this.articleService.articles({
            where: { status: 'PUBLISHED' },
        });
    }
    async getArticleById(id) {
        return this.articleService.article({ id });
    }
    async createDraft(articleData) {
        const { title, content, authorId } = articleData;
        const data = {
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
    async updateArticle(id, articleData) {
        const { title, content } = articleData;
        return this.articleService.updatePost({
            where: { id },
            data: { title, content },
        });
    }
    async publishArticle(id) {
        return this.articleService.updatePost({
            where: { id },
            data: { status: 'PUBLISHED' },
        });
    }
};
__decorate([
    (0, common_1.Get)(''),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiResponse)({ status: 200, type: [get_article_dto_1.GetArticleDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "getArticles", null);
__decorate([
    (0, common_1.Get)('feed'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiResponse)({ status: 200, type: [get_article_dto_1.GetArticleDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "getPublishedArticles", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiResponse)({ status: 200, type: get_article_dto_1.GetArticleDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "getArticleById", null);
__decorate([
    (0, common_1.Post)(''),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiResponse)({ status: 200, type: get_article_dto_1.GetArticleDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_article_dto_1.CreateArticleDto]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "createDraft", null);
__decorate([
    (0, common_1.Put)(''),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiResponse)({ status: 200, type: get_article_dto_1.GetArticleDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_article_dto_1.UpdateArticleDto]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "updateArticle", null);
__decorate([
    (0, common_1.Put)('publish/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiResponse)({ status: 200, type: get_article_dto_1.GetArticleDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "publishArticle", null);
ArticlesController = __decorate([
    (0, common_1.Controller)('article'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('article'),
    __metadata("design:paramtypes", [articles_service_1.ArticlesService])
], ArticlesController);
exports.ArticlesController = ArticlesController;
//# sourceMappingURL=articles.controller.js.map