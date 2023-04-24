import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto {
  @ApiProperty()
  id?: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  permissions?: string[];
}
