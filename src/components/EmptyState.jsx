import React from 'react';
import { motion } from 'framer-motion';
import { InboxX, Search, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = InboxX,
  title = 'No results found',
  description = 'Try adjusting your search or filters',
  actionLabel,
  onAction,
  className = ''
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-slate-100 rounded-full p-6 mb-6"
    >
      <Icon className="h-12 w-12 text-slate-500" />
    </motion.div>

    <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center">
      {title}
    </h3>
    
    <p className="text-slate-600 text-center mb-6 max-w-sm">
      {description}
    </p>

    {actionLabel && onAction && (
      <Button onClick={onAction} size="md">
        {actionLabel}
      </Button>
    )}
  </motion.div>
);

export const ErrorState = ({
  title = 'Something went wrong',
  description = 'Please try again or contact support',
  actionLabel = 'Try Again',
  onAction,
  error,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center py-16 px-4"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-red-100 rounded-full p-6 mb-6"
    >
      <AlertTriangle className="h-12 w-12 text-red-600" />
    </motion.div>

    <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center">
      {title}
    </h3>
    
    <p className="text-slate-600 text-center mb-4 max-w-sm">
      {description}
    </p>

    {error && (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 w-full max-w-md">
        <p className="text-sm font-mono text-red-700 break-words">
          {error}
        </p>
      </div>
    )}

    {actionLabel && onAction && (
      <Button onClick={onAction} variant="primary">
        {actionLabel}
      </Button>
    )}
  </motion.div>
);

export const NoDataState = ({
  title = 'No data available',
  description = 'Start by adding your first item',
  actionLabel = 'Get Started',
  onAction,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center py-16 px-4"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-blue-100 rounded-full p-6 mb-6"
    >
      <Search className="h-12 w-12 text-blue-600" />
    </motion.div>

    <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center">
      {title}
    </h3>
    
    <p className="text-slate-600 text-center mb-6 max-w-sm">
      {description}
    </p>

    {actionLabel && onAction && (
      <Button onClick={onAction} variant="primary">
        {actionLabel}
      </Button>
    )}
  </motion.div>
);
