export interface EnvironmentalParameters {
  windSpeed: number; // km/h
  seaSurfaceTemperature: number; // °C
  atmosphericPressure: number; // hPa
  windDirection: number; // degrees
  latitude: number; // degrees N
  longitude: number; // degrees E
  rainfall: number; // mm
}

export type DevelopmentStage = 'Intensifying' | 'Steady' | 'Weakening' | 'Dissipating';
export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Very High';

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
  parameters?: EnvironmentalParameters; // Image-specific atmospheric parameters
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

