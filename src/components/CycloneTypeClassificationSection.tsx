import { 
  Globe, 
  Flame, 
  Layers, 
  ShieldAlert, 
  Compass,
  CheckCircle2,
  Scan,
  Cpu
} from 'lucide-react';
import { CycloneTypeAnalysis, CycloneTypeCategory, EnvironmentalParameters } from '../types';
import { evaluateCycloneType } from '../services/cyclonePrediction';

interface CycloneTypeClassificationSectionProps {
  analysis?: CycloneTypeAnalysis;
  currentParameters?: EnvironmentalParameters;
  activeImageName?: string;
  isCycloneDetected?: boolean;
}

interface CategoryDisplayConfig {
  category: CycloneTypeCategory;
  label: string;
  icon: string;
  tagline: string;
  badgeColor: string;
}

const CYCLONE_CATEGORIES: CategoryDisplayConfig[] = [
  {
    category: 'Tropical Cyclone',
    label: 'Tropical Cyclone',
    icon: '🌀',
    tagline: 'Warm-core ocean vortex (5°–30° Lat)',
    badgeColor: 'bg-[#FFF0EC] text-[#FF654E] border-[#FFD9CF]',
  },
  {
    category: 'Extratropical (Mid-Latitude) Cyclone',
    label: 'Extratropical Cyclone',
    icon: '🌊',
    tagline: 'Cold-core frontal comma system (30°–60° Lat)',
    badgeColor: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
  },
  {
    category: 'Polar Cyclone',
    label: 'Polar Cyclone',
    icon: '❄️',
    tagline: 'Compact arctic low (>60° Lat)',
    badgeColor: 'bg-[#F0FDF4] text-[#059669] border-[#BBF7D0]',
  },
  {
    category: 'Mesocyclone',
    label: 'Mesocyclone',
    icon: '🌪️',
    tagline: 'Local thunderstorm supercell (2–10 km)',
    badgeColor: 'bg-[#FAF5FF] text-[#9333EA] border-[#E9D5FF]',
  },
  {
    category: 'None (Non-Cyclonic)',
    label: 'Non-Cyclonic (Calm)',
    icon: '☀️',
    tagline: 'Stable ambient conditions / no organized vortex',
    badgeColor: 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]',
  },
];

