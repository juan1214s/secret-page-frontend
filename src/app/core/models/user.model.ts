export type UserRole = 'admin' | 'user';

export interface PublicUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface CreateUserDto {
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDto {
  email?: string;
  role?: UserRole;
}
