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
  Camera,
  CheckCircle,
  Clock,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Loader2,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../utils/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, orderBy } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';
import Layout from '../components/Layout';

const Home = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [reports, setReports] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

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

  React.useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let q;
    try {
      if (user.role === 'ngo') {
        q = query(
          collection(db, 'reports'), 
          where('assignedNgoId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
      } else {
        q = query(
          collection(db, 'reports'), 
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
      }

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const reportList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReports(reportList);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching reports:", error);
        // Only show toast if it's not a permission error during initial load
        if (error.code !== 'permission-denied') {
          addToast("Failed to load reports", "error");
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (e) {
      console.error("Query building error:", e);
      setLoading(false);
    }
  }, [user, addToast]);

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      await updateDoc(doc(db, 'reports', reportId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      addToast(`Report marked as ${newStatus}`, "success");
    } catch (error) {
      console.error("Error updating report:", error);
      addToast("Failed to update status", "error");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <Layout>
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

        {/* Role-Based Dashboard Section */}
        {user && (
          <section className="py-12 bg-white border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    {user.role === 'ngo' ? 'Incoming Requests' : 'My Impact Panel'}
                  </h2>
                  <p className="text-slate-600">
                     {user.role === 'ngo' ? 'Manage and track incidents specifically assigned to your organization' : 'Track the status of your environmental hazard reports'}
                  </p>
                </div>
                <div className="bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                   <span className="text-emerald-700 font-medium text-sm flex items-center">
                     <ShieldAlert className="h-4 w-4 mr-2" />
                     Logged in as {user.role.toUpperCase()}
                   </span>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 px-4">
                  <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mb-4" />
                  <p className="text-slate-500 font-medium">Fetching secure data from field...</p>
                </div>
              ) : reports.length === 0 ? (
                <div className="bg-slate-50 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                  <ClipboardList className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No reports found</h3>
                  <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    {user.role === 'ngo' 
                      ? "Establish trust with the community! No hazard reports have been assigned to your organization yet." 
                      : "Your dashboard is clean! You haven't submitted any reports yet. Help protect your community by reporting hazards."}
                  </p>
                  {user.role !== 'ngo' && (
                    <Link
                      to="/report"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg inline-flex items-center"
                    >
                      Create Your First Report
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {reports.map((report) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase border-2 ${getStatusStyle(report.status)}`}>
                          {report.status}
                        </div>
                        <span className="text-xs text-slate-400 font-medium">
                          {report.createdAt && report.createdAt.toDate ? report.createdAt.toDate().toLocaleDateString() : 'Just now'}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                        {report.activityType}
                      </h4>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                        {report.description}
                      </p>

                      <div className="flex items-center text-xs text-slate-500 mb-6 bg-slate-50 p-2 rounded-lg">
                        <MapPin className="h-3 w-3 mr-1 text-rose-500" />
                        <span className="truncate">{report.location}</span>
                      </div>

                      {user.role === 'ngo' ? (
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                          {report.status === 'pending' && (
                            <button
                              onClick={() => updateReportStatus(report.id, 'accepted')}
                              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-bold transition-all shadow-sm"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Accept
                            </button>
                          )}
                          {(report.status === 'accepted' || report.status === 'pending') && (
                            <button
                              onClick={() => updateReportStatus(report.id, 'resolved')}
                              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm font-bold transition-all shadow-sm col-span-1"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Resolve
                            </button>
                          )}
                          {report.status === 'resolved' && (
                            <div className="col-span-2 text-center text-emerald-600 font-bold text-sm bg-emerald-50 py-2 rounded-lg flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Incident Case Closed
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                           <div className="flex items-center text-xs font-semibold text-slate-500">
                             <Clock className="h-3 w-3 mr-1" />
                             {report.status === 'pending' ? 'Waiting for NGO' : 'NGO processing'}
                           </div>
                           <div className="text-emerald-600 font-bold text-sm flex items-center">
                              Track
                              <ChevronRight className="h-4 w-4 ml-1" />
                           </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

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
              {services
                .filter(service => !(user?.role === 'ngo' && service.path === '/report'))
                .map((service, index) => {
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
    </Layout>
  );
};

export default Home;
