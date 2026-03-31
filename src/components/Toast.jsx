import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const toastStyles = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-600',
    textColor: 'text-green-800',
    progressBg: 'bg-green-500'
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: AlertCircle,
    iconColor: 'text-red-600',
    textColor: 'text-red-800',
    progressBg: 'bg-red-500'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: Info,
    iconColor: 'text-blue-600',
    textColor: 'text-blue-800',
    progressBg: 'bg-blue-500'
  }
};

export const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
  const style = toastStyles[type];
  const IconComponent = style.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 100, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`${style.bg} border ${style.border} rounded-lg shadow-lg overflow-hidden`}
    >
      <div className="flex items-start p-4">
        <IconComponent className={`h-5 w-5 mr-3 flex-shrink-0 mt-0.5 ${style.iconColor}`} />
        <div className="flex-1">
          <p className={`font-medium text-sm ${style.textColor}`}>
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`ml-4 flex-shrink-0 ${style.iconColor} hover:opacity-70 transition-opacity`}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <motion.div
        className={`h-1 ${style.progressBg}`}
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        style={{ transformOrigin: 'left' }}
      />
    </motion.div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-6 right-6 z-50 space-y-3 max-w-md pointer-events-auto">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
