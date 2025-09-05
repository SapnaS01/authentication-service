import { z } from 'zod';

export const phoneValidation = z.string()
  .min(10, 'Phone number must be at least 10 digits')
  .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format');

export const otpValidation = z.string()
  .length(6, 'OTP must be exactly 6 digits')
  .regex(/^\d+$/, 'OTP must contain only numbers');

export const nameValidation = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name cannot exceed 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

export const emailValidation = z.string()
  .email('Invalid email address');

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Add country code if not present
  if (!cleaned.startsWith('+')) {
    return `+1${cleaned}`;
  }
  
  return cleaned;
}

export function isValidOTP(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}