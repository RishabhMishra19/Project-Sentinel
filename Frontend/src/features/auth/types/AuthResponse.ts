import {CurrentUser} from "./CurrentUser";

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: CurrentUser;
}