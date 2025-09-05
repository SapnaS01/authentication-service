import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types/auth';
import { storage } from '../utils/storage';
import { authAPI } from '../services/api';

interface AuthContextType extends AuthState {
  login: (phone: string, otp: string) => Promise<void>;
  signup: (phone: string) => Promise<string>;
  completeRegistration: (data: any, tempToken: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  initiateOAuth: (provider: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_AUTH'; payload: { user: User; accessToken: string; refreshToken: string } }
  | { type: 'CLEAR_AUTH' }
  | { type: 'SET_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_AUTH':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_AUTH':
      return {
        ...initialState,
        isLoading: false,
      };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = storage.getAccessToken();
      const refreshToken = storage.getRefreshToken();
      const user = storage.getUser();

      if (accessToken && refreshToken && user) {
        try {
          // Verify token validity by fetching user profile
          const profile = await authAPI.getProfile();
          dispatch({
            type: 'SET_AUTH',
            payload: { user: profile, accessToken, refreshToken },
          });
        } catch (error) {
          // Token invalid, clear storage
          storage.clearAll();
          dispatch({ type: 'CLEAR_AUTH' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (phone: string, otp: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await authAPI.verifyLoginOTP({ phone, otp });
      
      const accessToken = storage.getAccessToken()!;
      const refreshToken = storage.getRefreshToken()!;
      
      storage.setUser(result.user);
      dispatch({
        type: 'SET_AUTH',
        payload: { user: result.user, accessToken, refreshToken },
      });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Login failed' });
      throw error;
    }
  };

  const signup = async (phone: string): Promise<string> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authAPI.sendSignupOTP({ phone });
      dispatch({ type: 'SET_LOADING', payload: false });
      return response.message || 'OTP sent successfully';
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Signup failed' });
      throw error;
    }
  };

  const completeRegistration = async (data: any, tempToken: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await authAPI.completeRegistration(data, tempToken);
      
      const accessToken = storage.getAccessToken()!;
      const refreshToken = storage.getRefreshToken()!;
      
      storage.setUser(result.user);
      dispatch({
        type: 'SET_AUTH',
        payload: { user: result.user, accessToken, refreshToken },
      });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Registration failed' });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      storage.clearAll();
      dispatch({ type: 'CLEAR_AUTH' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const initiateOAuth = async (provider: string): Promise<string> => {
    try {
      const result = await authAPI.initiateOAuth(provider);
      return result.url;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'OAuth initialization failed' });
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    completeRegistration,
    logout,
    clearError,
    initiateOAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}