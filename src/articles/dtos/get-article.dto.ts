import { ApiProperty } from '@nestjs/swagger';

export class GetArticleDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty()
  title: string;

  @ApiProperty()
  content?: string;

  @ApiProperty()
  status: 'DRAFT' | 'PUBLISHED';

  @ApiProperty()
  authorId?: string;
}
