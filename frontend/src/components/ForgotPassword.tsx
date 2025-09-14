import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, RefreshCw, CheckCircle, XCircle, Lock, Eye, EyeOff } from 'lucide-react';
import InteractiveButton from './InteractiveButton';
import FeedbackToast from './FeedbackToast';
import LoadingSpinner from './LoadingSpinner';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { forgotPassword, resetPassword } from '../api';

interface ForgotPasswordProps {
  onBack: () => void;
  onSuccess: (token: string) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    if (step === 'otp' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, step]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setToastMessage('Please enter your email address.');
      setToastType('error');
      setShowToast(true);
      return;
    }

    if (!validateEmail(email)) {
      setToastMessage('Please enter a valid email address.');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await forgotPassword(email);
      setStep('otp');
      setTimeLeft(300);
      setCanResend(false);
      setToastMessage('Password reset OTP sent! Please check your email.');
      setToastType('success');
      setShowToast(true);
    } catch (error: any) {
      setToastMessage(error.message || 'Failed to send password reset email.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setToastMessage('Please enter the complete 6-digit verification code.');
      setToastType('error');
      setShowToast(true);
      return;
    }

    if (!/^\d{6}$/.test(otpCode)) {
      setToastMessage('Please enter only numbers in the verification code.');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setStep('password');
  };

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push("At least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("One uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("One lowercase letter");
    }
    if (!/\d/.test(password)) {
      errors.push("One number");
    }
    if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
      errors.push("One special character");
    }
    return errors;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced password validation
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setToastMessage(`Password requirements: ${passwordErrors.join(', ')}`);
      setToastType('error');
      setShowToast(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setToastMessage('Passwords do not match.');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const otpCode = otp.join('');
      const data = await resetPassword(email, otpCode, newPassword, confirmPassword);
      
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        setToastMessage('Password reset successful! You are now logged in.');
        setToastType('success');
        setShowToast(true);
        
        setTimeout(() => {
          onSuccess(data.access_token);
        }, 1500);
      }
    } catch (error: any) {
      setToastMessage(error.message || 'Failed to reset password.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      await forgotPassword(email);
      setTimeLeft(300);
      setCanResend(false);
      setToastMessage('New OTP sent! Please check your email.');
      setToastType('success');
      setShowToast(true);
    } catch (error: any) {
      setToastMessage(error.message || 'Failed to resend OTP.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsResending(false);
    }
  };

  const renderEmailStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
        <p className="text-gray-600">Enter your email address to receive a password reset code</p>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-6">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
              placeholder="Enter your email address"
              required
            />
          </div>
        </div>

        <InteractiveButton
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" color="white" />
              <span>Sending Reset Code...</span>
            </>
          ) : (
            'Send Reset Code'
          )}
        </InteractiveButton>
      </form>
    </div>
  );

  const renderOtpStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Reset Code</h2>
        <p className="text-gray-600">We've sent a 6-digit code to {email}</p>
      </div>

      <form onSubmit={handleOtpSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Verification Code
          </label>
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                data-index={index}
                className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              />
            ))}
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="text-sm text-gray-600">
            Code expires in: <span className="font-semibold text-red-500">{formatTime(timeLeft)}</span>
          </div>
          
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={!canResend || isResending}
            className="text-sm text-green-600 hover:text-green-500 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
          >
            {isResending ? (
              <>
                <LoadingSpinner size="xs" color="green" />
                <span>Resending...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                <span>Resend Code</span>
              </>
            )}
          </button>
        </div>

        <InteractiveButton
          variant="primary"
          size="lg"
          disabled={otp.join('').length !== 6}
          className="w-full"
        >
          Verify Code
        </InteractiveButton>
      </form>
    </div>
  );

  const renderPasswordStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Password</h2>
        <p className="text-gray-600">Enter your new password below</p>
      </div>

      <form onSubmit={handlePasswordSubmit} className="space-y-6">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
                         <input
               type={showNewPassword ? 'text' : 'password'}
               value={newPassword}
               onChange={(e) => setNewPassword(e.target.value)}
               className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
               placeholder="Enter new password"
               required
             />
             <button
               type="button"
               onClick={() => setShowNewPassword(!showNewPassword)}
               className="absolute inset-y-0 right-0 pr-3 flex items-center"
             >
               {showNewPassword ? (
                 <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
               ) : (
                 <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
               )}
             </button>
           </div>
           
           {/* Password Strength Indicator */}
           {newPassword && <PasswordStrengthIndicator password={newPassword} />}
         </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <InteractiveButton
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" color="white" />
              <span>Resetting Password...</span>
            </>
          ) : (
            'Reset Password'
          )}
        </InteractiveButton>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-green-200/20 to-emerald-200/20 rounded-full blur-3xl animate-float top-1/4 left-1/4" />
        <div className="absolute w-64 h-64 bg-gradient-to-r from-emerald-200/15 to-green-200/15 rounded-full blur-2xl animate-float bottom-1/4 right-1/4" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <button
            onClick={onBack}
            className="inline-flex items-center text-gray-600 hover:text-green-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Login
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Amber Global</h1>
          <p className="text-sm text-gray-600">Export-Import Platform</p>
        </div>

        {/* Form Container */}
        <div className="glass rounded-2xl p-8 border border-white/50 hover:border-green-200/50 transition-all duration-300">
          {step === 'email' && renderEmailStep()}
          {step === 'otp' && renderOtpStep()}
          {step === 'password' && renderPasswordStep()}
        </div>
      </div>

      <FeedbackToast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default ForgotPassword; 