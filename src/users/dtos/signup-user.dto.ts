import { ApiProperty } from '@nestjs/swagger';

export class SignupUserDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  confirmPassword: string;

  @ApiProperty()
  bloodType?: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  birthday?: string;

  @ApiProperty()
  permissions?: string[];
}
