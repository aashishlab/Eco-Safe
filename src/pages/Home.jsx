import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  MapPin, 
  HeartPulse, 
  Database, 
  Recycle, 
  Megaphone, 
  Users,
  Phone,
  ChevronRight,
  Droplets,
  Brain,
  Wind,
  Camera
} from 'lucide-react';

const Home = () => {
  const healthHazards = [
    {
      icon: Wind,
      title: 'Toxic Fumes',
      description: 'Burning e-waste releases dangerous chemicals including dioxins and furans that cause respiratory diseases and lung damage.',
      color: 'rose',
      bgColor: 'bg-rose-50',
      iconColor: 'text-rose-600',
      borderColor: 'border-rose-200'
    },
    {
      icon: Brain,
      title: 'Neurological Damage',
      description: 'Lead and mercury exposure from circuit boards and screens can cause brain damage, especially in children and pregnant women.',
      color: 'amber',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-200'
    },
    {
      icon: Droplets,
      title: 'Water Contamination',
      description: 'Heavy metals leach into groundwater from improper disposal, contaminating drinking water and agricultural irrigation.',
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    }
  ];

  const services = [
    {
      icon: Camera,
      title: 'Component Scanner',
      description: 'Use AI to identify hazardous components in electronic devices from photos.',
      path: '/scanner',
      color: 'purple'
    },
    {
      icon: Database,
      title: 'Toxicity Database',
      description: 'Access comprehensive information about hazardous materials in electronic devices.',
      path: '/database',
      color: 'emerald'
    },
    {
      icon: MapPin,
      title: 'Recycler Map',
      description: 'Find certified e-waste recycling facilities and safe disposal centers near you.',
      path: '/map',
      color: 'blue'
    },
    {
      icon: Megaphone,
      title: 'Hazard Reporting',
      description: 'Report unsafe e-waste handling practices and environmental violations in your area.',
      path: '/report',
      color: 'amber'
    },
    {
      icon: Users,
      title: 'Worker Support',
      description: 'Resources and health guidance for informal e-waste workers and their communities.',
      path: '/health',
      color: 'rose'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-20 lg:py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-center mb-6"
            >
              <div className="inline-flex items-center bg-emerald-100 px-4 py-2 rounded-full shadow-lg">
                <AlertTriangle className="h-5 w-5 text-emerald-600 mr-2" />
                <span className="text-emerald-800 font-semibold text-sm">
                  Protecting Communities from E-Waste Hazards
                </span>
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-5xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              Informal E-Waste Handling
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-2">
                & Health Hazards
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.8 }}
            >
              Understanding the severe health impacts on informal workers and communities exposed to electronic waste processing.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.0 }}
            >
              <Link
                to="/database"
                className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Explore Database
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/map"
                className="inline-flex items-center justify-center bg-white border-2 border-slate-200 hover:border-emerald-600 text-slate-900 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Find Recycling Centers
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Health Hazard Grid */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Major Health Hazards
            </h2>
            <p className="text-lg text-slate-600">
              Exposure to e-waste toxins causes severe health problems
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {healthHazards.map((hazard, index) => {
              const IconComponent = hazard.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  className={`bg-white border-2 ${hazard.borderColor} p-8 rounded-xl hover:shadow-xl transition-all duration-300`}
                >
                  <div className={`${hazard.bgColor} w-16 h-16 rounded-lg flex items-center justify-center mb-6`}>
                    <IconComponent className={`h-8 w-8 ${hazard.iconColor}`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {hazard.title}
                  </h3>
                  
                  <p className="text-slate-600 leading-relaxed">
                    {hazard.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Service Overview */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-20 bg-gradient-to-br from-slate-50 to-emerald-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-slate-600">
              Comprehensive tools and resources for safe e-waste management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    to={service.path}
                    className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 block"
                  >
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`bg-${service.color}-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4`}
                    >
                      <IconComponent className={`h-7 w-7 text-${service.color}-600`} />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {service.title}
                    </h3>
                    
                    <p className="text-slate-600 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="mt-4 flex items-center text-emerald-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      Learn More
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
