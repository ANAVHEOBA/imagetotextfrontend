export type AccountType = 'Individual' | 'Student' | 'Business' | 'Enterprise';
export type PlanType = 'Free' | 'Pro' | 'Enterprise';

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  account_type: AccountType;
}

export interface User {
  uuid: string;
  email: string;
  full_name: string;
  account_type: AccountType;
  is_verified: boolean;
  conversion_count: number;
  plan: PlanType;
  created_at: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
  message: string;
}

export interface VerifyEmailRequest {
  code: string;
}

export interface VerifyEmailResponse {
  message: string;
  data: null;
} 