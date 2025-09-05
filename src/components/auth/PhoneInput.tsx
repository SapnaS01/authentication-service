import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { authAPI } from '../../services/api';

const phoneSchema = z.object({
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format'),
});

type PhoneFormData = z.infer<typeof phoneSchema>;

interface PhoneInputProps {
  mode: 'login' | 'signup';
  onSuccess: (phone: string, message?: string) => void;
  onError: (error: string) => void;
}

export default function PhoneInput({ mode, onSuccess, onError }: PhoneInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
  });

  const onSubmit = async (data: PhoneFormData) => {
    if (isLoading || isSubmitted) return;
    
    setIsLoading(true);
    setIsSubmitted(true);
    
    try {
      const response = mode === 'login' 
        ? await authAPI.sendLoginOTP(data)
        : await authAPI.sendSignupOTP(data);
      
      onSuccess(data.phone, response.message);
    } catch (error: any) {
      onError(error.response?.data?.message || `${mode} failed`);
      setIsSubmitted(false); // Reset on error to allow retry
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
          <Phone className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-600">
          {mode === 'login' 
            ? 'Enter your phone number to sign in'
            : 'Enter your phone number to get started'
          }
        </p>
      </div>

      <Input
        {...register('phone')}
        type="tel"
        label="Phone Number"
        placeholder="+1 (555) 123-4567"
        error={errors.phone?.message}
        helperText="Include country code for international numbers"
      />

      <Button
        type="submit"
        loading={isLoading}
        className="w-full"
        size="lg"
      >
        {mode === 'login' ? 'Send Login Code' : 'Send Verification Code'}
      </Button>
    </form>
  );
}