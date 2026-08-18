import { UserRole } from './user.model';

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  exp: number;
  iat: number;
}
