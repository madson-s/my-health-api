import { LoginUserDto } from './dtos/login-user.dto';
import { HashService } from 'src/services/hash.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ValidadeTokenDto } from './dtos/validate-token.dto';
export declare class AuthController {
    private readonly usersService;
    private readonly hashService;
    private readonly authService;
    constructor(usersService: UsersService, hashService: HashService, authService: AuthService);
    loginUser(userData: LoginUserDto): Promise<any>;
    validateToken(body: ValidadeTokenDto): Promise<any>;
    refreshToken(body: RefreshTokenDto): Promise<any>;
}
