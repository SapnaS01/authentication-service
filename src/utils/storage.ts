import Cookies from 'js-cookie';

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER: 'auth_user',
} as const;

const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  expires: 7, // 7 days
};

export const storage = {
  // Token management
  setTokens(accessToken: string, refreshToken: string) {
    Cookies.set(TOKEN_KEYS.ACCESS_TOKEN, accessToken, {
      ...COOKIE_OPTIONS,
      expires: 1, // 1 day for access token
    });
    Cookies.set(TOKEN_KEYS.REFRESH_TOKEN, refreshToken, COOKIE_OPTIONS);
  },

  getAccessToken(): string | null {
    return Cookies.get(TOKEN_KEYS.ACCESS_TOKEN) || null;
  },

  getRefreshToken(): string | null {
    return Cookies.get(TOKEN_KEYS.REFRESH_TOKEN) || null;
  },

  removeTokens() {
    Cookies.remove(TOKEN_KEYS.ACCESS_TOKEN);
    Cookies.remove(TOKEN_KEYS.REFRESH_TOKEN);
  },

  // User data management
  setUser(user: any) {
    localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(user));
  },

  getUser() {
    const userData = localStorage.getItem(TOKEN_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  },

  removeUser() {
    localStorage.removeItem(TOKEN_KEYS.USER);
  },

  // Clear all auth data
  clearAll() {
    this.removeTokens();
    this.removeUser();
  },
};