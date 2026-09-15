import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  Activity, 
  Wind, 
  Gauge, 
  Sparkles,
  Layers,
  Compass,
  Navigation,
  Info
} from 'lucide-react';
import { PredictionResult, MultiPredictionResult } from '../types';
import { evaluateCycloneType } from '../services/cyclonePrediction';

interface PredictionResultCardProps {
  prediction: PredictionResult | null;
  multiPrediction?: MultiPredictionResult | null;
  activeImageName?: string;
  isPredicting: boolean;
  predictionStep: string;
}

export default function PredictionResultCard({
  prediction,
  multiPrediction,
  activeImageName,
  isPredicting,
  predictionStep,
}: PredictionResultCardProps) {
  if (isPredicting) {
    return (
      <div
        id="prediction-loading-card"
        className="bg-white rounded-2xl border border-[#FF654E]/30 shadow-[0_4px_25px_rgba(255,101,78,0.08)] p-8 text-center"
      >
        <div className="max-w-md mx-auto space-y-4">
          {/* Animated Spinner with Coral Accent */}
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-[#FAF7F2] border-t-[#FF654E] animate-spin"></div>
            <Sparkles className="w-6 h-6 text-[#FF654E] animate-pulse" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#2D2320]">
              Processing Multi-Source Satellite Imagery
            </h3>
            <p className="text-sm font-medium text-[#FF654E] min-h-[1.5rem] transition-all">
              {predictionStep || 'Evaluating vortex structures and intensity variations...'}
            </p>
          </div>

          {/* Simple step indicator dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <span
              className={`h-2 rounded-full transition-all duration-300 ${
                predictionStep.includes('Analyzing') || predictionStep.includes('imagery')
                  ? 'w-6 bg-[#FF654E]'
                  : 'w-2 bg-[#EADFCF]'
              }`}
            />
            <span
              className={`h-2 rounded-full transition-all duration-300 ${
                predictionStep.includes('Validating') || predictionStep.includes('intensity')
                  ? 'w-6 bg-[#FF654E]'
                  : 'w-2 bg-[#EADFCF]'
              }`}
            />
            <span
              className={`h-2 rounded-full transition-all duration-300 ${
                predictionStep.includes('Running') || predictionStep.includes('comparison')
                  ? 'w-6 bg-[#FF654E]'
                  : 'w-2 bg-[#EADFCF]'
              }`}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return null;
  }

  const isCyclone = prediction.cycloneDetected;
  const hasMultiple = multiPrediction && multiPrediction.items.length > 1;
  const movementDegree = prediction.movementDegree ?? 295;
  const movementDir = prediction.movementDirection || (isCyclone ? 'West-Northwest (WNW)' : 'Stationary');
  const forwardSpeed = prediction.forwardSpeed ?? (isCyclone ? 18 : 0);

  return (
    <div
      id="cyclone-prediction-result-card"
      className="bg-white rounded-2xl border border-[#EBE4D8] shadow-[0_6px_30px_rgba(45,35,32,0.06)] overflow-hidden transition-all space-y-0"
    >
      {/* Top Banner with Active Image Badge */}
      <div className="bg-[#FAF7F2] px-6 py-4 border-b border-[#EAE2D5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-[#FF654E]"></span>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#2D2320] uppercase tracking-wider flex items-center gap-2">
              Cyclone Prediction Result
            </h3>
            {activeImageName && (
              <p className="text-xs text-[#7D7068] truncate max-w-xs sm:max-w-md">
                Active source: <span className="font-semibold text-[#2D2320]">{activeImageName}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hasMultiple && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FAF0E6] text-[#804020] border border-[#EADFCF]">
              <Layers className="w-3.5 h-3.5 text-[#FF654E]" />
              Multi-Image Analysis ({multiPrediction.items.length} Images)
            </span>
          )}

          {prediction.isDemo ? (
            <span
              id="demo-prediction-badge"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFEDE8] text-[#D94935] border border-[#FFD3C7]"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Demo Prediction
            </span>
          ) : (
            <span
              id="ai-vision-badge"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
              AI Vision Analysis
            </span>
          )}
          <span className="text-xs text-[#8C7E76]">
            {prediction.timestamp}
          </span>
        </div>
      </div>

      {/* Main Results Grid */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
          {/* Status */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F2]/80 border border-[#EAE3D6]">
            <span className="text-xs font-semibold text-[#7D7068] block mb-1">
              Status
            </span>
            <div className="flex items-center gap-1.5">
              {isCyclone ? (
                <ShieldAlert className="w-4 h-4 text-[#FF654E] shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" />
              )}
              <span className="text-xs sm:text-sm font-bold text-[#2D2320]">
                {isCyclone ? 'Cyclone' : 'No Cyclone'}
              </span>
            </div>
          </div>

          {/* Classification */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F2]/80 border border-[#EAE3D6] col-span-2 md:col-span-2 lg:col-span-2">
            <span className="text-xs font-semibold text-[#7D7068] block mb-1">
              Classification
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#2D2320] block truncate" title={prediction.classification}>
              {prediction.classification}
            </span>
          </div>

          {/* Predicted Wind Speed */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F2]/80 border border-[#EAE3D6]">
            <span className="text-xs font-semibold text-[#7D7068] block mb-1">
              Wind Speed
            </span>
            <div className="flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-[#FF654E] shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-[#2D2320]">
                {prediction.predictedWindSpeed} <span className="text-[10px] font-medium text-[#7D7068]">km/h</span>
              </span>
            </div>
          </div>

          {/* Direction of Travel (Requested Metric) */}
          <div className="p-3.5 rounded-xl bg-[#FFF5F2] border border-[#FFDDD5] col-span-2 md:col-span-2 lg:col-span-1">
            <span className="text-xs font-bold text-[#D94935] block mb-1">
              Travel Direction
            </span>
            <div className="flex items-center gap-1.5">
              <Navigation 
                className="w-4 h-4 text-[#FF654E] shrink-0 transition-transform duration-500" 
                style={{ transform: `rotate(${movementDegree}deg)` }} 
              />
              <div className="truncate">
                <span className="text-xs sm:text-sm font-extrabold text-[#2D2320] block truncate" title={`${movementDir} (${movementDegree}°)`}>
                  {isCyclone ? `${movementDir.split('(')[1]?.replace(')', '') || movementDir} (${movementDegree}°)` : 'None'}
                </span>
                {isCyclone && (
                  <span className="text-[10px] font-medium text-[#7D7068] block">
                    {forwardSpeed} km/h fwd
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Development */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F2]/80 border border-[#EAE3D6]">
            <span className="text-xs font-semibold text-[#7D7068] block mb-1">
              Stage
            </span>
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#FF654E] shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-[#2D2320]">
                {prediction.developmentStage}
              </span>
            </div>
          </div>

          {/* Risk */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F2]/80 border border-[#EAE3D6]">
            <span className="text-xs font-semibold text-[#7D7068] block mb-1">
              Risk
            </span>
            <span
              className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                prediction.riskLevel === 'High' || prediction.riskLevel === 'Very High'
                  ? 'bg-[#FFEDE8] text-[#D94935]'
                  : prediction.riskLevel === 'Moderate'
                  ? 'bg-[#FEF3C7] text-[#92400E]'
                  : 'bg-[#ECFDF5] text-[#065F46]'
              }`}
            >
              {prediction.riskLevel}
            </span>
          </div>
        </div>

        {/* Trajectory & Movement Highlight Bar */}
        {isCyclone && (
          <div className="p-4 rounded-xl bg-[#FFF8F6] border border-[#FFD9CF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FF654E] flex items-center justify-center text-white shrink-0 shadow-xs">
                <Compass className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="font-extrabold text-[#2D2320] text-sm block">
                  Cyclone Motion Vector: {movementDir} ({movementDegree}°)
                </span>
                <span className="text-[#6E5D55]">
                  Translating forward at <strong>{forwardSpeed} km/h</strong> under steering flow
                </span>
              </div>
            </div>

            {prediction.estimatedLandfall && (
              <div className="px-3 py-1.5 rounded-lg bg-white border border-[#FFDDD5] text-right sm:text-left self-start sm:self-auto">
                <span className="text-[10px] uppercase font-bold text-[#A84838] block tracking-wider">
                  Projected Coastal Corridor
                </span>
                <span className="font-bold text-[#2D2320]">
                  {prediction.estimatedLandfall}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Diagnostic Explanation Banner */}
        {prediction.summaryExplanation && (
          <div
            className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-3 ${
              !isCyclone
                ? 'bg-[#FEF9E7] border-[#FDE68A] text-[#92400E]'
                : 'bg-[#FAF7F2] border-[#EAE2D5] text-[#4A3E38]'
            }`}
          >
            {!isCyclone ? (
              <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
            ) : (
              <Activity className="w-5 h-5 text-[#FF654E] shrink-0 mt-0.5" />
            )}
            <div>
              <strong className="font-bold block mb-0.5">
                {!isCyclone ? 'Analysis Finding:' : 'Meteorological Assessment:'}
              </strong>
              <p className="leading-relaxed">
                {prediction.summaryExplanation}
              </p>
            </div>
          </div>
        )}

        {/* Cyclone Type (3 Key Features Evaluation: Location, Core Temp, Size/Structure) */}
        {(() => {
          const typeAnalysis =
            prediction.cycloneTypeAnalysis ||
            evaluateCycloneType(
              prediction.parameters || {},
              prediction.classification,
              prediction.cycloneDetected,
              activeImageName || ''
            );

          const isNonCyclonic = typeAnalysis.cycloneType === 'None (Non-Cyclonic)';

          const categoryBadgeStyles: Record<string, string> = {
            'Tropical Cyclone': 'bg-[#FFF0EC] text-[#FF654E] border-[#FFD9CF]',
            'Extratropical (Mid-Latitude) Cyclone': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
            'Polar Cyclone': 'bg-[#F0FDF4] text-[#059669] border-[#BBF7D0]',
            'Mesocyclone': 'bg-[#FAF5FF] text-[#9333EA] border-[#E9D5FF]',
            'None (Non-Cyclonic)': 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]',
          };

          const badgeClass = categoryBadgeStyles[typeAnalysis.cycloneType] || 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]';

          return (
            <div
              id="cyclone-type-result-box"
              className={`p-4 sm:p-5 rounded-xl border space-y-3.5 ${
                isNonCyclonic
                  ? 'bg-[#FAF8F5] border-[#E8E1D5]'
                  : 'bg-[#FFF9F7] border-[#FFD9CF]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAE2D5] pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7D7068]">
                    Cyclone Type:
                  </span>
                  <span className={`text-xs sm:text-sm font-extrabold px-2.5 py-0.5 rounded-md border ${badgeClass}`}>
                    {typeAnalysis.cycloneType}
                  </span>
                </div>
                <span className="text-[11px] text-[#7D7068] font-semibold">
                  Evaluated from Location, Core Temp & Size/Structure
                </span>
              </div>

              <div className="space-y-1.5">
                <strong className="text-xs font-bold text-[#2D2320] block">
                  Reasoning:
                </strong>
                <ul className="space-y-1.5 text-xs text-[#4A3E38]">
                  {typeAnalysis.reasoning.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${isNonCyclonic ? 'bg-[#7D7068]' : 'bg-[#FF654E]'}`} />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-white border border-[#EAE2D5] text-xs text-[#4A3E38] flex items-start gap-2.5">
                {isNonCyclonic ? (
                  <Info className="w-4 h-4 text-[#7D7068] shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-[#FF654E] shrink-0 mt-0.5" />
                )}
                <div>
                  <strong className={`font-bold mr-1 ${isNonCyclonic ? 'text-[#4B5563]' : 'text-[#FF654E]'}`}>
                    Safety/Info Note:
                  </strong>
                  <span>{typeAnalysis.safetyInfoNote}</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Prototype Scientific Notice */}
        <div className="p-3.5 rounded-xl bg-[#FFF9F7] border border-[#FFD9CF] text-xs text-[#805045] flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#FF654E] shrink-0 mt-0.5" />
          <p>
            <strong>Smart India Hackathon 2026 Multi-Source Verification:</strong> Satellite imagery is analyzed for spiral vortex geometry, kinematic wind shear, and direction of travel to estimate propagation headings towards vulnerable coastal corridors.
          </p>
        </div>
      </div>
    </div>
  );
}

