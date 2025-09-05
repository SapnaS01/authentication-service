import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import AuthLayout from './AuthLayout';
import PhoneInput from './PhoneInput';
import OTPVerification from './OTPVerification';
import OAuthProviders from './OAuthProviders';

type LoginStep = 'phone' | 'otp';

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>('phone');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const { login, clearError, initiateOAuth } = useAuth();

  const handlePhoneSubmit = (phoneNumber: string, message?: string) => {
    setPhone(phoneNumber);
    setStep('otp');
    setError('');
  };

  const handleOTPVerify = async (otp: string) => {
    try {
      await login(phone, otp);
    } catch (error) {
      throw error;
    }
  };

  const handleResend = async () => {
    await authAPI.sendLoginOTP({ phone });
  };

  const handleOAuthLogin = async (provider: string) => {
    try {
      const oauthUrl = await initiateOAuth(provider);
      window.location.href = oauthUrl;
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleBack = () => {
    setStep('phone');
    setError('');
    clearError();
  };

  return (
    <AuthLayout>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {step === 'phone' && (
        <>
          <PhoneInput
            mode="login"
            onSuccess={handlePhoneSubmit}
            onError={setError}
          />
          <div className="mt-6">
            <OAuthProviders onOAuthLogin={handleOAuthLogin} />
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/auth/signup"
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </>
      )}

      {step === 'otp' && (
        <OTPVerification
          phone={phone}
          mode="login"
          onVerify={handleOTPVerify}
          onBack={handleBack}
          onResend={handleResend}
        />
      )}
    </AuthLayout>
  );
}