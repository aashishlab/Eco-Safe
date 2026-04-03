import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Upload, 
  CheckCircle, 
  MapPin, 
  FileText, 
  Flag,
  X,
  Image as ImageIcon,
  Building2,
  Loader2
} from 'lucide-react';
import { db } from '../utils/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Layout from '../components/Layout';

// Zod validation schema
const reportSchema = z.object({
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(500, 'Description must be less than 500 characters'),
  activityType: z.string().min(1, 'Please select an activity type'),
  severity: z.enum(['low', 'medium', 'critical']),
  location: z.string().min(5, 'Please provide a detailed location'),
  assignedNgoId: z.string().min(1, 'Please select an NGO to handle this report'),
  image: z.any().optional(),
});

const ReportHazard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [ngos, setNgos] = useState([]);
  const [isLoadingNgos, setIsLoadingNgos] = useState(true);
  const { user } = useAuth();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(reportSchema),
    mode: 'onChange',
  });

  // Fetch NGOs from Firestore
  React.useEffect(() => {
    const fetchNgos = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'ngo'));
        const querySnapshot = await getDocs(q);
        const ngoList = querySnapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        }));
        setNgos(ngoList);
        setIsLoadingNgos(false);
      } catch (error) {
        console.error("Error fetching NGOs:", error);
        addToast("Failed to load NGOs", "error");
        setIsLoadingNgos(false);
      }
    };
    fetchNgos();
  }, [addToast]);

  const activityTypes = [
    'Cable burning',
    'Open dumping',
    'Acid leaching',
    'Unlicensed recycling',
    'Chemical discharge',
    'Smoke emissions',
    'Other'
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setValue('image', file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setValue('image', null);
  };

  const onSubmit = async (data) => {
    if (!user) {
      addToast("You must be logged in to report", "error");
      return;
    }

    setIsSubmitted(true); // Show loading state or similar, but let's use the layout
    const reportData = {
      ...data,
      userId: user.uid,
      userName: user.name || user.email,
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    try {
      console.log('Submitting report to Firestore:', reportData);
      await addDoc(collection(db, 'reports'), reportData);
      setIsSubmitted(true);
      addToast("Report submitted successfully!", "success");
    } catch (error) {
      console.error("Error submitting report:", error);
      addToast("Failed to submit report. Please try again.", "error");
      setIsSubmitted(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Type of Activity *
              </label>
              <select
                {...register('activityType')}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
              >
                <option value="">Select activity type...</option>
                {activityTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.activityType && (
                <p className="mt-1 text-sm text-red-600">{errors.activityType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description of Hazard *
              </label>
              <textarea
                {...register('description')}
                rows="5"
                placeholder="Describe what you observed (burning, dumping, chemicals, etc.)..."
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors resize-none"
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-slate-500">Be as detailed as possible</p>
                <p className="text-xs text-slate-500">
                  {watch('description')?.length || 0}/500
                </p>
              </div>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Select Assigned NGO *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <select
                  {...register('assignedNgoId')}
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors appearance-none"
                  disabled={isLoadingNgos}
                >
                  <option value="">Choose an NGO...</option>
                  {ngos.map((ngo) => (
                    <option key={ngo.uid} value={ngo.uid}>
                      {ngo.name || ngo.email}
                    </option>
                  ))}
                </select>
                {isLoadingNgos && (
                  <Loader2 className="absolute right-3 top-3 h-5 w-5 text-slate-400 animate-spin" />
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500">The selected NGO will investigate this report</p>
              {errors.assignedNgoId && (
                <p className="mt-1 text-sm text-red-600">{errors.assignedNgoId.message}</p>
              )}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Severity Level *
              </label>
              <div className="space-y-3">
                {[
                  { value: 'low', label: 'Low', desc: 'Minor concern, limited impact', color: 'bg-blue-50 border-blue-300' },
                  { value: 'medium', label: 'Medium', desc: 'Moderate risk to local area', color: 'bg-yellow-50 border-yellow-300' },
                  { value: 'critical', label: 'Critical', desc: 'Immediate threat to health/environment', color: 'bg-red-50 border-red-300' }
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      watch('severity') === option.value ? option.color + ' border-2' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      {...register('severity')}
                      className="h-4 w-4 text-emerald-600"
                    />
                    <div className="ml-3">
                      <p className="font-semibold text-slate-900">{option.label}</p>
                      <p className="text-sm text-slate-600">{option.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              {errors.severity && (
                <p className="mt-1 text-sm text-red-600">{errors.severity.message}</p>
              )}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Location Details *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  {...register('location')}
                  type="text"
                  placeholder="Enter address, landmarks, or GPS coordinates..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Upload Evidence (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                {uploadedImage ? (
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Uploaded evidence"
                      className="max-h-64 mx-auto rounded-lg shadow-md"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-2">
                      Drag and drop an image here, or click to browse
                    </p>
                    <p className="text-xs text-slate-500 mb-4">
                      Supports: JPG, PNG (Max 5MB)
                    </p>
                    <label className="inline-block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <span className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium cursor-pointer transition-colors inline-flex items-center">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Choose Image
                      </span>
                    </label>
                  </>
                )}
              </div>
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center"
          >
            <div className="mb-6">
              <CheckCircle className="h-24 w-24 text-green-500 mx-auto" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Report Submitted!
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Thank you for protecting your community's air quality. Your report has been sent to our environmental health team for investigation.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-8">
              <p className="text-sm text-emerald-800">
                Reference ID: <span className="font-mono font-bold">#RPT-{Date.now().toString().slice(-6)}</span>
              </p>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(1);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl transition-colors"
            >
              Submit Another Report
            </button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center bg-red-100 text-red-700 px-4 py-2 rounded-full mb-4">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span className="font-semibold">Community Reporting Portal</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Report Environmental Hazard
            </h1>
            <p className="text-slate-600 text-lg">
              Help us identify and stop illegal e-waste disposal activities
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      step <= currentStep
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-20 md:w-32 h-1 mx-2 ${
                        step < currentStep ? 'bg-emerald-600' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-600">
              <span>Details</span>
              <span>Severity</span>
              <span>Location</span>
            </div>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                >
                  ← Previous
                </button>
              ) : (
                <div />
              )}
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center"
                >
                  <Flag className="h-5 w-5 mr-2" />
                  Submit Report
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ReportHazard;
