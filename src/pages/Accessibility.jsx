import React from 'react';
import { motion } from 'framer-motion';
import { Accessibility, Eye, Ear, Keyboard, MousePointer, Zap, Heart } from 'lucide-react';

const AccessibilityPage = () => {
  const features = [
    {
      icon: Eye,
      title: 'Visual Accessibility',
      description: 'High contrast mode and screen reader support for users with visual impairments.',
      color: 'emerald'
    },
    {
      icon: Ear,
      title: 'Hearing Support',
      description: 'Visual alternatives for audio content and closed captioning where applicable.',
      color: 'blue'
    },
    {
      icon: Keyboard,
      title: 'Keyboard Navigation',
      description: 'Full keyboard accessibility for all interactive elements and navigation.',
      color: 'purple'
    },
    {
      icon: MousePointer,
      title: 'Motor Accessibility',
      description: 'Large clickable areas and support for alternative input devices.',
      color: 'amber'
    },
    {
      icon: Zap,
      title: 'Cognitive Support',
      description: 'Clear, simple language and consistent navigation patterns throughout.',
      color: 'rose'
    },
    {
      icon: Heart,
      title: 'Seizure Safety',
      description: 'No flashing content that could trigger photosensitive epilepsy.',
      color: 'red'
    }
  ];

  const standards = [
    'WCAG 2.1 Level AA Compliance',
    'Section 508 Standards',
    'EN 301 549 (European Standard)',
    'WAI-ARIA 1.1 Guidelines'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl shadow-xl">
              <Accessibility className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Accessibility Statement
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We're committed to ensuring digital accessibility for people with disabilities
          </p>
        </motion.div>

        {/* Conformance Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 text-white text-center shadow-lg">
            <h2 className="text-2xl font-bold mb-2">WCAG 2.1 Level AA Conformance</h2>
            <p className="text-emerald-50">
              EcoSafe conforms to the Web Content Accessibility Guidelines version 2.1 at level AA
            </p>
          </div>
        </motion.div>

        {/* Accessibility Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Accessibility Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const bgColor = `bg-${feature.color}-100`;
              const iconColor = `text-${feature.color}-600`;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  className={`${bgColor} rounded-2xl p-6 border border-${feature.color}-200`}
                >
                  <IconComponent className={`h-12 w-12 ${iconColor} mb-4`} />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Standards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mb-12 bg-white rounded-2xl shadow-lg p-8 border border-slate-200"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Accessibility Standards
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {standards.map((standard, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1.3 + index * 0.1 }}
                className="flex items-center space-x-3 bg-slate-50 rounded-xl p-4"
              >
                <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                <span className="text-slate-700 font-medium">{standard}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.8 }}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 text-white shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4">We Value Your Feedback</h2>
          <p className="text-blue-50 mb-6">
            If you experience any accessibility barriers while using our website, please contact us. 
            We're committed to resolving issues promptly.
          </p>
          <div className="space-y-2">
            <p className="font-semibold">Contact Accessibility Team:</p>
            <a href="mailto:accessibility@ecosafe.com" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              accessibility@ecosafe.com
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AccessibilityPage;
