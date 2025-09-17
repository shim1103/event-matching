// User型定義
export interface User {
  id: number;
  name: string;
  phone_number: string;
  email: string;
  address: string;
  bio: string;
}

// 認証関連
export interface AuthUser extends User {
  isAuthenticated: boolean;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends Omit<User, 'id'> {
  password: string;
  confirmPassword: string;
}