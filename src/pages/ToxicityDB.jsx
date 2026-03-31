import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, AlertTriangle, Droplets, Brain, Wind, Shield } from 'lucide-react';
import Layout from '../components/Layout';
import electronicsData from '../data/electronics.json';

const ToxicityDB = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [filteredItems, setFilteredItems] = useState(electronicsData);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredItems(electronicsData);
    } else {
      const filtered = electronicsData.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      );
      setFilteredItems(filtered);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default:
        return 'bg-blue-100 border-blue-300 text-blue-800';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5" />;
      case 'high':
        return <Droplets className="h-5 w-5" />;
      case 'medium':
        return <Wind className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  return (
    <Layout>
      {/* Hero Section with Search */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Toxicity & Health Database
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Search electronic devices to learn about toxic chemicals and their health effects
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative max-w-2xl mx-auto"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" />
            <input
              type="text"
              placeholder="Search for laptops, batteries, phones, TVs..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none text-lg shadow-lg"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilteredItems(electronicsData);
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            layout
          >
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  onClick={() => setSelectedItem(item)}
                  className="bg-white border-2 border-slate-200 rounded-2xl p-6 cursor-pointer shadow-md hover:border-emerald-300 transition-all"
                >
                  <div className="text-4xl mb-4">{item.image}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.name}</h3>
                  <p className="text-sm text-emerald-600 font-semibold mb-3">{item.category}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {item.toxins.length} toxic substances
                    </span>
                    <span className="text-emerald-600 text-sm font-medium">Learn More →</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-slate-500 text-lg">No devices found matching "{searchTerm}"</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Detail View Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center rounded-t-3xl">
                  <div className="flex items-center space-x-4">
                    <span className="text-5xl">{selectedItem.image}</span>
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900">{selectedItem.name}</h2>
                      <p className="text-emerald-600 font-medium">{selectedItem.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6 text-slate-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-slate-700 text-lg mb-8 leading-relaxed">
                    {selectedItem.description}
                  </p>

                  <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <AlertTriangle className="h-6 w-6 mr-3 text-red-600" />
                    Toxic Chemicals & Health Hazards
                  </h3>

                  <div className="space-y-4">
                    {selectedItem.toxins.map((toxin, index) => (
                      <motion.div
                        key={toxin.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`rounded-2xl border-2 p-6 ${getSeverityColor(toxin.severity)}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getSeverityIcon(toxin.severity)}
                            <h4 className="text-xl font-bold">{toxin.name}</h4>
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-wide opacity-75">
                            {toxin.severity}
                          </span>
                        </div>
                        
                        <p className="text-sm font-medium mb-3 opacity-90">
                          Amount: {toxin.amount}
                        </p>
                        
                        <div className="flex items-start space-x-3">
                          <Brain className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <p className="leading-relaxed">
                            {toxin.effect}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Warning Footer */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 bg-red-50 border-2 border-red-200 rounded-xl p-6"
                  >
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-red-800 mb-2">Safety Warning</h4>
                        <p className="text-red-700 text-sm leading-relaxed">
                          Never burn or improperly dispose of electronic waste. The fumes released 
                          contain these toxic chemicals and can cause immediate and long-term health damage. 
                          Always use certified recycling facilities.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default ToxicityDB;
