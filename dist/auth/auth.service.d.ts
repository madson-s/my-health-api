import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    generateToken(userId: string): Promise<string[]>;
    validadeToken(token: string, options?: {
        isRefresh?: boolean;
    }): any;
}
