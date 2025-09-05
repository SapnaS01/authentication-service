import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../utils/storage';
import { authAPI } from '../services/api';

export function useTokenRefresh() {
  const { logout } = useAuth();

  useEffect(() => {
    const checkTokenExpiry = () => {
      const accessToken = storage.getAccessToken();
      
      if (!accessToken) return;

      try {
        // Decode JWT to check expiry (basic implementation)
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        // Refresh token if it expires in the next 5 minutes
        if (payload.exp - currentTime < 300) {
          authAPI.refreshTokens().catch(() => {
            logout();
          });
        }
      } catch (error) {
        console.error('Token parsing error:', error);
        logout();
      }
    };

    // Check token expiry every minute
    const interval = setInterval(checkTokenExpiry, 60000);
    
    // Check immediately
    checkTokenExpiry();

    return () => clearInterval(interval);
  }, [logout]);
}