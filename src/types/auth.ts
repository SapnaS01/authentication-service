export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  phone: string;
}

export interface OTPVerificationRequest {
  phone: string;
  otp: string;
}

export interface SignupRequest {
  phone: string;
}

export interface RegistrationRequest {
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type AuthStep = 'phone' | 'otp' | 'registration' | 'complete';
export type AuthMode = 'login' | 'signup';