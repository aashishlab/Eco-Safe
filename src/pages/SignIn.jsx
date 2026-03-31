import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';
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
    const result = await googleSignIn();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-center">
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex bg-white/20 backdrop-blur-sm p-3 rounded-2xl mb-4"
            >
              <LogIn className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-emerald-100">Sign in to continue protecting communities</p>
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
                className="!flex gap-3 w-full"
              >
                <FcGoogle className="h-5 w-5" />
                Sign in with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">Or continue with email</span>
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
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-slate-600">Remember me</span>
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
                className="w-full"
              >
                Sign In
              </Button>
            </form>

            {/* Demo Credentials */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4"
            >
              <p className="text-sm font-semibold text-blue-800 mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-blue-700 font-mono">
                <p><span className="font-bold">Email:</span> demo@ecosafe.com</p>
                <p><span className="font-bold">Password:</span> demo123</p>
              </div>
            </motion.div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-slate-600">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
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
          className="text-center text-slate-600 text-sm mt-6"
        >
          By signing in, you agree to our{' '}
          <Link to="/terms" className="text-emerald-600 hover:underline font-medium">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-emerald-600 hover:underline font-medium">
            Privacy Policy
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SignIn;
