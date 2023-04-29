import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto {
  @ApiProperty()
  id?: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  bloodType?: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  birthday?: string;

  @ApiProperty()
  permissions?: string[];
}