export default function CycloneTypeClassificationSection({
  analysis,
  currentParameters,
  activeImageName,
  isCycloneDetected = true,
}: CycloneTypeClassificationSectionProps) {
  // Directly use the AI vision / image analysis result without user selection override
  const displayAnalysis: CycloneTypeAnalysis = analysis ||
    evaluateCycloneType(
      {
        latitude: currentParameters?.latitude ?? 15.2,
        seaSurfaceTemperature: currentParameters?.seaSurfaceTemperature ?? 28.5,
        windSpeed: currentParameters?.windSpeed ?? (isCycloneDetected ? 145 : 16),
        atmosphericPressure: currentParameters?.atmosphericPressure ?? (isCycloneDetected ? 950 : 1012),
        coreType: currentParameters?.coreType,
        systemStructure: currentParameters?.systemStructure,
      },
      isCycloneDetected ? 'Cyclonic Storm' : 'No Cyclone / Calm Ocean',
      isCycloneDetected,
      activeImageName ?? (isCycloneDetected ? 'Active Satellite Image' : 'Calm Ocean / Clear Waters')
    );

  const detectedCategory = displayAnalysis.cycloneType;

  return (
    <div
      id="cyclone-type-classification-section"
      className="bg-white rounded-2xl border border-[#EBE4D8] shadow-[0_6px_30px_rgba(45,35,32,0.06)] overflow-hidden transition-all"
    >
      {/* Header Banner */}
      <div className="bg-[#FAF7F2] px-6 py-4 border-b border-[#EAE2D5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFF0EC] border border-[#FFD9CF] flex items-center justify-center text-[#FF654E] shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#2D2320] flex items-center gap-2">
              <span>Cyclone Type Classification</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#FFF0EC] text-[#FF654E] border border-[#FFD9CF] flex items-center gap-1">
                <Scan className="w-3 h-3 animate-pulse" />
                Detected from Image Analysis
              </span>
            </h3>
            <p className="text-xs text-[#7D7068]">
              Automated multi-factor taxonomic evaluation based on formation latitude, thermodynamic core, and vortex scale extracted from satellite imagery
            </p>
          </div>
        </div>

        {/* Active Image Analyzed Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#EAE2D5] text-xs text-[#4A3E38] shrink-0">
          <Cpu className="w-3.5 h-3.5 text-[#FF654E]" />
          <span className="text-[#7D7068]">Analyzed Image:</span>
          <span className="font-semibold text-[#2D2320] truncate max-w-[180px]">
            {activeImageName || 'Current Satellite Feed'}
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Automated Detection Status Row across all categories */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7D7068] flex items-center gap-1.5">
              <Scan className="w-3.5 h-3.5 text-[#FF654E]" />
              Taxonomic Category Verification (Automated Scan)
            </span>
            <span className="text-xs font-medium text-[#059669] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Identified via Satellite Pattern Recognition
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5">
            {CYCLONE_CATEGORIES.map((categoryConfig) => {
              const isDetected = detectedCategory === categoryConfig.category;
              return (
                <div
                  key={categoryConfig.category}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    isDetected
                      ? 'bg-[#FFF9F7] border-[#FF654E] shadow-[0_2px_14px_rgba(255,101,78,0.14)] ring-1 ring-[#FF654E]/30'
                      : 'bg-[#FAF7F2]/40 border-[#EAE2D5] opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">{categoryConfig.icon}</span>
                      <span className="text-xs font-bold text-[#2D2320] truncate">
                        {categoryConfig.label}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#7D7068] leading-tight">
                    {categoryConfig.tagline}
                  </p>
                  {isDetected && (
                    <div className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-[#FF654E] uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF654E] animate-ping" />
                      Detected from Image
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3 Key Feature Evaluation Cards */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#7D7068] mb-3">
            Evaluation of the 3 Key Features (Derived from Satellite Imagery)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* 1. Location / Latitude */}
            <div className="p-4 rounded-xl bg-[#FAF7F2]/80 border border-[#EAE3D6] space-y-2">
              <div className="flex items-center gap-2 text-[#2D2320]">
                <Globe className="w-4 h-4 text-[#FF654E] shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#7D7068]">
                  1. Location / Latitude
                </span>
              </div>
              <h5 className="text-xs font-bold text-[#2D2320]">
                Where It Formed
              </h5>
              <p className="text-xs text-[#4A3E38] leading-relaxed">
                {displayAnalysis.locationLatitude}
              </p>
            </div>

            {/* 2. Energy Source / Core Temperature */}
            <div className="p-4 rounded-xl bg-[#FAF7F2]/80 border border-[#EAE3D6] space-y-2">
              <div className="flex items-center gap-2 text-[#2D2320]">
                <Flame className="w-4 h-4 text-[#FF654E] shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#7D7068]">
                  2. Energy Source / Core Temp
                </span>
              </div>
              <h5 className="text-xs font-bold text-[#2D2320]">
                Warm-Core vs. Cold-Core
              </h5>
              <p className="text-xs text-[#4A3E38] leading-relaxed">
                {displayAnalysis.energySource}
              </p>
            </div>

            {/* 3. Size and Structure */}
            <div className="p-4 rounded-xl bg-[#FAF7F2]/80 border border-[#EAE3D6] space-y-2">
              <div className="flex items-center gap-2 text-[#2D2320]">
                <Layers className="w-4 h-4 text-[#FF654E] shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#7D7068]">
                  3. Size and Structure
                </span>
              </div>
              <h5 className="text-xs font-bold text-[#2D2320]">
                Vortex & Boundary Scale
              </h5>
              <p className="text-xs text-[#4A3E38] leading-relaxed">
                {displayAnalysis.sizeAndStructure}
              </p>
            </div>
          </div>
        </div>

        {/* REQUIRED OUTPUT FORMAT CARD */}
        <div className="p-5 sm:p-6 rounded-xl bg-[#FAF7F2] border border-[#EAE2D5] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE2D5] pb-3.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7D7068]">
                Cyclone Type:
              </span>
              <span className="text-base sm:text-lg font-extrabold text-[#FF654E] px-3 py-0.5 rounded-lg bg-[#FFF0EC] border border-[#FFD9CF]">
                {displayAnalysis.cycloneType}
              </span>
            </div>
            <span className="text-xs text-[#7D7068]">
              Automated Taxonomic Conclusion from Image
            </span>
          </div>

          {/* Reasoning Breakdown */}
          <div className="space-y-2">
            <strong className="text-xs font-bold uppercase tracking-wider text-[#2D2320] block">
              Reasoning:
            </strong>
            <ul className="space-y-2 text-xs sm:text-sm text-[#4A3E38]">
              {displayAnalysis.reasoning.map((point, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF654E] shrink-0 mt-2" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Safety / Info Note */}
          <div className="p-3.5 rounded-xl bg-[#FFF9F7] border border-[#FFD9CF] flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#FF654E] shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-[#4A3E38]">
              <strong className="font-bold text-[#FF654E] mr-1">
                Safety/Info Note:
              </strong>
              <span>{displayAnalysis.safetyInfoNote}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
