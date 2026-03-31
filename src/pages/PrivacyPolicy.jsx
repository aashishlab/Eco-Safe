import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Shield,
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us, including your name, email address, and any other information you choose to provide when creating an account or using our services.'
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: 'We use the information we collect to operate, maintain, and improve our services, to send you updates and security alerts, and to respond to your comments and questions.'
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
    },
    {
      icon: Database,
      title: 'Data Storage',
      content: 'Your data is stored securely on our servers. We retain your personal information only for as long as necessary to provide you with our services and comply with legal obligations.'
    },
    {
      icon: UserCheck,
      title: 'Your Rights',
      content: 'You have the right to access, update, or delete your personal information at any time. You may also opt-out of receiving promotional communications from us.'
    },
    {
      icon: AlertCircle,
      title: 'Third-Party Services',
      content: 'Our service may contain links to third-party websites. We are not responsible for the privacy practices of these external sites and encourage you to review their policies.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
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
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Privacy Policy
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
                  <div className="flex-shrink-0 bg-blue-100 p-3 rounded-xl">
                    <IconComponent className="h-8 w-8 text-blue-600" />
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

        {/* Cookie Policy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
            <Database className="h-6 w-6 mr-3 text-blue-600" />
            Cookie Policy
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-4">
            We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier.
          </p>
          <ul className="space-y-3">
            {[
              'Essential cookies for site functionality',
              'Preference cookies to remember your settings',
              'Analytics cookies to understand site usage',
              'Security cookies to protect your data'
            ].map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.1 + index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-slate-700">{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          className="mt-8 text-center"
        >
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            For privacy-related questions, please contact:{' '}
            <a href="mailto:privacy@ecosafe.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              privacy@ecosafe.com
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
