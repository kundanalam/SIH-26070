import { 
  Globe, 
  Flame, 
  Layers, 
  Compass, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  BookOpen,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { ALL_BENCHMARK_SAMPLES, BenchmarkSample } from '../services/cyclonePrediction';

interface CycloneTaxonomyMatrixProps {
  onLoadBenchmark: (benchmark: BenchmarkSample) => void;
  activeBenchmarkId?: string;
}

export default function CycloneTaxonomyMatrix({
  onLoadBenchmark,
  activeBenchmarkId,
}: CycloneTaxonomyMatrixProps) {
  return (
    <div id="cyclone-taxonomy-matrix-section" className="space-y-8">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-[#EBE4D8] p-6 sm:p-7 shadow-[0_4px_25px_rgba(45,35,32,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#F4EFE6]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FF654E]/10 text-[#FF654E] text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              Taxonomic Verification Matrix
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#2D2320]">
              Meteorological Cyclone Archetypes & Criteria
            </h2>
            <p className="text-xs sm:text-sm text-[#7D7068]">
              Automated classification evaluates systems across 3 physical hallmarks: 
              (1) <strong>Location / Latitude</strong>, (2) <strong>Energy Source / Core Thermodynamics</strong>, and (3) <strong>Spatial Size & Structure</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF7F2] text-[#6C5E57] border border-[#E8E0D2]">
              6 Reference Benchmarks
            </span>
          </div>
        </div>

        {/* 6 Archetype Benchmark Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-6">
          {ALL_BENCHMARK_SAMPLES.map((sample) => {
            const isActive = activeBenchmarkId === sample.id;

            return (
              <div
                key={sample.id}
                id={`taxonomy-card-${sample.id}`}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 ${
                  isActive
                    ? 'border-[#FF654E] bg-[#FFF8F6] ring-2 ring-[#FF654E]/20 shadow-md'
                    : 'border-[#EBE4D8] bg-white hover:border-[#FF654E]/50 hover:shadow-sm'
                }`}
              >
                <div>
                  {/* Category Pill & Type Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${sample.badgeColor}`}>
                      {sample.cycloneType}
                    </span>

                    <span className="text-[11px] font-semibold text-[#8C7E76]">
                      {sample.parameters.windSpeed} km/h
                    </span>
                  </div>

                  {/* Thumbnail */}
                  <div className="relative rounded-xl overflow-hidden bg-[#182026] border border-[#E8E1D5] aspect-16/10 flex items-center justify-center mb-3">
                    <img
                      src={sample.dataUrl}
                      alt={sample.name}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-medium text-white truncate max-w-[90%]">
                      {sample.categoryLabel}
                    </div>
                  </div>

                  {/* Name and Description */}
                  <h3 className="text-sm font-bold text-[#2D2320] mb-1">
                    {sample.categoryLabel}
                  </h3>
                  <p className="text-xs text-[#7D7068] mb-3 leading-relaxed">
                    {sample.description}
                  </p>

                  {/* 3 Physical Hallmarks Highlights */}
                  <div className="space-y-1.5 pt-2 border-t border-[#F0EAE1] text-[11px]">
                    <div className="flex items-start gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#FF654E] shrink-0 mt-0.5" />
                      <span className="text-[#5C4F48]">
                        <strong>Latitude:</strong> {sample.parameters.latitude}°N ({sample.parameters.latitude < 30 ? 'Tropical 5°–30°' : sample.parameters.latitude < 60 ? 'Mid-Latitude 30°–60°' : 'Polar >60°'})
                      </span>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-[#FF654E] shrink-0 mt-0.5" />
                      <span className="text-[#5C4F48]">
                        <strong>Core Engine:</strong> {sample.parameters.coreType || (sample.parameters.seaSurfaceTemperature > 26 ? 'Warm-core latent heat' : 'Cold-core baroclinic')} (SST {sample.parameters.seaSurfaceTemperature}°C)
                      </span>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#FF654E] shrink-0 mt-0.5" />
                      <span className="text-[#5C4F48]">
                        <strong>Structure:</strong> {sample.parameters.systemStructure || 'Symmetric spiral vortex'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Test & Load Button */}
                <div className="pt-4 mt-3 border-t border-[#F0EAE1]">
                  <button
                    type="button"
                    onClick={() => onLoadBenchmark(sample)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-[#FF654E] text-white shadow-xs'
                        : 'bg-[#FAF7F2] hover:bg-[#FFEDE8] text-[#2D2320] hover:text-[#D94935] border border-[#E8E0D2] hover:border-[#FFD3C7]'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    {isActive ? 'Active in Simulator' : 'Load Benchmark & Verify'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparative Specification Reference Table */}
      <div className="bg-white rounded-2xl border border-[#EBE4D8] p-6 sm:p-7 shadow-[0_4px_25px_rgba(45,35,32,0.04)]">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-[#2D2320]">
            Classification Taxonomy Reference Matrix
          </h3>
          <p className="text-xs sm:text-sm text-[#7D7068]">
            Meteorological criteria differentiating cyclonic categories according to international atmospheric science standards
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#EAE2D5] bg-[#FAF7F2] text-[#5C4F48]">
                <th className="py-3 px-3 font-bold rounded-l-lg">Cyclone Category</th>
                <th className="py-3 px-3 font-bold">Location & Latitude</th>
                <th className="py-3 px-3 font-bold">Energy Source & Core</th>
                <th className="py-3 px-3 font-bold">Spatial Size & Structure</th>
                <th className="py-3 px-3 font-bold rounded-r-lg">Distinctive Visual Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE1]">
              <tr className="hover:bg-[#FFF8F6] transition-colors">
                <td className="py-3 px-3 font-bold text-[#FF654E]">
                  🌀 Tropical Cyclone
                </td>
                <td className="py-3 px-3 text-[#5C4F48]">
                  Warm oceans, 5°–30° N/S
                </td>
                <td className="py-3 px-3 text-[#5C4F48]">
                  <strong>Warm-core</strong>; latent heat from condensing water vapor (SST ≥ 26.5°C)
                </td>
                <td className="py-3 px-3 text-[#5C4F48]">
                  200–1000 km diameter; symmetric spiral rainbands, central calm eye, eyewall
                </td>
                <td className="py-3 px-3 text-[#7D7068]">
                  Tight circular eyewall ring, radial outflow cirrus shield
                </td>
              </tr>

              <tr className="hover:bg-[#FFF8F6] transition-colors">
                <td className="py-3 px-3 font-bold text-[#2563EB]">
                  🌊 Extratropical Cyclone
                </td>
                <td className="py-3 px-3 text-[#5C4F48]">
                  Mid-latitude, 30°–60° N/S
                </td>
                <td className="py-3 px-3 text-[#5C4F48]">
                  <strong>Cold-core</strong>; baroclinic horizontal temperature gradients (fronts)
                </td>
                <td className="py-3 px-3 text-[#5C4F48]">
                  1000–2500 km diameter; asymmetric comma-cloud head, cold & warm frontal bands
                </td>
                <td className="py-3 px-3 text-[#7D7068]">
                  Sweeping comma cloud tail extending thousands of kilometers
                </td>
              </tr>

              <tr className="hover:bg-[#FFF8F6] transition-colors">
                <td className="py-3 px-3 font-bold text-[#059669]">
                  ❄️ Polar Cyclone
                </td>
                <td className="py-3 px-3 text-[#5C4F48]">
                  Sub-polar / Arctic, &gt;55°–60° N/S
                </td>
                <td className="py-3 px-3 text-[#5C4F48]">
                  <strong>Cold-core aloft</strong>; extreme thermal air-sea contrast over frigid water
                </td>
                <td className="py-3 px-3 text-[#5C4F48]">
                  200–600 km diameter; compact mesoscale spiral snow bands, rapid spin-up
                </td>
                <td className="py-3 px-3 text-[#7D7068]">
                  Compact miniature spiral vortex adjacent to sea-ice boundaries
                </td>
              </tr>

              <tr className="hover:bg-[#FFF8F6] transition-colors">
                <td className="py-3 px-3 font-bold text-[#9333EA]">
                  🌪️ Mesocyclone
                </td>
                <td className="py-3 px-3 text-[#5C4F48]">
                  Inland continental plains
                </td>
                <td className="py-3 px-3 text-[#5C4F48]">
                  <strong>Buoyant updraft</strong>; intense CAPE & vertical directional wind shear
                </td>
                <td className="py-3 px-3 text-[#5C4F48]">
                  2–10 km diameter; rotating core inside parent supercell thunderstorm
                </td>
                <td className="py-3 px-3 text-[#7D7068]">
                  Doppler radar classic hook echo with bounded weak echo region (BWER)
                </td>
              </tr>

              <tr className="hover:bg-[#FFF8F6] transition-colors">
                <td className="py-3 px-3 font-bold text-[#4B5563]">
                  ☀️ None (Non-Cyclonic)
                </td>
                <td className="py-3 px-3 text-[#5C4F48]">
                  Any latitude (open calm seas)
                </td>
                <td className="py-3 px-3 text-[#5C4F48]">
                  Stable ambient boundary layer without cyclogenesis forcing
                </td>
                <td className="py-3 px-3 text-[#5C4F48]">
                  Dispersed non-convective clouds or clear skies; no rotational vorticity
                </td>
                <td className="py-3 px-3 text-[#7D7068]">
                  Flat ocean surface with scattered fair-weather cumulus
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
