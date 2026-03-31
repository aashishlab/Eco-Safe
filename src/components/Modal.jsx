import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  size = 'md',
  showCloseButton = true,
}) => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`
              fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
              bg-white rounded-xl shadow-2xl z-50 w-full mx-4
              max-h-[90vh] flex flex-col
              ${sizes[size]}
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
              <h2 className="text-xl font-bold text-slate-900">
                {title}
              </h2>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  <X className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Content - With Scroll Support */}
            <div className="px-6 py-4 overflow-y-auto flex-1">
              {children}
            </div>

            {/* Actions */}
            {actions && (
              <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 flex-shrink-0">
                {actions}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to continue?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  loading = false,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    size="sm"
    actions={
      <>
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant={confirmVariant}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmText}
        </Button>
      </>
    }
  >
    <p className="text-slate-600">
      {description}
    </p>
  </Modal>
);
