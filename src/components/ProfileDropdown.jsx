import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  Mail,
  ChevronDown,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfileDropdown = ({ onClose }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    setIsOpen(false);
    if (onClose) onClose();
    navigate('/');
  };

  return (
    <div className="relative">
      {/* Profile Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors"
      >
        <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
          <div className="bg-emerald-600 p-1.5 rounded-full">
            <User className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-medium text-emerald-800 hidden md:block">
            {user?.name?.split(' ')[0] || 'User'}
          </span>
          <ChevronDown className={`h-4 w-4 text-emerald-600 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            {onClose && (
              <div
                className="fixed inset-0 z-40 lg:hidden"
                onClick={() => setIsOpen(false)}
              />
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white">{user?.name}</p>
                    <p className="text-xs text-emerald-100 truncate">{user?.email}</p>
                  </div>
                  {onClose && (
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-white/80 hover:text-white lg:hidden"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <Link
                  to="/profile"
                  onClick={() => {
                    setIsOpen(false);
                    if (onClose) onClose();
                  }}
                  className="flex items-center px-4 py-3 hover:bg-slate-50 transition-colors"
                >
                  <User className="h-5 w-5 text-slate-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">My Profile</p>
                    <p className="text-xs text-slate-500">View and edit your details</p>
                  </div>
                </Link>

                <Link
                  to="/profile?tab=settings"
                  onClick={() => {
                    setIsOpen(false);
                    if (onClose) onClose();
                  }}
                  className="flex items-center px-4 py-3 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="h-5 w-5 text-slate-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Settings</p>
                    <p className="text-xs text-slate-500">Account preferences</p>
                  </div>
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => {
                      setIsOpen(false);
                      if (onClose) onClose();
                    }}
                    className="flex items-center px-4 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <Shield className="h-5 w-5 text-purple-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Admin Panel</p>
                      <p className="text-xs text-slate-500">Manage users & content</p>
                    </div>
                  </Link>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-slate-200 mx-4"></div>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-4 py-3 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5 text-red-500 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-red-600">Sign Out</p>
                  <p className="text-xs text-slate-500">End your session</p>
                </div>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
