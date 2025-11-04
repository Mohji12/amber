import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import InteractiveButton from '../components/InteractiveButton';
import FeedbackToast from '../components/FeedbackToast';
import LoadingSpinner from '../components/LoadingSpinner';
import ForgotPassword from '../components/ForgotPassword';
import { login } from '../api';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [errors, setErrors] = useState<any>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  };
  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.email) newErrors.email = 'Email is required.';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email address.';
    if (!formData.password) newErrors.password = 'Password is required.';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
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
    setIsSubmitting(true);

    try {
      const data = await login(formData.email, formData.password);
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        
        // Store user type and other relevant data
        if (data.user_type) {
          localStorage.setItem('user_type', data.user_type);
        }
        if (data.admin_id) {
          localStorage.setItem('admin_id', data.admin_id.toString());
        }
        if (data.role) {
          localStorage.setItem('user_role', data.role);
        }
        
        setToastMessage('Login successful! Welcome back.');
        setToastType('success');
        setShowToast(true);
        
        // Redirect based on user type after a short delay
        setTimeout(() => {
          if (data.user_type === 'admin') {
            navigate('/admin');
          } else {
            navigate('/profile');
          }
        }, 1200);
      } else {
        // Handle specific error messages from backend
        const errorMessage = data.detail || 'Login failed. Please check your email and password.';
        setToastMessage(errorMessage);
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Login failed. Please check your credentials.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Live validation for each field
    if (e.target.name === 'email') {
      if (!validateEmail(e.target.value)) setErrors((prev: any) => ({ ...prev, email: 'Invalid email address.' }));
      else setErrors((prev: any) => { const { email, ...rest } = prev; return rest; });
    }
    if (e.target.name === 'password') {
      if (e.target.value.length < 6) setErrors((prev: any) => ({ ...prev, password: 'Password must be at least 6 characters.' }));
      else setErrors((prev: any) => { const { password, ...rest } = prev; return rest; });
    }
  };

  // Show forgot password component if requested
  if (showForgotPassword) {
    return (
      <ForgotPassword
        onBack={() => setShowForgotPassword(false)}
        onSuccess={(token) => {
          setShowForgotPassword(false);
          navigate('/profile');
        }}
      />
    );
  }

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
          <Link to="/" className="inline-block mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Amber Global</h1>
            <p className="text-sm text-gray-600">Export-Import Platform</p>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <div className="glass rounded-2xl p-8 border border-white/50 hover:border-green-200/50 transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
              </div>
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
                  placeholder="Enter your password"
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
                {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <button 
                type="button" 
                className="text-sm text-green-600 hover:text-green-500"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot password?
              </button>
            </div>

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
                  <span>Signing In...</span>
                </>
              ) : (
                'Sign In'
              )}
            </InteractiveButton>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-green-600 hover:text-green-500 font-medium transition-colors">
                Create Account
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

export default LoginPage;