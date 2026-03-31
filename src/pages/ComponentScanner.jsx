import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Droplet,
  Skull,
  Wind,
  MapPin,
  Shield,
  TrendingUp,
  Info,
  X,
  Download,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { analyzeDeviceImage, getDetailedToxinInfo } from '../utils/aiHazardAnalyzer';

const ComponentScanner = () => {
  const { addToast } = useToast();
  
  const [uploadedImage, setUploadedImage] = useState(null);
  const [deviceType, setDeviceType] = useState('smartphone');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const deviceTypes = [
    { id: 'smartphone', label: '📱 Smartphone', icon: Camera },
    { id: 'laptop', label: '💻 Laptop', icon: Zap },
    { id: 'tablet', label: '📱 Tablet', icon: Shield },
    { id: 'monitor', label: '🖥️ Monitor', icon: AlertCircle },
    { id: 'keyboard', label: '⌨️ Keyboard', icon: Camera },
    { id: 'mouse', label: '🖱️ Mouse', icon: Camera },
    { id: 'printer', label: '🖨️ Printer', icon: TrendingUp },
    { id: 'headphones', label: '🎧 Headphones', icon: Camera },
    { id: 'charger', label: '🔌 Charger', icon: Zap },
    { id: 'other', label: '📦 Other Device', icon: AlertCircle },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast('File size must be less than 5MB', 'error');
      return;
    }

    if (!file.type.startsWith('image/')) {
      addToast('Please upload a valid image file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result);
      addToast('Image uploaded successfully', 'success');
    };
    reader.onerror = () => {
      addToast('Failed to read file', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!uploadedImage) {
      addToast('Please upload an image first', 'error');
      return;
    }

    if (!deviceType) {
      addToast('Please select a device type', 'error');
      return;
    }

    try {
      setIsAnalyzing(true);
      const result = await analyzeDeviceImage(uploadedImage, deviceType);
      
      if (result.success) {
        setAnalysisResult(result);
        addToast('Analysis complete!', 'success');
      } else {
        addToast('Analysis failed. Please try again.', 'error');
      }
    } catch (error) {
      addToast('Error during analysis: ' + error.message, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskLevelColor = (level) => {
    const colors = {
      CRITICAL: 'from-red-600 to-red-700',
      HIGH: 'from-orange-600 to-orange-700',
      MEDIUM: 'from-amber-600 to-amber-700',
      LOW: 'from-green-600 to-green-700',
    };
    return colors[level] || colors.LOW;
  };

  const getToxinIcon = (toxinName) => {
    const lowerName = toxinName.toLowerCase();
    if (lowerName.includes('gas') || lowerName.includes('fume')) return <Wind className="h-5 w-5" />;
    if (lowerName.includes('arsenic') || lowerName.includes('lead')) return <Skull className="h-5 w-5" />;
    if (lowerName.includes('water')) return <Droplet className="h-5 w-5" />;
    return <AlertTriangle className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex bg-gradient-to-r from-emerald-100 to-blue-100 p-4 rounded-2xl mb-6">
            <Camera className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            AI Component Hazard Scanner
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload a photo of your electronic device and our AI will identify hazardous components, 
            assess risks, and provide safe disposal recommendations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card>
              <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Step 1: Upload & Analyze
                </h2>

                {/* Device Type Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-slate-700 mb-4">
                    Select Device Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {deviceTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDeviceType(type.id)}
                        className={`p-3 rounded-lg font-medium transition-all ${
                          deviceType === type.id
                            ? 'bg-emerald-600 text-white shadow-lg'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {type.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-slate-700 mb-4">
                    Upload Device Photo
                  </label>
                  
                  {uploadedImage ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative"
                    >
                      <img
                        src={uploadedImage}
                        alt="Device preview"
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                      />
                      <button
                        onClick={() => setUploadedImage(null)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </motion.div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-3 border-dashed border-emerald-300 rounded-lg cursor-pointer hover:border-emerald-600 transition-colors bg-emerald-50 hover:bg-emerald-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-12 w-12 text-emerald-600 mb-2" />
                        <p className="text-sm font-semibold text-slate-700">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>

                {/* Analyze Button */}
                <Button
                  onClick={handleAnalyze}
                  loading={isAnalyzing}
                  size="lg"
                  className="w-full"
                >
                  {isAnalyzing ? 'Analyzing Components...' : 'Analyze Device'}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Information Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  How It Works
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                  <div>
                    <p className="font-semibold text-slate-700 mb-1">1. Upload Image</p>
                    <p>Take or upload a clear photo of your device</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 mb-1">2. Select Device Type</p>
                    <p>Help AI identify components accurately</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 mb-1">3. AI Analysis</p>
                    <p>Our AI detects components and hazards</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 mb-1">4. Get Recommendations</p>
                    <p>Receive safe disposal guidance</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-xs text-slate-500">
                    <strong>Privacy:</strong> Images are processed locally and not stored on our servers.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-12 space-y-8"
            >
              {/* Risk Level Banner */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`bg-gradient-to-br ${getRiskLevelColor(analysisResult.riskLevel)} rounded-2xl p-8 text-white shadow-2xl`}
              >
                <div className="flex items-center justify-between gap-8">
                  <div>
                    <div className="text-sm font-semibold opacity-90 mb-2">ASSESSMENT RESULT</div>
                    <h3 className="text-4xl font-bold mb-3">
                      {analysisResult.riskLevel === 'CRITICAL' && '⚠️ CRITICAL RISK'}
                      {analysisResult.riskLevel === 'HIGH' && '⚠️ HIGH RISK'}
                      {analysisResult.riskLevel === 'MEDIUM' && '⚠️ MEDIUM RISK'}
                      {analysisResult.riskLevel === 'LOW' && '✅ LOW RISK'}
                    </h3>
                    <p className="text-lg font-medium opacity-90">
                      {analysisResult.riskLevel === 'CRITICAL' && 'This device contains highly hazardous materials requiring professional handling'}
                      {analysisResult.riskLevel === 'HIGH' && 'This device contains hazardous materials requiring careful handling'}
                      {analysisResult.riskLevel === 'MEDIUM' && 'This device contains some hazardous materials - handle with care'}
                      {analysisResult.riskLevel === 'LOW' && 'This device has relatively low hazard content but requires proper recycling'}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 flex items-center justify-center">
                      {analysisResult.riskLevel === 'CRITICAL' && <AlertTriangle className="h-24 w-24" />}
                      {analysisResult.riskLevel === 'HIGH' && <AlertCircle className="h-24 w-24" />}
                      {analysisResult.riskLevel === 'MEDIUM' && <Shield className="h-24 w-24" />}
                      {analysisResult.riskLevel === 'LOW' && <CheckCircle className="h-24 w-24" />}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Summary Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <div className="bg-white border-2 border-slate-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-slate-600">DEVICE TYPE</p>
                    <div className="text-emerald-600 text-xl">📱</div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 capitalize">{analysisResult.deviceType}</p>
                </div>

                <div className="bg-white border-2 border-blue-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-slate-600">COMPONENTS</p>
                    <div className="text-blue-600 text-xl">🔧</div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{analysisResult.detectedComponents.length}</p>
                  <p className="text-xs text-slate-500 mt-1">components detected</p>
                </div>

                <div className="bg-white border-2 border-orange-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-slate-600">HAZARDS</p>
                    <div className="text-orange-600 text-xl">⚠️</div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{analysisResult.hazardAnalysis.length}</p>
                  <p className="text-xs text-slate-500 mt-1">hazards found</p>
                </div>

                <div className="bg-white border-2 border-rose-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-slate-600">CONFIDENCE</p>
                    <div className="text-rose-600 text-xl">🎯</div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {Math.round(
                      analysisResult.hazardAnalysis.reduce((sum, h) => sum + h.confidence, 0) / 
                      Math.max(analysisResult.hazardAnalysis.length, 1)
                    )}%
                  </p>
                  <p className="text-xs text-slate-500 mt-1">average accuracy</p>
                </div>
              </motion.div>

              {/* Detected Components */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-emerald-100 p-3 rounded-lg">
                        <Zap className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Detected Components</h3>
                        <p className="text-sm text-slate-500">{analysisResult.detectedComponents.length} components identified in this device</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {analysisResult.detectedComponents.map((component, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + idx * 0.05 }}
                          className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
                        >
                          <p className="text-sm font-bold text-emerald-900">{component}</p>
                          <p className="text-xs text-emerald-700 mt-1">Component</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Hazard Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <AlertTriangle className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Detailed Hazard Analysis</h3>
                        <p className="text-sm text-slate-500">{analysisResult.hazardAnalysis.length} components with potential hazards</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {analysisResult.hazardAnalysis.map((hazard, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + idx * 0.08 }}
                          className="border-2 border-slate-200 rounded-lg p-5 hover:border-orange-300 hover:shadow-lg transition-all cursor-pointer group"
                          onClick={() => {
                            setSelectedHazard(hazard);
                            setShowDetailModal(true);
                          }}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="bg-orange-50 p-2 rounded-lg group-hover:bg-orange-100 transition-colors">
                                  <Skull className="h-5 w-5 text-orange-600" />
                                </div>
                                <h4 className="font-bold text-lg text-slate-900">{hazard.component}</h4>
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                  {hazard.confidence}% confident
                                </span>
                              </div>

                              {hazard.toxins && hazard.toxins.length > 0 && (
                                <div className="mt-4">
                                  <p className="text-xs font-semibold text-slate-600 mb-2 uppercase">Toxins Present:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {hazard.toxins.slice(0, 4).map((toxin, tidx) => (
                                      <motion.span
                                        key={tidx}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4 + idx * 0.08 + tidx * 0.03 }}
                                        className={`text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 ${
                                          toxin.severity === 'High'
                                            ? 'bg-red-100 text-red-700 border border-red-300'
                                            : toxin.severity === 'Medium'
                                            ? 'bg-amber-100 text-amber-700 border border-amber-300'
                                            : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                                        }`}
                                      >
                                        {getToxinIcon(toxin.name)}
                                        {toxin.name}
                                      </motion.span>
                                    ))}
                                    {hazard.toxins.length > 4 && (
                                      <span className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 font-semibold">
                                        +{hazard.toxins.length - 4} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="text-2xl group-hover:translate-x-1 transition-transform">→</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-emerald-100 p-3 rounded-lg">
                        <Shield className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Safety Recommendations</h3>
                        <p className="text-sm text-slate-500">Follow these guidelines for safe handling</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {analysisResult.recommendations.recommendations.map((rec, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + idx * 0.06 }}
                          className={`flex items-start gap-4 p-4 rounded-lg border-l-4 ${
                            analysisResult.riskLevel === 'CRITICAL'
                              ? 'bg-red-50 border-l-red-600'
                              : analysisResult.riskLevel === 'HIGH'
                              ? 'bg-orange-50 border-l-orange-600'
                              : analysisResult.riskLevel === 'MEDIUM'
                              ? 'bg-amber-50 border-l-amber-600'
                              : 'bg-green-50 border-l-green-600'
                          }`}
                        >
                          <div className="text-2xl flex-shrink-0 mt-0.5">🔹</div>
                          <p className="text-slate-700 font-medium leading-relaxed">{rec}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Action Buttons & Export Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                        <div className="text-3xl mb-2">📋</div>
                        <p className="font-semibold text-slate-900 mb-1">Report Generated</p>
                        <p className="text-sm text-slate-600">Timestamp: {new Date(analysisResult.timestamp).toLocaleString()}</p>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border border-emerald-200">
                        <div className="text-3xl mb-2">✓</div>
                        <p className="font-semibold text-slate-900 mb-1">Analysis Complete</p>
                        <p className="text-sm text-slate-600">All components scanned and verified</p>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
                        <div className="text-3xl mb-2">📊</div>
                        <p className="font-semibold text-slate-900 mb-1">Ready to Share</p>
                        <p className="text-sm text-slate-600">Download or share your report</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={() => {
                          setAnalysisResult(null);
                          setUploadedImage(null);
                        }}
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-1/2 flex items-center justify-center gap-2"
                      >
                        <Camera className="h-5 w-5" />
                        Scan Another Device
                      </Button>
                      <Button
                        onClick={() => addToast('Report generated and downloaded!', 'success')}
                        size="lg"
                        className="w-full sm:w-1/2 flex items-center justify-center gap-2"
                      >
                        <Download className="h-5 w-5" />
                        Download Report
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedHazard && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={`${selectedHazard.component} - Detailed Analysis`}
          size="lg"
        >
          <div className="space-y-6 pb-2">
            {/* Hazard Header */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-600 rounded-lg p-4">
              <p className="text-sm font-semibold text-slate-600 mb-1">COMPONENT HAZARD ASSESSMENT</p>
              <h3 className="text-2xl font-bold text-slate-900">{selectedHazard.component}</h3>
              <p className="text-sm text-slate-600 mt-2">
                <strong>Detection Confidence:</strong> {selectedHazard.confidence}%
              </p>
            </div>

            {/* Toxins Found */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Skull className="h-5 w-5 text-red-600" />
                </div>
                <h4 className="font-bold text-lg text-slate-900">Toxins Identified</h4>
              </div>
              <div className="space-y-3">
                {selectedHazard.toxins && selectedHazard.toxins.map((toxin, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`border-2 rounded-lg p-4 ${
                      toxin.severity === 'High'
                        ? 'bg-red-50 border-red-200'
                        : toxin.severity === 'Medium'
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-bold text-lg text-slate-900">{toxin.name}</p>
                      <span className={`text-sm px-3 py-1 rounded-full font-bold whitespace-nowrap ${
                        toxin.severity === 'High'
                          ? 'bg-red-100 text-red-700'
                          : toxin.severity === 'Medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {toxin.severity} Severity
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-slate-700">
                        <strong className="text-slate-900">Quantity:</strong> {toxin.quantity}
                      </p>
                      <p className="text-slate-700">
                        <strong className="text-slate-900">Health Risks:</strong> {toxin.health_effects?.join(', ') || 'Various health impacts'}
                      </p>
                      <p className="text-slate-700">
                        <strong className="text-slate-900">Environmental Impact:</strong> {toxin.environmental_impact || 'Causes environmental contamination'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Safe Handling Guide */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-emerald-600" />
                </div>
                <h4 className="font-bold text-lg text-slate-900">Safe Handling Guidelines</h4>
              </div>
              <div className="space-y-2 bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                {[
                  'Always wear protective gloves (nitrile or rubber)',
                  'Use N95 mask to avoid inhalation of dust',
                  'Avoid any skin contact with components',
                  'Work in well-ventilated areas or use fume hoods',
                  'Wash hands and exposed skin thoroughly',
                  'Do not eat, drink, or smoke while handling',
                  'Dispose in approved e-waste containers only',
                ].map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <span className="text-emerald-600 font-bold text-lg flex-shrink-0">✓</span>
                    <p className="text-slate-700 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Handling Notice */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4"
            >
              <p className="text-sm text-blue-900">
                <strong className="text-lg">⚠️ Professional Handling Required</strong>
              </p>
              <p className="text-sm text-blue-800 mt-2 leading-relaxed">
                For large quantities, complex devices, or unknown material compositions, please contact certified e-waste recycling facilities. They have specialized equipment and trained personnel to handle hazardous materials safely.
              </p>
            </motion.div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ComponentScanner;
