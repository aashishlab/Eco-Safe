import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { ToastContainer } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import ToxicityDB from './pages/ToxicityDB';
import RecyclerMap from './pages/RecyclerMap';
import ReportHazard from './pages/ReportHazard';
import WorkerHealth from './pages/WorkerHealth';
import ComponentScanner from './pages/ComponentScanner';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Accessibility from './pages/Accessibility';
import './App.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
            <p className="text-slate-600 mb-6">Something went wrong. Please try refreshing the page.</p>
            <p className="text-xs text-slate-400 mb-4">Error: {this.state.error?.toString()}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

function AppContent() {
  const { toasts, removeToast } = useToast();

  return (
    <>
      <Routes>
            {/* Public Routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Public Pages WITH Layout */}
            <Route path="/" element={
              <Layout><Home /></Layout>
            } />
            <Route path="/educate" element={
              <Layout><Home /></Layout>
            } />
            
            {/* Protected Routes */}
            <Route path="/database" element={
              <ProtectedRoute>
                <Layout><ToxicityDB /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/map" element={
              <ProtectedRoute>
                <Layout><RecyclerMap /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/report" element={
              <ProtectedRoute>
                <Layout><ReportHazard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/scanner" element={
              <ProtectedRoute>
                <Layout><ComponentScanner /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/health" element={
              <ProtectedRoute>
                <Layout><WorkerHealth /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout><Profile /></Layout>
              </ProtectedRoute>
            } />
            
            {/* Other Routes */}
            <Route path="/about" element={<Layout><Home /></Layout>} />
            <Route path="/contact" element={<Layout><Home /></Layout>} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/accessibility" element={<Accessibility />} />
          </Routes>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

export default App;
