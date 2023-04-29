import { BadRequestException, Post, Body, Controller } from '@nestjs/common';
import { PinValidateDTO } from './dto/pin-validate.dto';
import { ResetService } from './reset.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('reset')
@ApiTags('reset')
export class ResetController {
  constructor(private readonly resetService: ResetService) {}

  @Post('validate')
  @ApiResponse({ status: 200, type: Boolean })
  async pinValidate(
    @Body()
    body: PinValidateDTO,
  ): Promise<boolean> {
    const { pin } = body;

    const passwordReset = await this.resetService.getReset({
      where: { pin: pin.toLowerCase() },
    });

    if (!passwordReset) {
      throw new BadRequestException();
    }

    const expiryTime =
      passwordReset.createdAt.getTime() + passwordReset.expiresIn;

    if (expiryTime < Date.now()) {
      throw new BadRequestException();
    }

    return true;
  }
}
