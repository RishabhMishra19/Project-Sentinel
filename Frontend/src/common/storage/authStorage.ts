const REFRESH_TOKEN_KEY = "refreshToken";

export const authStorage = {

    getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    saveRefreshToken(token: string): void {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    },

    removeRefreshToken(): void {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },

};