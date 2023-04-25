import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(userId: string): Promise<string[]> {
    const access_token = await this.jwtService.signAsync({ id: userId });

    const refresh_token = await this.jwtService.signAsync(
      { id: userId },
      { secret: jwtConstants.secretRefresh, expiresIn: '1d' },
    );

    return [access_token, refresh_token];
  }

  validadeToken(token: string, options?: { isRefresh?: boolean }): any {
    const isRefresh = options?.isRefresh;

    const secret = isRefresh ? jwtConstants.secretRefresh : jwtConstants.secret;

    const userId = this.jwtService.decode(token)['id'];

    try {
      this.jwtService.verify(token, { secret });
      return userId;
    } catch (err) {
      // return err;
      return null;
    }
  }
}
