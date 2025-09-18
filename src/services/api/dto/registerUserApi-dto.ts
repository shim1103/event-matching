// ユーザー登録 or 既存ユーザー返却のリクエスト
export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  bio: string;
}

// ユーザー登録 or 既存ユーザー返却のレスポンス
export interface RegisterUserResponse {
  id: string;
  name: string;
  email: string;
}