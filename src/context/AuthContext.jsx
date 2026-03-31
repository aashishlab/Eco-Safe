import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../utils/auth';
import { auth, provider } from '../utils/firebase';
import { signInWithPopup } from 'firebase/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('ecosafe_token');
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  });

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      if (token) {
        try {
          const currentUser = authAPI.getCurrentUser(token);
          if (currentUser) {
            setUser(currentUser);
          } else {
            // Token invalid or expired
            localStorage.removeItem('ecosafe_token');
            setToken(null);
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          try {
            localStorage.removeItem('ecosafe_token');
          } catch (e) {
            console.error('Error clearing token:', e);
          }
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const signUp = async (userData) => {
    try {
      const result = await authAPI.signUp(userData);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      const result = await authAPI.signIn(email, password);
      setToken(result.token);
      setUser(result.user);
      localStorage.setItem('ecosafe_token', result.token);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ecosafe_token');
  };

  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      const updatedUser = await authAPI.updateProfile(user.id, updates);
      setUser(updatedUser);
      return { success: true, data: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    token,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
    ,
    googleSignIn: async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        const googleUser = result.user;
        // You may want to send this info to your backend or store in localStorage
        setUser({
          id: googleUser.uid,
          name: googleUser.displayName,
          email: googleUser.email,
          role: 'user',
        });
        setToken(googleUser.accessToken);
        localStorage.setItem('ecosafe_token', googleUser.accessToken);
        return { success: true, data: googleUser };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
