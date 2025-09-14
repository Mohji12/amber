import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import InteractiveButton from '../components/InteractiveButton';
import FeedbackToast from '../components/FeedbackToast';
import LoadingSpinner from '../components/LoadingSpinner';
import { resendOtp } from '../api';

const OtpTestPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');

  const handleResendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setToastMessage('Please enter an email address');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await resendOtp(email);
      
      if (response.message) {
        setToastMessage('OTP resent successfully! Check your email.');
        setToastType('success');
        setShowToast(true);
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
      setIsSubmitting(false);
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
          <h1 className="text-3xl font-bold text-gray-900">OTP Test Page</h1>
          <p className="text-gray-600 mt-2">Test OTP functionality for development</p>
        </div>

        {/* Test Form */}
        <div className="glass rounded-2xl p-8 border border-white/50 hover:border-green-200/50 transition-all duration-300">
          <form onSubmit={handleResendOtp} className="space-y-6">
            {/* Email Field */}
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
                  placeholder="Enter email to test OTP"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <InteractiveButton
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span>Resending OTP...</span>
                </>
              ) : (
                'Resend OTP'
              )}
            </InteractiveButton>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Development Notes:</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• This page is for testing OTP functionality</li>
              <li>• Enter an email that has already signed up</li>
              <li>• The OTP will be sent to the email address</li>
              <li>• Check your email for the verification code</li>
              <li>• Use the OTP in the signup verification flow</li>
            </ul>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-green-600 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
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

export default OtpTestPage; 