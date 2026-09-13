import { 
  ShieldAlert, 
  Wind, 
  Gauge, 
  CheckCircle2, 
  Compass, 
  Thermometer, 
  CloudRain, 
  MapPin, 
  TrendingUp, 
  Info,
  Layers,
  Navigation,
  Milestone
} from 'lucide-react';
import { EnvironmentalParameters, PredictionResult, MultiPredictionResult } from '../types';
import IntensityLineChart from './IntensityLineChart';
import MultiImageComparison from './MultiImageComparison';

interface CycloneDashboardProps {
  prediction: PredictionResult;
  parameters: EnvironmentalParameters;
  multiPrediction?: MultiPredictionResult | null;
  selectedImageId?: string;
  onSelectImage?: (id: string) => void;
  activeImageName?: string;
}

export default function CycloneDashboard({
  prediction,
  parameters,
  multiPrediction,
  selectedImageId = '',
  onSelectImage = () => {},
  activeImageName,
}: CycloneDashboardProps) {
  const isCyclone = prediction.cycloneDetected;
  const hasMultiple = multiPrediction && multiPrediction.items.length > 1;
  const movementDegree = prediction.movementDegree ?? 295;
  const movementDirection = prediction.movementDirection || (isCyclone ? 'West-Northwest (WNW)' : 'Stationary');
  const forwardSpeed = prediction.forwardSpeed ?? (isCyclone ? 18 : 0);
  const estimatedLandfall = prediction.estimatedLandfall || (isCyclone ? 'North Andhra & South Odisha Coast (~28-36h)' : 'None');

  return (
    <section id="cyclone-dashboard-section" className="space-y-8 scroll-mt-24">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EADFCF] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF654E] flex items-center justify-center text-white shadow-sm">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#2D2320]">
              Cyclone Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-[#7D7068]">
              {hasMultiple 
                ? `Comparing ${multiPrediction.items.length} satellite inputs • Showing in-depth telemetry for ${activeImageName || 'selected source'}`
                : 'Consolidated intelligence, real-time parameter breakdown, and travel track'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasMultiple && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFEDE8] text-[#D94935] border border-[#FFD3C7] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              {multiPrediction.comparison.cycloneCount} Cyclones / {multiPrediction.items.length} Images
            </span>
          )}
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-[#E8E0D2] text-[#5C4F48]">
            SIH Telemetry
          </span>
        </div>
      </div>

      {/* MULTI-IMAGE INTENSITY COMPARISON SECTION */}
      {hasMultiple && multiPrediction && (
        <MultiImageComparison
          multiPrediction={multiPrediction}
          selectedImageId={selectedImageId}
          onSelectImage={onSelectImage}
        />
      )}

      {/* TOP CARDS (5 responsive cards including Travel Direction) for Active Image */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Top Card 1: Cyclone Status */}
        <div className="bg-white rounded-2xl border border-[#EBE4D8] p-5 shadow-[0_4px_20px_rgba(45,35,32,0.03)] hover:shadow-md transition-shadow col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#7D7068] uppercase tracking-wider">
              Cyclone Status
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] flex items-center justify-center text-[#FF654E]">
              {isCyclone ? (
                <ShieldAlert className="w-4 h-4" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              )}
            </div>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-[#2D2320] truncate">
            {isCyclone ? 'Cyclone Detected' : 'No Cyclone'}
          </div>
          <span className="text-xs text-[#8C7E76] mt-1 block truncate">
            {isCyclone ? 'Active Tropical System' : 'Normal Conditions'}
          </span>
        </div>

        {/* Top Card 2: Wind Speed */}
        <div className="bg-white rounded-2xl border border-[#EBE4D8] p-5 shadow-[0_4px_20px_rgba(45,35,32,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#7D7068] uppercase tracking-wider">
              Wind Speed
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] flex items-center justify-center text-[#FF654E]">
              <Wind className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-[#2D2320]">
            {prediction.predictedWindSpeed} <span className="text-sm font-semibold text-[#7D7068]">km/h</span>
          </div>
          <span className="text-xs text-[#8C7E76] mt-1 block">
            Maximum sustained winds
          </span>
        </div>

        {/* Top Card 3: Pressure */}
        <div className="bg-white rounded-2xl border border-[#EBE4D8] p-5 shadow-[0_4px_20px_rgba(45,35,32,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#7D7068] uppercase tracking-wider">
              Pressure
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] flex items-center justify-center text-[#FF654E]">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-[#2D2320]">
            {parameters.atmosphericPressure} <span className="text-sm font-semibold text-[#7D7068]">hPa</span>
          </div>
          <span className="text-xs text-[#8C7E76] mt-1 block">
            Estimated central minimum
          </span>
        </div>

        {/* Top Card 4: Direction of Travel (Requested Metric) */}
        <div className="bg-white rounded-2xl border border-[#FFD9CF] p-5 shadow-[0_4px_20px_rgba(255,101,78,0.06)] hover:shadow-md transition-shadow bg-gradient-to-b from-[#FFFDFD] to-[#FFF8F6]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#D94935] uppercase tracking-wider">
              Travel Direction
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#FFEDE8] flex items-center justify-center text-[#FF654E]">
              <Navigation 
                className="w-4 h-4 transition-transform duration-500" 
                style={{ transform: `rotate(${movementDegree}deg)` }} 
              />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-[#2D2320] truncate" title={`${movementDirection} (${movementDegree}°)`}>
            {isCyclone ? `${movementDirection.split('(')[1]?.replace(')', '') || movementDirection} (${movementDegree}°)` : 'Stationary'}
          </div>
          <span className="text-xs text-[#8C7E76] mt-1 block truncate">
            {isCyclone ? `${forwardSpeed} km/h translation` : 'No storm track'}
          </span>
        </div>

        {/* Top Card 5: Confidence */}
        <div className="bg-white rounded-2xl border border-[#EBE4D8] p-5 shadow-[0_4px_20px_rgba(45,35,32,0.03)] hover:shadow-md transition-shadow col-span-2 md:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#7D7068] uppercase tracking-wider">
              Confidence
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] flex items-center justify-center text-[#FF654E]">
              <span className="text-xs font-black">%</span>
            </div>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-[#2D2320]">
            {prediction.confidence}%
          </div>
          <span className="text-xs text-[#8C7E76] mt-1 block">
            Multi-modal ensemble match
          </span>
        </div>
      </div>

      {/* SECTION 1: “Cyclone Parameters” (8 cards including Travel Direction & Heading) */}
      <div className="bg-white rounded-2xl border border-[#EBE4D8] p-6 sm:p-7 shadow-[0_4px_25px_rgba(45,35,32,0.04)]">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="text-base font-bold text-[#2D2320] flex flex-wrap items-center gap-2">
              <span>Cyclone Parameters</span>
              {activeImageName && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#FFF0EC] text-[#FF654E] border border-[#FFD9CF] truncate max-w-[280px]" title={activeImageName}>
                  {activeImageName}
                </span>
              )}
            </h3>
            <p className="text-xs text-[#7D7068]">
              Individual meteorological boundary layer variables & translation telemetry for this active image
            </p>
          </div>
          <span className="text-xs font-semibold text-[#8C7E76]">
            8 Atmospheric Data Points
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {/* 1. Wind Speed */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D5] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#7D7068] mb-1">
              <span className="text-xs font-semibold">Wind Speed</span>
              <Wind className="w-3.5 h-3.5 text-[#FF654E]" />
            </div>
            <div className="text-base font-bold text-[#2D2320]">
              {parameters.windSpeed} <span className="text-xs font-normal text-[#8C7E76]">km/h</span>
            </div>
          </div>

          {/* 2. Sea Surface Temperature */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D5] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#7D7068] mb-1">
              <span className="text-xs font-semibold truncate">Sea Surface Temp</span>
              <Thermometer className="w-3.5 h-3.5 text-[#FF654E]" />
            </div>
            <div className="text-base font-bold text-[#2D2320]">
              {parameters.seaSurfaceTemperature} <span className="text-xs font-normal text-[#8C7E76]">°C</span>
            </div>
          </div>

          {/* 3. Atmospheric Pressure */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D5] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#7D7068] mb-1">
              <span className="text-xs font-semibold">Pressure</span>
              <Gauge className="w-3.5 h-3.5 text-[#FF654E]" />
            </div>
            <div className="text-base font-bold text-[#2D2320]">
              {parameters.atmosphericPressure} <span className="text-xs font-normal text-[#8C7E76]">hPa</span>
            </div>
          </div>

          {/* 4. Surface Wind Direction */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D5] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#7D7068] mb-1">
              <span className="text-xs font-semibold truncate">Surface Wind</span>
              <Compass className="w-3.5 h-3.5 text-[#FF654E]" />
            </div>
            <div className="text-base font-bold text-[#2D2320]">
              {parameters.windDirection}°
            </div>
          </div>

          {/* 5. Cyclone Travel Direction & Heading (Requested Metric) */}
          <div className="p-3.5 rounded-xl bg-[#FFF5F2] border border-[#FFD9CF] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#D94935] mb-1">
              <span className="text-xs font-bold truncate">Travel Dir</span>
              <Navigation 
                className="w-3.5 h-3.5 text-[#FF654E] transition-transform duration-500" 
                style={{ transform: `rotate(${movementDegree}deg)` }} 
              />
            </div>
            <div className="text-base font-extrabold text-[#2D2320]">
              {isCyclone ? `${movementDegree}°` : '0°'}
            </div>
            <span className="text-[10px] font-semibold text-[#8C7E76] truncate">
              {isCyclone ? `${movementDirection.split('(')[1]?.replace(')', '') || 'WNW'} • ${forwardSpeed}km/h` : 'Calm'}
            </span>
          </div>

          {/* 6. Latitude */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D5] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#7D7068] mb-1">
              <span className="text-xs font-semibold">Latitude</span>
              <MapPin className="w-3.5 h-3.5 text-[#FF654E]" />
            </div>
            <div className="text-base font-bold text-[#2D2320]">
              {parameters.latitude}° N
            </div>
          </div>

          {/* 7. Longitude */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D5] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#7D7068] mb-1">
              <span className="text-xs font-semibold">Longitude</span>
              <MapPin className="w-3.5 h-3.5 text-[#FF654E]" />
            </div>
            <div className="text-base font-bold text-[#2D2320]">
              {parameters.longitude}° E
            </div>
          </div>

          {/* 8. Rainfall */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D5] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#7D7068] mb-1">
              <span className="text-xs font-semibold">Rainfall</span>
              <CloudRain className="w-3.5 h-3.5 text-[#FF654E]" />
            </div>
            <div className="text-base font-bold text-[#2D2320]">
              {parameters.rainfall} <span className="text-xs font-normal text-[#8C7E76]">mm</span>
            </div>
          </div>
        </div>
      </div>

      {/* DEDICATED CYCLONE MOVEMENT & TRAJECTORY COMPASS SECTION */}
      <div className="bg-white rounded-2xl border border-[#EBE4D8] p-6 sm:p-7 shadow-[0_4px_25px_rgba(45,35,32,0.04)]">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#2D2320] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#FF654E]" />
              Cyclone Travel Direction & Trajectory Telemetry
            </h3>
            <p className="text-xs text-[#7D7068]">
              Steering ridge vector, propagation azimuth, and projected coastal impact corridor
            </p>
          </div>
          {isCyclone && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFF1ED] text-[#D94935] border border-[#FFD3C7] self-start sm:self-auto">
              Forward Translation: {forwardSpeed} km/h
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Visual Compass Rose Widget (4 columns on lg) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D5]">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Outer compass ring */}
              <div className="absolute inset-0 rounded-full border-2 border-[#E0D6C8] bg-white shadow-inner flex items-center justify-center">
                {/* Cardinal markers */}
                <span className="absolute top-1.5 text-[11px] font-black text-[#FF654E]">N</span>
                <span className="absolute bottom-1.5 text-[11px] font-bold text-[#7D7068]">S</span>
                <span className="absolute right-2 text-[11px] font-bold text-[#7D7068]">E</span>
                <span className="absolute left-2 text-[11px] font-bold text-[#7D7068]">W</span>

                {/* Intercardinal tick marks */}
                <span className="absolute top-4 right-5 text-[9px] font-semibold text-[#A89C94]">NE</span>
                <span className="absolute bottom-4 right-5 text-[9px] font-semibold text-[#A89C94]">SE</span>
                <span className="absolute bottom-4 left-5 text-[9px] font-semibold text-[#A89C94]">SW</span>
                <span className="absolute top-4 left-5 text-[9px] font-semibold text-[#A89C94]">NW</span>

                {/* Inner compass dial circle */}
                <div className="w-28 h-28 rounded-full border border-dashed border-[#D6CBC0] flex items-center justify-center bg-[#FAF8F5]/60">
                  {/* Rotating Arrow Needle */}
                  <div 
                    className="relative w-full h-full flex items-center justify-center transition-transform duration-700 ease-out"
                    style={{ transform: `rotate(${movementDegree}deg)` }}
                  >
                    {/* Arrow head pointing forward in travel direction */}
                    <div className="absolute -top-1 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[16px] border-b-[#FF654E] drop-shadow-xs"></div>
                    {/* Center needle line */}
                    <div className="w-0.5 h-16 bg-gradient-to-b from-[#FF654E] via-[#FF8573] to-[#7D7068] rounded-full"></div>
                    {/* Tail */}
                    <div className="absolute -bottom-0.5 w-2 h-2 rounded-full bg-[#7D7068]"></div>
                  </div>
                </div>
              </div>

              {/* Center Pivot Pin */}
              <div className="absolute w-3.5 h-3.5 rounded-full bg-[#2D2320] border-2 border-white shadow-xs z-10"></div>
            </div>

            <div className="mt-3 text-center">
              <span className="text-xs font-bold text-[#2D2320] block">
                {isCyclone ? `${movementDirection}` : 'Stationary System'}
              </span>
              <span className="text-[11px] font-medium text-[#7D7068]">
                Bearing: <strong>{movementDegree}° Azimuth</strong>
              </span>
            </div>
          </div>

          {/* Telemetry Details Cards (8 columns on lg) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Metric 1: Movement Direction */}
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D5]">
              <span className="text-xs font-semibold text-[#7D7068] block mb-1">
                Direction of Travel
              </span>
              <div className="text-lg font-extrabold text-[#2D2320] flex items-center gap-2">
                <Navigation 
                  className="w-4 h-4 text-[#FF654E] shrink-0" 
                  style={{ transform: `rotate(${movementDegree}deg)` }} 
                />
                <span>{movementDirection}</span>
              </div>
              <p className="text-xs text-[#8C7E76] mt-1">
                Azimuth angle of {movementDegree}° relative to true north
              </p>
            </div>

            {/* Metric 2: Forward Speed */}
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D5]">
              <span className="text-xs font-semibold text-[#7D7068] block mb-1">
                Forward Translation Speed
              </span>
              <div className="text-lg font-extrabold text-[#2D2320]">
                {forwardSpeed} <span className="text-xs font-normal text-[#7D7068]">km/h</span>
              </div>
              <p className="text-xs text-[#8C7E76] mt-1">
                Rate at which the storm center propagates along the track
              </p>
            </div>

            {/* Metric 3: Projected Landfall Corridor */}
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D5] sm:col-span-2">
              <span className="text-xs font-semibold text-[#7D7068] block mb-1 flex items-center gap-1.5">
                <Milestone className="w-3.5 h-3.5 text-[#FF654E]" />
                Projected Coastal Landfall & Impact Corridor
              </span>
              <div className="text-base font-bold text-[#2D2320]">
                {estimatedLandfall}
              </div>
              <p className="text-xs text-[#8C7E76] mt-1">
                Estimated based on Bay of Bengal mid-tropospheric steering ridge currents and forward translation velocity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: “Cyclone Intensity” (Line Chart) */}
      <div className="bg-white rounded-2xl border border-[#EBE4D8] p-6 sm:p-7 shadow-[0_4px_25px_rgba(45,35,32,0.04)]">
        <div className="mb-4">
          <h3 className="text-base font-bold text-[#2D2320]">
            Cyclone Intensity
          </h3>
          <p className="text-xs text-[#7D7068]">
            Observed wind speed trend and projected evolution over time
          </p>
        </div>

        <IntensityLineChart
          data={prediction.intensityHistory}
          developmentStage={prediction.developmentStage}
        />
      </div>

      {/* SECTION 3: “Prediction Summary” */}
      <div className="bg-white rounded-2xl border border-[#EBE4D8] p-6 sm:p-7 shadow-[0_4px_25px_rgba(45,35,32,0.04)]">
        <div className="mb-4">
          <h3 className="text-base font-bold text-[#2D2320]">
            Prediction Summary
          </h3>
          <p className="text-xs text-[#7D7068]">
            Key takeaways for disaster management and early warning authorities
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {/* Current Classification */}
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D5]">
            <span className="text-xs font-semibold text-[#7D7068] block mb-1">
              Current Classification
            </span>
            <span className="text-base font-bold text-[#2D2320] block">
              {prediction.classification}
            </span>
          </div>

          {/* Trend & Motion */}
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D5]">
            <span className="text-xs font-semibold text-[#7D7068] block mb-1">
              Trend & Motion
            </span>
            <span className="text-base font-bold text-[#2D2320] block">
              {prediction.developmentStage} ({movementDirection.split('(')[1]?.replace(')', '') || 'WNW'})
            </span>
          </div>

          {/* Risk Level */}
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D5]">
            <span className="text-xs font-semibold text-[#7D7068] block mb-1">
              Risk Level
            </span>
            <span className="text-base font-bold text-[#2D2320] block">
              {prediction.riskLevel}
            </span>
          </div>

          {/* Confidence */}
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D5]">
            <span className="text-xs font-semibold text-[#7D7068] block mb-1">
              Confidence
            </span>
            <span className="text-base font-bold text-[#2D2320] block">
              {prediction.confidence}%
            </span>
          </div>
        </div>

        {/* Short explanation */}
        <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] flex items-start gap-3">
          <Info className="w-5 h-5 text-[#FF654E] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#2D2320]">
              {prediction.summaryExplanation || 'Current environmental conditions indicate a strengthening cyclone pattern.'}
            </p>
            <p className="text-xs text-[#8C7E76] mt-1">
              Derived from coupled thermodynamic potential, low-shear environment, satellite vortex symmetry, and translation heading.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
