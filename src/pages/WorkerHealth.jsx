import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Shield, 
  Eye, 
  Hand, 
  MapPin,
  Phone,
  Heart,
  Info
} from 'lucide-react';
import Layout from '../components/Layout';

const WorkerHealth = () => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState({
    skinRashes: null,
    persistentCough: null,
    breathingDifficulty: null,
    headaches: null,
    nausea: null,
  });

  const symptomQuestions = [
    { id: 'skinRashes', question: 'Do you have skin rashes or irritation?', icon: '🔴' },
    { id: 'persistentCough', question: 'Do you have a persistent cough?', icon: '😷' },
    { id: 'breathingDifficulty', question: 'Do you experience difficulty breathing?', icon: '💨' },
    { id: 'headaches', question: 'Do you have frequent headaches?', icon: '🤕' },
    { id: 'nausea', question: 'Do you feel nauseous or dizzy?', icon: '🤢' },
  ];

  const yesCount = Object.values(symptoms).filter(value => value === true).length;
  const showWarning = yesCount > 2;

  const handleAnswer = (id, answer) => {
    setSymptoms(prev => ({ ...prev, [id]: answer }));
  };

  const resetSymptoms = () => {
    setSymptoms({
      skinRashes: null,
      persistentCough: null,
      breathingDifficulty: null,
      headaches: null,
      nausea: null,
    });
  };

  const safetyItems = [
    {
      icon: Hand,
      title: 'Protective Gloves',
      description: 'Wear chemical-resistant gloves when handling e-waste to prevent skin contact with toxic metals.',
      color: 'bg-blue-500',
      tips: ['Use nitrile or neoprene gloves', 'Replace if torn or worn', 'Wash hands after removal']
    },
    {
      icon: Shield,
      title: 'Respiratory Masks',
      description: 'N95 or P100 masks protect against toxic dust and fumes from burning electronics.',
      color: 'bg-orange-500',
      tips: ['Ensure proper fit', 'Replace filters regularly', 'Don\'t reuse disposable masks']
    },
    {
      icon: Eye,
      title: 'Eye Protection',
      description: 'Safety goggles prevent chemical splashes and metal fragments from damaging your eyes.',
      color: 'bg-green-500',
      tips: ['Use wraparound goggles', 'Clean regularly', 'Replace if scratched']
    },
    {
      icon: Heart,
      title: 'Protective Clothing',
      description: 'Long sleeves and pants made of durable material protect skin from cuts and chemical exposure.',
      color: 'bg-purple-500',
      tips: ['Wear long sleeves', 'Use aprons for wet work', 'Wash work clothes separately']
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Workers' Health Hub
            </h1>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
              Your health and safety matter. Check your symptoms and learn how to protect yourself.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Symptom Checker */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-8"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full mb-4">
                <Heart className="h-5 w-5 mr-2" />
                <span className="font-semibold">Interactive Symptom Checker</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                How Are You Feeling Today?
              </h2>
              <p className="text-slate-600">
                Answer these questions to assess potential health risks from e-waste exposure
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {symptomQuestions.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-50 rounded-xl p-6 border border-slate-200"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{item.icon}</span>
                      <p className="font-medium text-slate-900 text-lg">{item.question}</p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleAnswer(item.id, true)}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                          symptoms[item.id] === true
                            ? 'bg-green-500 text-white shadow-lg scale-105'
                            : 'bg-white text-green-600 border-2 border-green-500 hover:bg-green-50'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => handleAnswer(item.id, false)}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                          symptoms[item.id] === false
                            ? 'bg-red-500 text-white shadow-lg scale-105'
                            : 'bg-white text-red-600 border-2 border-red-500 hover:bg-red-50'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Warning Message */}
            {showWarning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border-4 border-red-300 rounded-xl p-6 mb-6"
              >
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-red-800 mb-2">
                      Medical Attention Required
                    </h3>
                    <p className="text-red-700 leading-relaxed">
                      You've reported {yesCount} symptoms. These could be signs of heavy metal poisoning 
                      or chemical exposure. <strong>Please visit a clinic immediately.</strong> Early 
                      diagnosis can prevent serious long-term health damage.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/map?filter=health')}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <MapPin className="h-6 w-6 mr-3" />
                Find Nearest Clinic
              </button>
              <button
                onClick={resetSymptoms}
                className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                Start Over
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Safety Essentials Grid */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Safety Essentials
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Protect yourself with proper safety equipment when handling e-waste
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safetyItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-slate-200"
                >
                  <div className={`${item.color} p-6 text-white`}>
                    <IconComponent className="h-12 w-12 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-center">{item.title}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-slate-700 mb-4 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="border-t border-slate-200 pt-4">
                      <h4 className="font-semibold text-slate-900 mb-2 text-sm">Key Tips:</h4>
                      <ul className="space-y-2">
                        {item.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start text-sm text-slate-600">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Emergency Info */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-8"
          >
            <div className="flex items-start space-x-4 mb-6">
              <Phone className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Emergency Contacts
                </h2>
                <p className="text-slate-700">
                  If you experience severe symptoms, seek immediate medical attention
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border-2 border-red-200">
                <h3 className="font-bold text-slate-900 mb-3">Emergency Services</h3>
                <a href="tel:911" className="text-3xl font-bold text-red-600 hover:text-red-700 block mb-2">
                  911
                </a>
                <p className="text-sm text-slate-600">For life-threatening emergencies</p>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-emerald-200">
                <h3 className="font-bold text-slate-900 mb-3">Poison Control</h3>
                <a href="tel:18002221222" className="text-2xl font-bold text-emerald-600 hover:text-emerald-700 block mb-2">
                  1-800-222-1222
                </a>
                <p className="text-sm text-slate-600">For chemical exposure guidance</p>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start space-x-3">
                <Info className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Important Information for Healthcare Providers</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Inform your doctor about your work with electronic waste. Mention potential exposure to 
                    lead, mercury, cadmium, and other heavy metals. Blood tests can detect heavy metal levels 
                    and guide appropriate treatment.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default WorkerHealth;
