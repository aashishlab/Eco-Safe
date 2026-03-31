import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white border-2 border-slate-200 hover:border-emerald-600 text-slate-900 hover:shadow-lg',
    outline: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <motion.button
      type={type}
      whileHover={{ scale: !disabled && !loading ? 1.05 : 1 }}
      whileTap={{ scale: !disabled && !loading ? 0.95 : 1 }}
      disabled={disabled || loading}
      className={`
        rounded-lg font-semibold transition-all duration-300
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading && (
        <div className="animate-spin">
          <div className="h-4 w-4 border-2 border-transparent border-t-current rounded-full" />
        </div>
      )}
      {children}
    </motion.button>
  );
};

export const IconButton = ({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const variants = {
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
    primary: 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50',
    danger: 'text-red-600 hover:text-red-700 hover:bg-red-50',
  };

  return (
    <motion.button
      whileHover={{ scale: !disabled ? 1.1 : 1 }}
      whileTap={{ scale: !disabled ? 0.95 : 1 }}
      disabled={disabled}
      className={`
        rounded-lg transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      <Icon className="h-5 w-5" />
    </motion.button>
  );
};
