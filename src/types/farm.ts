export interface FarmZone {
  id: string;
  name: string;
  category: 'Open Field' | 'Greenhouse' | 'Terrace Orchard';
  crop: string;
  variety: string;
  plantingDate: string;
  harvestTarget: string;
  areaHectares: number;
  stage: string;
  healthScore: number;
  image: string;
  sensors: {
    soilMoisture: number; // percentage
    soilTemp: number; // Celsius
    soilPh: number;
    nitrogen: number; // mg/kg
    phosphorus: number; // mg/kg
    potassium: number; // mg/kg
    ambientTemp: number; // Celsius
    ambientHumidity: number; // percentage
    solarRadiation: number; // W/m2
    vpd: number; // kPa (Vapor Pressure Deficit)
  };
  irrigation: {
    valveStatus: 'OPEN' | 'CLOSED' | 'AUTO';
    flowRateLpm: number;
    dailyVolumeLiters: number;
    lastIrrigationTime: string;
    nextScheduledTime: string;
    targetMoisturePercent: number;
  };
  ndviStats: {
    averageNdvi: number; // 0.0 to 1.0
    vigorousPercent: number;
    moderatePercent: number;
    stressedPercent: number;
    lastDroneFlight: string;
  };
}

export interface DiseaseDiagnosisResult {
  diseaseName: string;
  confidenceScore: number;
  severityLevel: 'Rendah' | 'Sedang' | 'Kritis';
  pathogenType: string;
  symptomsAnalysis: string;
  rootCause: string;
  immediateActions: string[];
  treatmentPlan: {
    organicSolution: string;
    chemicalSolution: string;
    applicationTiming: string;
    safetyWithdrawal: string;
  };
  preventionTips: string[];
}

export interface WeatherDay {
  day: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  rainProbability: number;
  et0: number; // Evapotranspiration in mm/day
  windSpeedKmh: number;
}
