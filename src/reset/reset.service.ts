import { Injectable } from '@nestjs/common';
import { Prisma, Reset } from '@prisma/client';
import { PrismaService } from 'src/services/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class ResetService {
  constructor(private prisma: PrismaService) {}

  async getReset(params: { where?: Prisma.ResetWhereInput }): Promise<Reset> {
    const { where } = params;

    return this.prisma.reset.findFirst({
      where,
    });
  }

  async invalidate(params: { id: string }): Promise<boolean> {
    const { id } = params;
    await this.prisma.reset.update({
      where: {
        id,
      },
      data: {
        expired: true,
      },
    });

    return true;
  }

  async crete(params: { userId: string }): Promise<Reset> {
    const { userId } = params;

    const oneHourInMilliseconds = 60 * 60 * 1000;

    const pin = randomBytes(3).toString('hex').toLowerCase();

    const transaction = [];

    const createReset = this.prisma.reset.create({
      data: {
        pin,
        userId,
        expiresIn: oneHourInMilliseconds,
      },
    });
    transaction.push(createReset);

    const resetExists = await this.getReset({
      where: { userId, expired: false },
    });

    if (resetExists) {
      const updateReset = this.prisma.reset.update({
        where: {
          id: resetExists.id,
        },
        data: {
          expired: true,
        },
      });
      transaction.push(updateReset);
    }

    const result = await this.prisma.$transaction(transaction);

    return result[0];
  }
}
