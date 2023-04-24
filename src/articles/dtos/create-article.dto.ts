import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  content?: string;

  @ApiProperty()
  authorId?: string;
}
