import { 
  ShieldAlert, 
  ShieldCheck, 
  Wind, 
  Gauge, 
  TrendingUp, 
  BarChart2, 
  Check, 
  ArrowRight,
  Sparkles,
  Navigation
} from 'lucide-react';
import { MultiPredictionResult } from '../types';

interface MultiImageComparisonProps {
  multiPrediction: MultiPredictionResult;
  selectedImageId: string;
  onSelectImage: (id: string) => void;
}

export default function MultiImageComparison({
  multiPrediction,
  selectedImageId,
  onSelectImage,
}: MultiImageComparisonProps) {
  const { items, comparison } = multiPrediction;

  if (!items || items.length <= 1) {
    return null;
  }

  // Maximum benchmark for comparative bars (e.g. 250 km/h for Super Cyclone)
  const maxBenchmark = Math.max(220, comparison.maxIntensity * 1.15);

  return (
    <div id="multi-image-intensity-comparison" className="space-y-6">
      {/* Top Banner: Comparison Header & Delta Metric */}
      <div className="bg-white rounded-2xl border border-[#EBE4D8] p-6 sm:p-7 shadow-[0_4px_25px_rgba(45,35,32,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#F4EFE6]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FF654E]/10 text-[#FF654E] text-xs font-bold uppercase tracking-wider">
              <BarChart2 className="w-3.5 h-3.5" />
              Multi-Source Satellite Comparison
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2320]">
              Cyclone Presence & Intensity Analysis
            </h3>
            <p className="text-xs sm:text-sm text-[#7D7068]">
              Comparing {comparison.totalImages} satellite sources to isolate active vortex formations and quantify intensity differences
            </p>
          </div>

          {/* Quick Metrics Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3.5 py-2 rounded-xl bg-[#FFEDE8] border border-[#FFD3C7] text-center">
              <span className="text-[10px] font-bold text-[#D94935] uppercase tracking-wider block">
                Cyclones Detected
              </span>
              <span className="text-base font-extrabold text-[#D94935]">
                {comparison.cycloneCount} of {comparison.totalImages}
              </span>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-center">
              <span className="text-[10px] font-bold text-[#065F46] uppercase tracking-wider block">
                Clear / No Cyclone
              </span>
              <span className="text-base font-extrabold text-[#065F46]">
                {comparison.nonCycloneCount} of {comparison.totalImages}
              </span>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] text-center">
              <span className="text-[10px] font-bold text-[#6C5E57] uppercase tracking-wider block">
                Intensity Difference (Δ)
              </span>
              <span className="text-base font-extrabold text-[#FF654E]">
                +{comparison.intensityDelta} <span className="text-xs text-[#8C7E76]">km/h</span>
              </span>
            </div>
          </div>
        </div>

        {/* COMPARISON CARDS (Responsive Flex Grid for each image) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
          {items.map((item, idx) => {
            const isSelected = item.imageId === selectedImageId;
            const pred = item.prediction;
            const isCyclone = pred.cycloneDetected;
            const windPct = Math.min(100, Math.round((pred.predictedWindSpeed / maxBenchmark) * 100));

            return (
              <div
                key={item.imageId}
                id={`comparison-card-image-${idx + 1}`}
                onClick={() => onSelectImage(item.imageId)}
                className={`relative rounded-xl border p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-[#FF654E] bg-[#FFF8F6] ring-2 ring-[#FF654E]/20 shadow-md'
                    : 'border-[#E8E1D5] bg-[#FAF7F2]/40 hover:border-[#FF654E]/50 hover:bg-[#FAF7F2]'
                }`}
              >
                {/* Header with status badge */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-white border border-[#E8E1D5] text-[#2D2320]">
                      Image {idx + 1}
                    </span>

                    {isCyclone ? (
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full bg-[#FFEDE8] text-[#D94935] border border-[#FFD3C7]">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Cyclone Detected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        No Cyclone
                      </span>
                    )}
                  </div>

                  {/* Thumbnail */}
                  <div className="relative rounded-lg overflow-hidden bg-[#182026] border border-[#E8E1D5] aspect-16/10 flex items-center justify-center mb-3">
                    <img
                      src={item.dataUrl}
                      alt={item.imageName}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-medium text-white truncate max-w-[90%]">
                      {item.imageName}
                    </div>
                  </div>

                  {/* Classification & Wind Speed */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-semibold text-[#7D7068]">Intensity:</span>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-xl font-extrabold ${isCyclone ? 'text-[#FF654E]' : 'text-[#10B981]'}`}>
                          {pred.predictedWindSpeed}
                        </span>
                        <span className="text-xs font-medium text-[#7D7068]">km/h</span>
                      </div>
                    </div>

                    <p className="text-xs font-bold text-[#2D2320] truncate" title={pred.classification}>
                      {pred.classification}
                    </p>

                    {/* Proportional Intensity Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="w-full bg-[#EAE2D5] rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCyclone
                              ? pred.predictedWindSpeed >= 120
                                ? 'bg-[#FF654E]'
                                : 'bg-[#F59E0B]'
                              : 'bg-[#10B981]'
                          }`}
                          style={{ width: `${Math.max(6, windPct)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#8C7E76]">
                        <span>Calm (0 km/h)</span>
                        <span>{pred.confidence}% match</span>
                      </div>
                    </div>

                    {/* Travel Direction Track */}
                    <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-white border border-[#EAE2D5] mt-2.5">
                      <span className="text-[11px] font-semibold text-[#7D7068] flex items-center gap-1.5">
                        <Navigation 
                          className="w-3 h-3 text-[#FF654E] shrink-0" 
                          style={{ transform: `rotate(${pred.movementDegree ?? 295}deg)` }} 
                        />
                        Heading Track:
                      </span>
                      <span className="text-[11px] font-bold text-[#2D2320]">
                        {isCyclone 
                          ? `${pred.movementDirection?.split('(')[1]?.replace(')', '') || pred.movementDirection || 'WNW'} • ${pred.forwardSpeed ?? 18} km/h`
                          : 'Stationary'}
                      </span>
                    </div>
                  </div>

                  {/* Brief finding */}
                  <p className="text-[11px] text-[#5C4F48] leading-relaxed line-clamp-2 bg-white/70 p-2 rounded-lg border border-[#F0EBE1] mb-3">
                    {pred.summaryExplanation}
                  </p>
                </div>

                {/* Footer Selection Button */}
                <button
                  type="button"
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#FF654E] text-white shadow-xs'
                      : 'bg-white border border-[#E0D6C7] text-[#5B4E47] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Active Dashboard Telemetry
                    </>
                  ) : (
                    <>
                      View Details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* COMPARATIVE INTENSITY SPECTRUM / BAR OVERVIEW */}
        <div className="mt-6 p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE3D6] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2D2320] uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#FF654E]" />
              Relative Intensity Difference Spectrum
            </span>
            <span className="text-xs font-semibold text-[#8C7E76]">
              Highest: {comparison.maxIntensity} km/h vs Lowest: {comparison.minIntensity} km/h
            </span>
          </div>

          <div className="space-y-2">
            {items.map((item, idx) => {
              const pred = item.prediction;
              const isCyclone = pred.cycloneDetected;
              const widthPct = Math.min(100, Math.round((pred.predictedWindSpeed / maxBenchmark) * 100));

              return (
                <div key={item.imageId} className="flex items-center gap-3 text-xs">
                  <span className="w-20 font-bold text-[#2D2320] truncate shrink-0">
                    Image {idx + 1}
                  </span>

                  <div className="flex-1 bg-white rounded-full h-3.5 border border-[#E5DDD0] overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 flex items-center justify-end pr-1 text-[9px] font-black text-white ${
                        isCyclone
                          ? pred.predictedWindSpeed >= 120
                            ? 'bg-[#FF654E]'
                            : 'bg-[#F59E0B]'
                          : 'bg-[#10B981]'
                      }`}
                      style={{ width: `${Math.max(10, widthPct)}%` }}
                    >
                      {pred.predictedWindSpeed > 30 ? `${pred.predictedWindSpeed} km/h` : ''}
                    </div>
                  </div>

                  <span className="w-24 text-right font-extrabold shrink-0">
                    {isCyclone ? (
                      <span className="text-[#FF654E]">{pred.predictedWindSpeed} km/h</span>
                    ) : (
                      <span className="text-[#10B981]">0-16 km/h</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#EAE2D5] flex items-center justify-between text-[11px] text-[#7D7068]">
            <span>
              <strong>Insight:</strong> Distinct cyclonic curvature and eye structure correlate directly with extreme intensity peaks.
            </span>
            <span className="font-bold text-[#D94935]">
              Net Gradient: Δ {comparison.intensityDelta} km/h
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
