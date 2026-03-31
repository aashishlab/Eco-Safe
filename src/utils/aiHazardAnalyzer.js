// Mock AI Hazard Analyzer - Simulates component detection and risk assessment
// In production, this would integrate with TensorFlow.js, Google Vision API, or similar

import electronicsData from '../data/electronics.json';

export const analyzeDeviceImage = async (imageData, deviceType) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock component detection based on device type
  const detectedComponents = getComponentsForDevice(deviceType);
  
  // Get hazard information from our database
  const hazardAnalysis = detectedComponents.map(comp => {
    const deviceInfo = electronicsData.find(e => 
      e.name.toLowerCase().includes(comp.toLowerCase())
    );
    
    return {
      component: comp,
      ...deviceInfo,
      confidence: Math.floor(Math.random() * 30 + 70), // 70-99% confidence
    };
  });

  // Calculate overall risk level
  const riskLevel = calculateRiskLevel(hazardAnalysis);
  
  return {
    success: true,
    deviceType,
    detectedComponents,
    hazardAnalysis,
    riskLevel,
    recommendations: getRecommendations(riskLevel, hazardAnalysis),
    timestamp: new Date().toISOString(),
  };
};

const getComponentsForDevice = (deviceType) => {
  const componentMap = {
    'smartphone': ['Circuit Board', 'Battery', 'Display', 'Camera Module'],
    'laptop': ['Motherboard', 'Battery', 'Display', 'CPU Cooling Fan'],
    'tablet': ['Circuit Board', 'Battery', 'Display', 'Processor'],
    'monitor': ['Display Panel', 'Power Supply', 'Circuit Board'],
    'keyboard': ['Circuit Board', 'Plastic Housing', 'Metal Contacts'],
    'mouse': ['Circuit Board', 'Plastic Housing', 'Optical Sensor'],
    'printer': ['Toner Cartridge', 'Circuit Board', 'Motor', 'Power Supply'],
    'headphones': ['Speaker Unit', 'Circuit Board', 'Battery', 'Metal Connectors'],
    'charger': ['Power Supply', 'Circuit Board', 'Transformer'],
    'other': ['Circuit Board', 'Battery', 'Power Supply', 'Metal Components'],
  };

  return componentMap[deviceType.toLowerCase()] || componentMap.other;
};

const calculateRiskLevel = (hazardAnalysis) => {
  if (!hazardAnalysis || hazardAnalysis.length === 0) return 'LOW';

  const toxins = hazardAnalysis.flatMap(h => h.toxins || []);
  const severeCounts = toxins.filter(t => t.severity === 'High').length;
  const moderateCounts = toxins.filter(t => t.severity === 'Medium').length;

  if (severeCounts >= 3) return 'CRITICAL';
  if (severeCounts >= 1 || moderateCounts >= 3) return 'HIGH';
  if (moderateCounts >= 1) return 'MEDIUM';
  return 'LOW';
};

const getRecommendations = (riskLevel, hazardAnalysis) => {
  const baseRecommendations = {
    'CRITICAL': [
      '⚠️ HIGH DANGER - Do not attempt to disassemble this device',
      '🏭 Take to certified e-waste recycling facility immediately',
      '🧤 Use personal protective equipment when handling',
      '🏥 Seek medical attention if exposure occurs',
      '📞 Report to environmental authorities if improperly disposed',
    ],
    'HIGH': [
      '⚠️ Contains hazardous materials - Handle carefully',
      '🥽 Wear gloves and mask when handling',
      '♻️ Take to certified recycling center',
      '👨‍⚕️ Get health screening if chronically exposed',
      '🚫 Never burn or chemically process',
    ],
    'MEDIUM': [
      '🟡 Contains some hazardous materials',
      '🧤 Use basic protective equipment',
      '♻️ Recycle responsibly at certified facility',
      '💧 Dispose safely to prevent water contamination',
      '📚 Learn more about proper handling',
    ],
    'LOW': [
      '🟢 Relatively low hazard content',
      '♻️ Can be recycled at most facilities',
      '📍 Find nearest recycling center',
      '✅ Still requires proper disposal',
      '💡 Support e-waste recycling initiatives',
    ],
  };

  const riskColors = {
    'CRITICAL': '#dc2626',
    'HIGH': '#ea580c',
    'MEDIUM': '#f59e0b',
    'LOW': '#10b981',
  };

  return {
    recommendations: baseRecommendations[riskLevel] || baseRecommendations.LOW,
    color: riskColors[riskLevel],
    riskLevel,
  };
};

export const getDetailedToxinInfo = (toxin) => {
  return {
    health_effects: toxin.health_effects || [],
    environmental_impact: toxin.environmental_impact || 'Causes bioaccumulation in ecosystems',
    safe_handling: [
      'Wear protective equipment',
      'Avoid inhalation of dust',
      'Prevent skin contact',
      'Use in well-ventilated areas',
    ],
  };
};
