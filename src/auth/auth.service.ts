import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(params: { where?: Prisma.UserWhereInput }): Promise<User> {
    const { where } = params;
    return this.prisma.user.findFirst({
      where,
    });
  }
}
