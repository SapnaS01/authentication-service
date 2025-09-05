import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const registrationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  phone: string;
  onSubmit: (data: RegistrationFormData) => Promise<void>;
  onBack: () => void;
}

export default function RegistrationForm({ phone, onSubmit, onBack }: RegistrationFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const handleFormSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);
    try {
      await onSubmit({ ...data });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-purple-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Complete Your Profile
        </h2>
        <p className="text-gray-600">
          Just a few more details to get started
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          {...register('firstName')}
          label="First Name"
          placeholder="Enter your first name"
          error={errors.firstName?.message}
        />
        <Input
          {...register('lastName')}
          label="Last Name"
          placeholder="Enter your last name"
          error={errors.lastName?.message}
        />
        <Input
          {...register('email')}
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          error={errors.email?.message}
        />

        <div className="pt-2">
          <Button type="submit" loading={isLoading} className="w-full" size="lg">
            Complete Registration
          </Button>
        </div>
      </form>
      
    </div>
  );
}