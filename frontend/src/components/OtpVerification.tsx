import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import InteractiveButton from './InteractiveButton';
import FeedbackToast from './FeedbackToast';
import LoadingSpinner from './LoadingSpinner';
import { verifyOtp, resendOtp } from '../api';

interface OtpVerificationProps {
  email: string;
  onBack: () => void;
  onSuccess: (token: string) => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ email, onBack, onSuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
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
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setToastMessage('Please enter the complete 6-digit OTP');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await verifyOtp(email, otpCode);
      
      if (response.access_token) {
        setToastMessage('Email verified successfully! Welcome to Amber Import!');
        setToastType('success');
        setShowToast(true);
        
        // Store token and redirect
        localStorage.setItem('access_token', response.access_token);
        setTimeout(() => {
          onSuccess(response.access_token);
          navigate('/');
        }, 1500);
      } else {
        setToastMessage(response.detail || 'Invalid OTP. Please try again.');
        setToastType('error');
        setShowToast(true);
        // Clear OTP on error
        setOtp(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
      }
    } catch (error) {
      setToastMessage('Verification failed. Please try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      const response = await resendOtp(email);
      
      if (response.message) {
        setToastMessage('OTP resent successfully! Check your email.');
        setToastType('success');
        setShowToast(true);
        
        // Reset timer and OTP
        setTimeLeft(300);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
      } else {
        setToastMessage(response.detail || 'Failed to resend OTP. Please try again.');
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Failed to resend OTP. Please try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-green-200/20 to-emerald-200/20 rounded-full blur-3xl animate-float top-1/4 right-1/4" />
        <div className="absolute w-64 h-64 bg-gradient-to-r from-emerald-200/15 to-green-200/15 rounded-full blur-2xl animate-float bottom-1/4 left-1/4" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Email Verification</h1>
          <p className="text-gray-600 mt-2">Enter the 6-digit code sent to your email</p>
        </div>

        {/* OTP Form */}
        <div className="glass rounded-2xl p-8 border border-white/50 hover:border-green-200/50 transition-all duration-300">
          {/* Email Display */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-green-50 rounded-lg">
              <Mail className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm text-green-800 font-medium">{email}</span>
            </div>
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-3 py-1 bg-orange-50 rounded-full">
              <span className="text-sm font-medium text-orange-700">
                Code expires in: {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter Verification Code
              </label>
              <div className="flex justify-center space-x-2 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder=""
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <InteractiveButton
              variant="primary"
              size="lg"
              disabled={isSubmitting || otp.join('').length !== 6}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Verify Email
                </>
              )}
            </InteractiveButton>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <InteractiveButton
              variant="secondary"
              size="sm"
              disabled={!canResend || isResending}
              onClick={handleResendOtp}
              className="w-full"
            >
              {isResending ? (
                <>
                  <LoadingSpinner size="sm" color="green" />
                  <span>Resending...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resend Code
                </>
              )}
            </InteractiveButton>
          </div>

          {/* Back Button */}
          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="inline-flex items-center text-gray-600 hover:text-green-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Signup
            </button>
          </div>
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

export default OtpVerification; 