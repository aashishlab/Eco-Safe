// AI Hazard Analyzer - Integrates with Google Gemini API for image analysis
// For production use, consider using TensorFlow.js or Google Vision API

import electronicsData from '../data/electronics.json';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Comprehensive prompt for analyzing e-waste hazards
const HAZARD_ANALYSIS_PROMPT = `
You are an expert environmental hazard analyst specializing in electronic waste (e-waste). 
Analyze the uploaded image of an electronic device and provide a detailed JSON response.

IMPORTANT: Respond ONLY with valid JSON in the following exact format:
{
  "deviceType": "type of device detected from image",
  "detectedComponents": ["component1", "component2", ...],
  "hazardAnalysis": [
    {
      "component": "component name",
      "confidence": 85,
      "toxins": [
        {
          "name": "toxin name",
          "severity": "High/Medium/Low",
          "quantity": "approximate amount",
          "health_effects": ["effect1", "effect2"],
          "environmental_impact": "description"
        }
      ]
    }
  ],
  "riskLevel": "CRITICAL/HIGH/MEDIUM/LOW",
  "recommendations": {
    "recommendations": [
      "recommendation 1",
      "recommendation 2"
    ]
  }
}

Guidelines:
1. FIRST identify what type of electronic device this is (smartphone, laptop, tablet, monitor, printer, etc.)
2. Identify ALL visible components in the image
3. For each component, identify potential hazardous materials (lead, mercury, cadmium, beryllium, lithium, etc.)
4. Assess severity based on toxin quantity and exposure risk
5. Provide specific, actionable safety recommendations
6. Be thorough but accurate - don't overstate risks
7. Base your analysis SOLELY on what you can see in the image

Risk Level Criteria:
- CRITICAL: Multiple high-severity toxins, immediate danger
- HIGH: At least one high-severity toxin or multiple medium-severity
- MEDIUM: Some hazardous materials present
- LOW: Minimal hazardous content

Analyze this image carefully and respond with the JSON structure above.`;

export const analyzeDeviceImage = async (imageData) => {
  try {
    // Check if API key exists
    if (!GEMINI_API_KEY) {
      console.warn('Gemini API key not found. Using mock data.');
      return await analyzeWithMockData(imageData);
    }

    // Convert base64 image to blob for API
    const base64Data = imageData.split(',')[1];
    
    const payload = {
      contents: [{
        parts: [
          {
            text: HAZARD_ANALYSIS_PROMPT  // ← AI detects everything from image
          },
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: base64Data
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    };

    const response = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Parse the AI response
    const aiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Extract JSON from the response (in case there's extra text)
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI');
    }

    const analysis = JSON.parse(jsonMatch[0]);
    
    return {
      success: true,
      ...analysis,
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // Fallback to mock data if API fails
    return await analyzeWithMockData(imageData, deviceType);
  }
};

// Mock function as fallback
const analyzeWithMockData = async (imageData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock device type detection
  const deviceType = 'electronic_device';
  
  // Mock component detection
  const detectedComponents = ['Circuit Board', 'Battery', 'Electronic Components'];
  
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
