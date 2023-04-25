import { ApiProperty } from '@nestjs/swagger';
import { GetUserDto } from 'src/users/dtos/get-user.dto';

export class AuthUserDto extends GetUserDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token?: string;
}
