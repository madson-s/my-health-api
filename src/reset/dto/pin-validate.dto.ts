import { ApiProperty } from '@nestjs/swagger';

export class PinValidateDTO {
  @ApiProperty()
  pin?: string;
}
