export declare class GetArticleDto {
    id: string;
    title: string;
    content?: string;
    status: 'DRAFT' | 'PUBLISHED';
    authorId?: string;
}
