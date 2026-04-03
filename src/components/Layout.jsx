import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Recycle, 
  Menu, 
  X,
  FileText,
  MapPin,
  Megaphone,
  HeartPulse,
  Database,
  Users,
  Phone,
  Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import { Breadcrumb } from './Breadcrumb';

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAuthenticated } = useAuth();

  const navLinks = [
    { name: 'Educate', path: '/', icon: FileText },
    { name: 'Scanner', path: '/scanner', icon: Camera },
    { name: 'Database', path: '/database', icon: Database },
    { name: 'Map', path: '/map', icon: MapPin },
    { name: 'Report', path: '/report', icon: Megaphone },
    { name: 'Health Hub', path: '/health', icon: HeartPulse },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-2 rounded-lg shadow-lg">
                  <Recycle className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">EcoSafe</span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks
                .filter(link => !(user?.role === 'ngo' && link.path === '/report'))
                .map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                        isActive(link.path)
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200'
                          : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{link.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
              <div className="ml-2 flex items-center space-x-2">
                {isAuthenticated ? (
                  <ProfileDropdown />
                ) : (
                  <Link to="/signin">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Sign In
                    </motion.button>
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-emerald-600 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-slate-100 py-4"
          >
            <div className="px-4 space-y-2">
              {navLinks
                .filter(link => !(user?.role === 'ngo' && link.path === '/report'))
                .map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      className={`block px-4 py-3 rounded-xl font-medium transition-all ${
                        isActive(link.path)
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                          : 'text-slate-600 hover:bg-emerald-50'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-5 w-5" />
                        <span>{link.name}</span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
              <div className="pt-2 border-t border-slate-100 mt-2">
                {isAuthenticated ? (
                  <ProfileDropdown onClose={() => setMobileMenuOpen(false)} />
                ) : (
                  <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center px-5 py-3 rounded-lg font-semibold mt-2 shadow-lg"
                    >
                      Sign In
                    </motion.button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Breadcrumb Navigation */}
      <Breadcrumb />

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Emergency Hotline */}
            <div className="bg-red-600 rounded-xl p-6 border-2 border-red-400">
              <div className="flex items-center space-x-3 mb-4">
                <Phone className="h-8 w-8 text-white" />
                <h3 className="text-lg font-bold">Emergency Health Hotline</h3>
              </div>
              <a href="tel:911" className="text-3xl font-bold text-white hover:text-red-100 transition-colors block mb-2">
                Call 911
              </a>
              <p className="text-red-100 text-sm">
                For heavy metal poisoning and chemical exposure emergencies
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/about" className="block text-slate-300 hover:text-emerald-400 transition-colors">
                  About Us
                </Link>
                <Link to="/contact" className="block text-slate-300 hover:text-emerald-400 transition-colors">
                  Contact
                </Link>
                <Link to="/workers" className="block text-slate-300 hover:text-emerald-400 transition-colors">
                  Worker Support
                </Link>
                <Link to="/resources" className="block text-slate-300 hover:text-emerald-400 transition-colors">
                  Resources
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <Link to="/privacy" className="block text-slate-300 hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="block text-slate-300 hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
                <Link to="/accessibility" className="block text-slate-300 hover:text-emerald-400 transition-colors">
                  Accessibility
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <Recycle className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">EcoSafe</span>
            </div>
            <p className="text-slate-400 text-sm text-center md:text-right">
              © 2026 EcoSafe. Protecting communities from e-waste health hazards.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
