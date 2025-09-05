import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';

interface OTPVerificationProps {
  phone: string;
  mode: 'login' | 'signup';
  onVerify: (otp: string) => Promise<void>;
  onBack: () => void;
  onResend: () => Promise<void>;
}

export default function OTPVerification({ phone, mode, onVerify, onBack, onResend }: OTPVerificationProps) {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (index === 3 && value && newOtp.every(digit => digit)) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (otpCode?: string) => {
    const otpValue = otpCode || otp.join('');
    if (otpValue.length !== 4) {
      setError('Please enter all 4 digits');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await onVerify(otpValue);
      if (mode === 'login') {
        navigate('/welcome');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Invalid verification code');
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await onResend();
      setCountdown(60);
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      setError('Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <button
          onClick={onBack}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        
        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-emerald-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verify Your Phone
        </h2>
        <p className="text-gray-600 mb-1">
          We've sent a 4-digit verification code to
        </p>
        <p className="font-semibold text-gray-900">{phone}</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center space-x-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg transition-all duration-200
                ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'}
                focus:outline-none`}
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-sm text-red-600">{error}</p>
        )}

        <Button
          onClick={() => handleSubmit()}
          loading={isLoading}
          disabled={otp.some(digit => !digit)}
          className="w-full"
          size="lg"
        >
          {mode === 'login' ? 'Sign In' : 'Verify & Continue'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Didn't receive the code?
          </p>
          {countdown > 0 ? (
            <p className="text-sm text-gray-500">
              Resend code in {countdown}s
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}