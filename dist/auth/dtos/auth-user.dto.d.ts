import { GetUserDto } from 'src/users/dtos/get-user.dto';
export declare class AuthUserDto extends GetUserDto {
    access_token: string;
    refresh_token?: string;
}
