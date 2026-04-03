import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';
import { FcGoogle } from 'react-icons/fc';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, googleSignIn } = useAuth();
  const { addToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Requirements: Role must be selected first
    const savedRole = sessionStorage.getItem('ecosafe_temp_role');
    if (!savedRole) {
      navigate('/role-selection');
    } else {
      setRole(savedRole);
    }
  }, [navigate]);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const result = await googleSignIn(role);
    if (result.success) {
      addToast('Signed in with Google successfully!', 'success');
      navigate(from, { replace: true });
    } else {
      addToast(result.error || 'Failed to sign in with Google', 'error');
    }
    setGoogleLoading(false);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    const result = await signIn(data.email, data.password);

    if (result.success) {
      addToast('Sign in successful!', 'success');
      navigate(from, { replace: true });
    } else {
      addToast(result.error || 'Failed to sign in', 'error');
    }

    setIsLoading(false);
  };

  if (!role) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <button 
          onClick={() => navigate('/role-selection')}
          className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Change Account Type
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          {/* Header */}
          <div className={`p-8 text-center ${role === 'ngo' ? 'bg-gradient-to-r from-teal-600 to-cyan-600' : 'bg-gradient-to-r from-emerald-600 to-teal-600'}`}>
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex bg-white/20 backdrop-blur-sm p-3 rounded-2xl mb-4"
            >
              <LogIn className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {role === 'ngo' ? 'NGO Login' : 'User Login'}
            </h1>
            <p className="text-emerald-50 opacity-90">Sign in to your EcoSafe account</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Google Sign In Button */}
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                loading={googleLoading}
                disabled={isLoading}
                variant="secondary"
                className="!flex gap-3 w-full border-2 hover:bg-slate-50 transition-all"
              >
                <FcGoogle className="h-5 w-5" />
                Sign in with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-slate-400 font-medium">Or continue with email</span>
                </div>
              </div>

              {/* Email Field */}
              <FormInput
                label="Email Address"
                icon={Mail}
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />

              {/* Password Field */}
              <FormInput
                label="Password"
                icon={Lock}
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer transition-all"
                  />
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                loading={isLoading}
                disabled={googleLoading}
                size="lg"
                className="w-full shadow-lg shadow-emerald-200"
              >
                Sign In
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center pt-6 border-t border-slate-50">
              <p className="text-slate-600">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-slate-400 text-xs mt-8"
        >
          By signing in, you agree to our{' '}
          <Link to="/terms" className="hover:text-emerald-600 transition-colors">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SignIn;
