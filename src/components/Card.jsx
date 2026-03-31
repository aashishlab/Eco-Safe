import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({
  children,
  className = '',
  hover = true,
  interactive = false,
  ...props
}) => (
  <motion.div
    whileHover={hover ? { scale: 1.02, y: -4 } : {}}
    className={`
      bg-white rounded-lg border border-slate-200 transition-all duration-300
      ${hover ? 'hover:shadow-xl' : 'shadow-md'}
      ${interactive ? 'cursor-pointer' : ''}
      ${className}
    `}
    {...props}
  >
    {children}
  </motion.div>
);

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-slate-200 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-slate-200 flex justify-between items-center ${className}`}>
    {children}
  </div>
);
