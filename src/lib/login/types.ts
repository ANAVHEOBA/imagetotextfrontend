export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  uuid: string;
  email: string;
  full_name: string;
  account_type: string;
  is_verified: boolean;
  conversion_count: number;
  plan: string;
  created_at: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  message: string;
  refresh_token?: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
} 