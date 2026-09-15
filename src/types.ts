export interface EnvironmentalParameters {
  windSpeed: number; // km/h
  seaSurfaceTemperature: number; // °C
  atmosphericPressure: number; // hPa
  windDirection: number; // degrees
  latitude: number; // degrees N
  longitude: number; // degrees E
  rainfall: number; // mm
  coreType?: string; // 'Warm-core' | 'Cold-core' | 'Convective Updraft' | 'Stable / Non-Cyclonic'
  systemStructure?: string; // 'Massive Symmetric Spiral' | 'Frontal Comma System' | 'Compact Polar Low' | 'Local Thunderstorm Mesocyclone' | 'Diffuse / Clear Sky'
}

export type DevelopmentStage = 'Intensifying' | 'Steady' | 'Weakening' | 'Dissipating';
export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Very High';

export type CycloneTypeCategory = 
  | 'Tropical Cyclone' 
  | 'Extratropical (Mid-Latitude) Cyclone' 
  | 'Polar Cyclone' 
  | 'Mesocyclone'
  | 'None (Non-Cyclonic)';

export interface CycloneTypeAnalysis {
  cycloneType: CycloneTypeCategory;
  locationLatitude: string;
  energySource: string;
  sizeAndStructure: string;
  reasoning: string[];
  safetyInfoNote: string;
}

export interface IntensityDataPoint {
  time: string;
  windSpeed: number; // km/h
  isProjected?: boolean;
}

export interface PredictionResult {
  cycloneDetected: boolean;
  classification: string;
  predictedWindSpeed: number; // km/h
  confidence: number; // %
  developmentStage: DevelopmentStage;
  riskLevel: RiskLevel;
  summaryExplanation: string;
  intensityHistory: IntensityDataPoint[];
  timestamp: string;
  isDemo: boolean;
  movementDirection?: string; // Cardinal & compass direction e.g. "West-Northwest (WNW)"
  movementDegree?: number; // Azimuth degree heading 0-360
  forwardSpeed?: number; // Forward translation speed in km/h
  estimatedLandfall?: string; // Estimated landfall location and timeframe
  pressureDeficit?: number; // Ambient vs core pressure deficit (hPa)
  parameters?: EnvironmentalParameters; // Image-specific atmospheric parameters
  cycloneTypeAnalysis?: CycloneTypeAnalysis; // 3-feature classification analysis
}

export interface PredictionInput {
  satelliteImage: string | null;
  imageName?: string;
  windSpeed: number;
  seaSurfaceTemperature: number;
  atmosphericPressure: number;
  windDirection: number;
  latitude: number;
  longitude: number;
  rainfall: number;
  coreType?: string;
  systemStructure?: string;
}

export interface SatelliteImageItem {
  id: string;
  dataUrl: string;
  name: string;
  size?: number;
  parameters?: EnvironmentalParameters;
}

export interface ImagePredictionItem {
  imageId: string;
  imageName: string;
  dataUrl: string;
  prediction: PredictionResult;
  parameters?: EnvironmentalParameters; // Image-specific atmospheric parameters
}

export interface ComparisonSummary {
  totalImages: number;
  cycloneCount: number;
  nonCycloneCount: number;
  maxIntensity: number;
  minIntensity: number;
  intensityDelta: number;
  maxIntensityImageName: string;
  minIntensityImageName: string;
}

export interface MultiPredictionResult {
  items: ImagePredictionItem[];
  selectedImageId: string;
  comparison: ComparisonSummary;
}

