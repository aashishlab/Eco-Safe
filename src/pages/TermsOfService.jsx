import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, AlertTriangle, Users } from 'lucide-react';

const TermsOfService = () => {
  const sections = [
    {
      icon: Shield,
      title: '1. Acceptance of Terms',
      content: 'By accessing and using EcoSafe, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.'
    },
    {
      icon: Users,
      title: '2. User Responsibilities',
      content: 'Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account. You agree to provide accurate and complete information when using our services.'
    },
    {
      icon: CheckCircle,
      title: '3. Data Accuracy',
      content: 'While we strive for accuracy, the toxicity data and recycling center information provided on this platform should be used as a guide only. Always verify critical information with official sources.'
    },
    {
      icon: AlertTriangle,
      title: '4. Limitation of Liability',
      content: 'EcoSafe is not liable for any damages arising from the use of this platform, including but not limited to direct, indirect, incidental, or consequential damages. The health information provided is for educational purposes only.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-600 p-3 rounded-xl shadow-lg">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-slate-600">
            Last updated: January 2026
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-6"
        >
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-emerald-100 p-3 rounded-xl">
                    <IconComponent className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                      {section.title}
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            5. Additional Terms
          </h2>
          <ul className="space-y-4">
            {[
              'Intellectual Property Rights',
              'Privacy Policy Compliance',
              'Third-Party Links and Services',
              'Indemnification',
              'Changes to Terms',
              'Governing Law'
            ].map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-700">{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-8 text-center"
        >
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            For questions about these Terms of Service, please contact us at:{' '}
            <a href="mailto:legal@ecosafe.com" className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">
              legal@ecosafe.com
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TermsOfService;
