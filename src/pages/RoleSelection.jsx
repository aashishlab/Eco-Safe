import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ShieldCheck } from 'lucide-react';
import { Button } from '../components/Button';

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    // Store role temporarily in sessionStorage
    sessionStorage.setItem('ecosafe_temp_role', role);
    // Redirect to signin (user can toggle to signup if needed)
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Welcome to EcoSafe</h1>
          <p className="text-lg text-slate-600">Please select your account type to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-3xl shadow-xl p-8 cursor-pointer border-2 border-transparent hover:border-emerald-500 transition-all group"
            onClick={() => handleRoleSelection('user')}
          >
            <div className="bg-emerald-100 p-4 rounded-2xl inline-block mb-6 group-hover:bg-emerald-500 transition-colors">
              <User className="h-10 w-10 text-emerald-600 group-hover:text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Individual User</h2>
            <p className="text-slate-600 mb-6">Learn about toxicity, find recyclers, and report hazards in your community.</p>
            <Button className="w-full" variant="primary">Login as User</Button>
          </motion.div>

          {/* NGO Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-3xl shadow-xl p-8 cursor-pointer border-2 border-transparent hover:border-teal-500 transition-all group"
            onClick={() => handleRoleSelection('ngo')}
          >
            <div className="bg-teal-100 p-4 rounded-2xl inline-block mb-6 group-hover:bg-teal-500 transition-colors">
              <ShieldCheck className="h-10 w-10 text-teal-600 group-hover:text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">NGO / Organization</h2>
            <p className="text-slate-600 mb-6">Manage reports, coordinate cleanups, and track worker health initiatives.</p>
            <Button className="w-full" variant="secondary">Login as NGO</Button>
          </motion.div>
        </div>

        <div className="mt-12 text-center">
            <p className="text-slate-500 text-sm">
                By continuing, you agree to our <a href="/terms" className="text-emerald-600 hover:underline">Terms</a> and <a href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</a>.
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelection;
