import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { authAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import AuthLayout from './AuthLayout';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      const provider = searchParams.get('provider');
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError('OAuth authentication was cancelled or failed');
        setIsLoading(false);
        return;
      }

      if (!provider || !code) {
        setError('Invalid OAuth callback parameters');
        setIsLoading(false);
        return;
      }

      try {
        const result = await authAPI.handleOAuthCallback(provider, code);
        // Tokens are automatically stored by the API service
        navigate('/dashboard', { replace: true });
      } catch (error: any) {
        setError(error.response?.data?.message || 'OAuth authentication failed');
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Completing Authentication
          </h2>
          <p className="text-gray-600">Please wait while we sign you in...</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="text-center py-8">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Authentication Failed
        </h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => navigate('/auth/login')}
          className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    </AuthLayout>
  );
}