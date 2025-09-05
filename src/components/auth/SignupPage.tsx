// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import { authAPI } from '../../services/api';
// import AuthLayout from './AuthLayout';
// import PhoneInput from './PhoneInput';
// import OTPVerification from './OTPVerification';
// import RegistrationForm from './RegistrationForm';
// import OAuthProviders from './OAuthProviders';

// type SignupStep = 'phone' | 'otp' | 'registration';

// export default function SignupPage() {
//   const [step, setStep] = useState<SignupStep>('phone');
//   const [phone, setPhone] = useState('');
//   const [tempToken, setTempToken] = useState('');
//   const [error, setError] = useState('');
//   const { signup, completeRegistration, clearError, initiateOAuth } = useAuth();

//   const handlePhoneSubmit = async (phoneNumber: string) => {
//     setPhone(phoneNumber);
//     setStep('otp');
//     setError('');
//   };

//   const handleOTPVerify = async (otp: string) => {
//     try {
//       const result = await authAPI.verifySignupOTP({ phone, otp });
//       setTempToken(result.tempToken);
//       setStep('registration');
//     } catch (error) {
//       throw error;
//     }
//   };

//   const handleRegistrationSubmit = async (data: any) => {
//     try {
//       await completeRegistration(data, tempToken);
//     } catch (error) {
//       throw error;
//     }
//   };

//   const handleResend = async () => {
//     await authAPI.sendSignupOTP({ phone });
//   };

//   const handleOAuthLogin = async (provider: string) => {
//     try {
//       const oauthUrl = await initiateOAuth(provider);
//       window.location.href = oauthUrl;
//     } catch (error: any) {
//       setError(error.message);
//     }
//   };

//   const handleBack = () => {
//     if (step === 'otp') {
//       setStep('phone');
//     } else if (step === 'registration') {
//       setStep('otp');
//     }
//     setError('');
//     clearError();
//   };

//   return (
//     <AuthLayout>
//       {error && (
//         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//           <p className="text-sm text-red-600">{error}</p>
//         </div>
//       )}

//       {step === 'phone' && (
//         <>
//           <PhoneInput
//             mode="signup"
//             onSuccess={handlePhoneSubmit}
//             onError={setError}
//           />
//           <div className="mt-6">
//             <OAuthProviders onOAuthLogin={handleOAuthLogin} />
//           </div>
//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">
//               Already have an account?{' '}
//               <Link
//                 to="/auth/login"
//                 className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
//               >
//                 Sign in
//               </Link>
//             </p>
//           </div>
//         </>
//       )}

//       {step === 'otp' && (
//         <OTPVerification
//           phone={phone}
//           mode="signup"
//           onVerify={handleOTPVerify}
//           onBack={handleBack}
//           onResend={handleResend}
//         />
//       )}

//       {step === 'registration' && (
//         <RegistrationForm
//           phone={phone}
//           onSubmit={handleRegistrationSubmit}
//           onBack={handleBack}
//         />
//       )}
//     </AuthLayout>
//   );
// }

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import AuthLayout from './AuthLayout';
import PhoneInput from './PhoneInput';
import OTPVerification from './OTPVerification';
import RegistrationForm from './RegistrationForm';
import OAuthProviders from './OAuthProviders';

type SignupStep = 'phone' | 'otp' | 'registration' | 'success';

export default function SignupPage() {
  const [step, setStep] = useState<SignupStep>('phone');
  const [phone, setPhone] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [error, setError] = useState('');
  const { completeRegistration, clearError, initiateOAuth } = useAuth();

  const handlePhoneSubmit = async (phoneNumber: string) => {
    try {
      await authAPI.sendSignupOTP({ phone: phoneNumber });
      setPhone(phoneNumber);
      setStep('otp');
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    }
  };

  const handleOTPVerify = async (otp: string) => {
    try {
      const result = await authAPI.verifySignupOTP({ phone, otp });
      setTempToken(result.tempToken);
      setStep('registration');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    }
  };

  const handleRegistrationSubmit = async (data: any) => {
    try {
      await completeRegistration(data, tempToken);
      setStep('success'); // ✅ Show success screen
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  const handleResend = async () => {
    try {
      await authAPI.sendSignupOTP({ phone });
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    }
  };

  const handleOAuthLogin = async (provider: string) => {
    try {
      const oauthUrl = await initiateOAuth(provider);
      window.location.href = oauthUrl;
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('phone');
    } else if (step === 'registration') {
      setStep('otp');
    }
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
            mode="signup"
            onSuccess={handlePhoneSubmit}
            onError={setError}
          />
          <div className="mt-6">
            <OAuthProviders onOAuthLogin={handleOAuthLogin} />
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </>
      )}

      {step === 'otp' && (
        <OTPVerification
          phone={phone}
          mode="signup"
          onVerify={handleOTPVerify}
          onBack={handleBack}
          onResend={handleResend}
        />
      )}

      {step === 'registration' && (
        <RegistrationForm
          phone={phone}
          onSubmit={handleRegistrationSubmit}
          onBack={handleBack}
        />
      )}

      {step === 'success' && (
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-2xl">✔</span>
          </div>
          <h2 className="text-2xl font-bold text-green-700">
            Registration Successful 🎉
          </h2>
          <p className="text-gray-600">
            Your account has been created successfully. You can now log in.
          </p>
          <Link
            to="/auth/login"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
