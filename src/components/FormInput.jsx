import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const FormInput = React.forwardRef(({
  label,
  error,
  success,
  type = 'text',
  helperText,
  icon: Icon,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
        )}

        <input
          ref={ref}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          className={`
            w-full ${Icon ? 'pl-12' : 'pl-4'} pr-12 py-3
            border-2 rounded-lg font-medium transition-all duration-300 outline-none
            focus:ring-2
            ${
              error
                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                : success
                ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-200'
                : 'border-slate-300 bg-white focus:border-emerald-500 focus:ring-emerald-200 hover:border-slate-400'
            }
          `}
          {...props}
        />

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}

        {/* Success icon */}
        {!isPassword && success && (
          <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
        )}

        {/* Error icon */}
        {!isPassword && error && (
          <AlertCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
        )}
      </div>

      {/* Error / Helper Text */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-red-600 flex items-center gap-1"
        >
          <AlertCircle className="h-4 w-4" />
          {error}
        </motion.p>
      )}

      {helperText && !error && (
        <p className="text-sm text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export const FormTextarea = React.forwardRef(({
  label,
  error,
  success,
  helperText,
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        className={`
          w-full px-4 py-3 border-2 rounded-lg font-medium transition-all duration-300
          outline-none focus:ring-2 resize-none
          ${
            error
              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
              : success
              ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-200'
              : 'border-slate-300 bg-white focus:border-emerald-500 focus:ring-emerald-200 hover:border-slate-400'
          }
        `}
        {...props}
      />

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-red-600 flex items-center gap-1"
        >
          <AlertCircle className="h-4 w-4" />
          {error}
        </motion.p>
      )}

      {helperText && !error && (
        <p className="text-sm text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

FormTextarea.displayName = 'FormTextarea';

export const FormCheckbox = ({ label, error, ...props }) => (
  <div className="flex items-center space-x-3">
    <input
      type="checkbox"
      className={`
        w-5 h-5 rounded border-2 transition-all cursor-pointer accent-emerald-600
        ${error ? 'border-red-300 bg-red-50' : 'border-slate-300'}
      `}
      {...props}
    />
    {label && (
      <label className="text-sm font-medium text-slate-700 cursor-pointer">
        {label}
      </label>
    )}
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm font-medium text-red-600 flex items-center gap-1"
      >
        <AlertCircle className="h-4 w-4" />
        {error}
      </motion.p>
    )}
  </div>
);

export const FormSelect = React.forwardRef(({
  label,
  error,
  options = [],
  ...props
}, ref) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
    )}
    
    <select
      ref={ref}
      className={`
        w-full px-4 py-3 border-2 rounded-lg font-medium transition-all duration-300
        outline-none focus:ring-2 cursor-pointer appearance-none
        ${
          error
            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
            : 'border-slate-300 bg-white focus:border-emerald-500 focus:ring-emerald-200 hover:border-slate-400'
        }
      `}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>

    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm font-medium text-red-600 flex items-center gap-1"
      >
        <AlertCircle className="h-4 w-4" />
        {error}
      </motion.p>
    )}
  </div>
));

FormSelect.displayName = 'FormSelect';
