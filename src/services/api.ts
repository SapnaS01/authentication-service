import axios, { AxiosResponse } from 'axios';
import { storage } from '../utils/storage';
import type {
  LoginRequest,
  OTPVerificationRequest,
  SignupRequest,
  RegistrationRequest,
  APIResponse,
  User,
} from '../types/auth';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = storage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = storage.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        storage.setTokens(accessToken, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        storage.clearAll();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  // Login flow
  async sendLoginOTP(data: LoginRequest): Promise<APIResponse> {
    const response: AxiosResponse<APIResponse> = await apiClient.post('/auth/login', data);
    return response.data;
  },

  async verifyLoginOTP(data: OTPVerificationRequest): Promise<{ user: User }> {
    console.log('Verifying login OTP for:', data.phone);
    const response: AxiosResponse<APIResponse<{ user: User }>> = await apiClient.post('/auth/verify-login-otp', data);
    console.log('All response headers:', response.headers);

    // Extract tokens from response headers
    const accessToken = response.headers['x-access-token'];
    const refreshToken = response.headers['x-refresh-token'];
    console.log('Received tokens:', { accessToken, refreshToken });

    if (accessToken && refreshToken) {
      storage.setTokens(accessToken, refreshToken);
    }
    console.log('User data:', response.data.data);
    return response.data.data!;
  },

  // Signup flow
  async sendSignupOTP(data: SignupRequest): Promise<APIResponse> {
    console.log('Sending signup OTP to:', data.phone);
    const response: AxiosResponse<APIResponse> = await apiClient.post('/auth/signup', data);
    return response.data;
  },


// OTP Verification
async verifySignupOTP(data: OTPVerificationRequest): Promise<{ tempToken: string }> {
  const response: AxiosResponse<{ success: boolean; status: string; data: string }> = await apiClient.post('/auth/verify-otp', data);

  const tempToken = response.data.data; // token is in response body
  if (!tempToken) throw new Error('Temp token missing');

  return { tempToken };
},

// Complete Registration
async completeRegistration(data: RegistrationRequest, tempToken: string): Promise<{ user: User }> {
  const response: AxiosResponse<APIResponse<{ user: User }>> = await apiClient.post('/auth/complete-registration', data, {
    headers: {
      'X-Temp-Token': tempToken, // token must be sent in header
    },
  });

  // Extract access & refresh tokens from headers
  const accessToken = response.headers['x-access-token'];
  const refreshToken = response.headers['x-refresh-token'];

  if (accessToken && refreshToken) {
    storage.setTokens(accessToken, refreshToken);
  }

  return response.data.data!;
},


  // OAuth
  async initiateOAuth(provider: string): Promise<{ url: string }> {
    const response: AxiosResponse<APIResponse<{ url: string }>> = await apiClient.get(`/auth/oauth/${provider}`);
    return response.data.data!;
  },

  async handleOAuthCallback(provider: string, code: string): Promise<{ user: User }> {
    const response: AxiosResponse<APIResponse<{ user: User }>> = await apiClient.post(`/auth/oauth/${provider}/callback`, { code });
    
    // Extract tokens from response headers
    const accessToken = response.headers['x-access-token'];
    const refreshToken = response.headers['x-refresh-token'];
    
    if (accessToken && refreshToken) {
      storage.setTokens(accessToken, refreshToken);
    }

    return response.data.data!;
  },

  // Token management
  async refreshTokens(): Promise<void> {
    const refreshToken = storage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response: AxiosResponse<APIResponse<{ accessToken: string; refreshToken: string }>> = 
      await apiClient.post('/auth/refresh', { refreshToken });

    const { accessToken, refreshToken: newRefreshToken } = response.data.data!;
    storage.setTokens(accessToken, newRefreshToken);
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      storage.clearAll();
    }
  },

  // User profile
  async getProfile(): Promise<User> {
    const response: AxiosResponse<APIResponse<{ user: User }>> = await apiClient.get('/auth/profile');
    return response.data.data!.user;
  },
};

export default apiClient;