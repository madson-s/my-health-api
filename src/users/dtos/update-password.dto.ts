import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty()
  pin?: string;

  @ApiProperty()
  confirmPassword: string;

  @ApiProperty()
  password: string;
}
