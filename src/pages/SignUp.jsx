import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';
import { FcGoogle } from 'react-icons/fc';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, googleSignIn } = useAuth();
  const { addToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedRole = sessionStorage.getItem('ecosafe_temp_role');
    if (!savedRole) {
      navigate('/role-selection');
    } else {
      setRole(savedRole);
    }
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const password = watch('password');

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    const result = await googleSignIn(role);
    if (result.success) {
      addToast('Account created with Google successfully!', 'success');
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      addToast(result.error || 'Failed to sign up with Google', 'error');
    }
    setGoogleLoading(false);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    const result = await signUp(data.email, data.password, data.name, role);

    if (result.success) {
      addToast('Account created successfully!', 'success');
      setSuccess(true);
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } else {
      addToast(result.error || 'Failed to create account', 'error');
    }

    setIsLoading(false);
  };

  if (!role) return null;

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          className="w-full max-w-md text-center"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 15 }}
            >
              <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
            </motion.div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Account Created Successfully!
            </h2>
            <p className="text-slate-600 mb-6">
              Welcome to EcoSafe! Your {role.toUpperCase()} account is ready.
            </p>
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4">
              <p className="text-sm text-emerald-800 font-medium">
                Redirecting you to the sign in page...
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4 py-12">
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
              <UserPlus className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {role === 'ngo' ? 'Register as NGO' : 'Register as User'}
            </h1>
            <p className="text-emerald-50 opacity-90">Join the movement to protect communities</p>
          </div>

          {/* Form */}
          <div className="p-8 max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Google Sign Up Button */}
              <Button
                type="button"
                onClick={handleGoogleSignUp}
                loading={googleLoading}
                disabled={isLoading}
                variant="secondary"
                className="!flex gap-3 w-full border-2 hover:bg-slate-50 transition-all"
              >
                <FcGoogle className="h-5 w-5" />
                Sign up with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-slate-400 font-medium">Or continue with email</span>
                </div>
              </div>

              {/* Name Field */}
              <FormInput
                label="Full Name"
                icon={User}
                type="text"
                placeholder="John Doe"
                error={errors.name?.message}
                {...register('name')}
              />

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
                helperText="At least 8 characters with uppercase, lowercase, and number"
                {...register('password')}
              />

              {/* Confirm Password Field */}
              <FormInput
                label="Confirm Password"
                icon={Lock}
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                success={password && !errors.confirmPassword}
                {...register('confirmPassword')}
              />

              {/* Terms & Conditions */}
              <div className="pt-2">
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <input
                    {...register('acceptTerms')}
                    type="checkbox"
                    className="h-4 w-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 mt-1 cursor-pointer"
                  />
                  <span className="text-sm text-slate-700">
                    I agree to the{' '}
                    <Link to="/terms" className="text-emerald-600 hover:underline font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-emerald-600 hover:underline font-medium">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {errors.acceptTerms.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                loading={isLoading}
                disabled={googleLoading}
                size="lg"
                className="w-full mt-6 shadow-lg shadow-emerald-200"
              >
                Create Account
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center pt-6 border-t border-slate-50">
              <p className="text-slate-600">
                Already have an account?{' '}
                <Link
                  to="/signin"
                  className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
