import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import InteractiveButton from '../components/InteractiveButton';
import FeedbackToast from '../components/FeedbackToast';
import LoadingSpinner from '../components/LoadingSpinner';
import OtpVerification from '../components/OtpVerification';
import { signup } from '../api';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate();

  const validatePasswordStrength = (password: string) => {
    // At least 8 characters, one uppercase, one lowercase, one number, one special character
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return regex.test(password);
  };

  const validateEmail = (email: string) => {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  };
  
  const validateName = (name: string) => {
    return /^[A-Za-z\s]{2,}$/.test(name);
  };
  
  const validateForm = () => {
    const newErrors: any = {};
    if (!validateName(formData.name)) newErrors.name = 'Name is required (letters only, min 2 chars).';
    if (!formData.email) newErrors.email = 'Email is required.';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email address.';
    if (!formData.password) newErrors.password = 'Password is required.';
    else if (!validatePasswordStrength(formData.password)) newErrors.password = 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password.';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    // Terms checkbox
    const termsChecked = (document.getElementById('terms') as HTMLInputElement)?.checked;
    if (!termsChecked) newErrors.terms = 'You must agree to the Terms & Conditions.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setToastMessage('Please fix the errors in the form.');
      setToastType('error');
      setShowToast(true);
      return;
    }
    setPasswordError('');
    setIsSubmitting(true);

    try {
      // Call backend signup API
      const data = await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      
      if (data && data.message) {
        // Success - show OTP verification
        setToastMessage(data.message);
        setToastType('success');
        setShowToast(true);
        setShowOtpVerification(true);
      } else {
        setToastMessage(data?.detail || 'Account creation failed. Please try again.');
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Account creation failed. Please try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSuccess = (token: string) => {
    // Handle successful OTP verification
    setToastMessage('Account created and verified successfully! Welcome to Amber Import!');
    setToastType('success');
    setShowToast(true);
    
    // Clear form data
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    
    // Redirect to home after a delay
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const handleBackToSignup = () => {
    setShowOtpVerification(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Live validation for each field
    if (e.target.name === 'name') {
      if (!validateName(e.target.value)) setErrors((prev: any) => ({ ...prev, name: 'Name is required (letters only, min 2 chars).' }));
      else setErrors((prev: any) => { const { name, ...rest } = prev; return rest; });
    }
    if (e.target.name === 'email') {
      if (!validateEmail(e.target.value)) setErrors((prev: any) => ({ ...prev, email: 'Invalid email address.' }));
      else setErrors((prev: any) => { const { email, ...rest } = prev; return rest; });
    }
    if (e.target.name === 'password') {
      if (!validatePasswordStrength(e.target.value)) setErrors((prev: any) => ({ ...prev, password: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.' }));
      else setErrors((prev: any) => { const { password, ...rest } = prev; return rest; });
    }
    if (e.target.name === 'confirmPassword') {
      if (e.target.value !== formData.password) setErrors((prev: any) => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
      else setErrors((prev: any) => { const { confirmPassword, ...rest } = prev; return rest; });
    }
  };

  // Show OTP verification if needed
  if (showOtpVerification) {
    return (
      <OtpVerification
        email={formData.email}
        onBack={handleBackToSignup}
        onSuccess={handleOtpSuccess}
      />
    );
  }

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
          <Link to="/" className="inline-block mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Amber Global</h1>
            <p className="text-sm text-gray-600">Export-Import Platform</p>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">Join us to access premium export services</p>
        </div>

        {/* Signup Form */}
        <div className="glass rounded-2xl p-8 border border-white/50 hover:border-green-200/50 transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
            </div>

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
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
              {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  placeholder="Confirm your password"
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
              {errors.confirmPassword && <div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <button type="button" className="text-green-600 hover:text-green-500">
                  Terms & Conditions
                </button>{' '}
                and{' '}
                <button type="button" className="text-green-600 hover:text-green-500">
                  Privacy Policy
                </button>
              </label>
            </div>
            {errors.terms && <div className="text-red-500 text-xs ml-4">{errors.terms}</div>}

            {/* Submit Button */}
            <InteractiveButton
              variant="primary"
              size="lg"
              icon={isSubmitting ? undefined : ArrowRight}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span>Creating Account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </InteractiveButton>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-500 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link to="/" className="text-gray-600 hover:text-green-600 transition-colors">
            ← Back to Home
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

export default SignupPage;