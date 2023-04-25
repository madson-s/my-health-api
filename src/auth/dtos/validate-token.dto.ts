import { ApiProperty } from '@nestjs/swagger';

export class ValidadeTokenDto {
  @ApiProperty()
  access_token: string;
}
