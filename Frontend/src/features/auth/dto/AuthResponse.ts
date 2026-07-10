import type {CurrentUser} from "../types/CurrentUser";

export interface AuthResponse {

    accessToken: string;

    refreshToken: string;

    user: CurrentUser;

}