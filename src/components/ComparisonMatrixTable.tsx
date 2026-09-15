import { 
  ShieldAlert, 
  ShieldCheck, 
  Wind, 
  Gauge, 
  Thermometer, 
  Navigation, 
  Compass,
  ArrowRight,
  Check
} from 'lucide-react';
import { MultiPredictionResult } from '../types';

interface ComparisonMatrixTableProps {
  multiPrediction: MultiPredictionResult;
  selectedImageId: string;
  onSelectImage: (id: string) => void;
}

export default function ComparisonMatrixTable({
  multiPrediction,
  selectedImageId,
  onSelectImage,
}: ComparisonMatrixTableProps) {
  const { items } = multiPrediction;

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div id="comparison-matrix-table-card" className="bg-white rounded-2xl border border-[#EBE4D8] p-6 sm:p-7 shadow-[0_4px_25px_rgba(45,35,32,0.04)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-[#F4EFE6]">
        <div>
          <h3 className="text-lg font-bold text-[#2D2320]">
            Multi-Source Meteorological Parameter Matrix
          </h3>
          <p className="text-xs text-[#7D7068]">
            Side-by-side verification of satellite imagery features, intensity metrics, and taxonomic predictions
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FAF7F2] text-[#6C5E57] border border-[#E8E0D2] w-fit">
          {items.length} Systems Compared
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#EAE2D5] bg-[#FAF7F2] text-[#5C4F48]">
              <th className="py-3 px-3 font-bold rounded-l-lg">Source Image</th>
              <th className="py-3 px-3 font-bold">Status</th>
              <th className="py-3 px-3 font-bold">Classification</th>
              <th className="py-3 px-3 font-bold">Cyclone Type</th>
              <th className="py-3 px-3 font-bold">Wind Speed</th>
              <th className="py-3 px-3 font-bold">Pressure</th>
              <th className="py-3 px-3 font-bold">SST</th>
              <th className="py-3 px-3 font-bold">Location</th>
              <th className="py-3 px-3 font-bold">Trajectory</th>
              <th className="py-3 px-3 font-bold rounded-r-lg text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EAE1]">
            {items.map((item, idx) => {
              const isSelected = item.imageId === selectedImageId;
              const pred = item.prediction;
              const isCyclone = pred.cycloneDetected;
              const params = item.parameters || pred.parameters;

              return (
                <tr
                  key={item.imageId}
                  onClick={() => onSelectImage(item.imageId)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#FFF8F6]' : 'hover:bg-[#FAF7F2]/60'
                  }`}
                >
                  {/* Thumbnail & Title */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-8 rounded-md overflow-hidden bg-[#182026] border border-[#E8E1D5] shrink-0">
                        <img
                          src={item.dataUrl}
                          alt={item.imageName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="max-w-[140px]">
                        <span className="font-bold text-[#2D2320] block truncate" title={item.imageName}>
                          Image {idx + 1}
                        </span>
                        <span className="text-[10px] text-[#8C7E76] block truncate">
                          {item.imageName}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    {isCyclone ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FFEDE8] text-[#D94935] border border-[#FFD3C7]">
                        <ShieldAlert className="w-3 h-3" />
                        Cyclone
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                        <ShieldCheck className="w-3 h-3" />
                        Calm
                      </span>
                    )}
                  </td>

                  {/* Classification */}
                  <td className="py-3 px-3 font-semibold text-[#2D2320]">
                    {pred.classification}
                  </td>

                  {/* Cyclone Type */}
                  <td className="py-3 px-3">
                    <span className="font-bold text-[#FF654E]">
                      {pred.cycloneTypeAnalysis?.cycloneType || (isCyclone ? 'Tropical Cyclone' : 'None (Non-Cyclonic)')}
                    </span>
                  </td>

                  {/* Wind Speed */}
                  <td className="py-3 px-3">
                    <span className={`font-extrabold ${isCyclone ? 'text-[#FF654E]' : 'text-[#10B981]'}`}>
                      {pred.predictedWindSpeed} km/h
                    </span>
                  </td>

                  {/* Pressure */}
                  <td className="py-3 px-3 font-medium text-[#5C4F48]">
                    {params?.atmosphericPressure ?? '—'} hPa
                  </td>

                  {/* SST */}
                  <td className="py-3 px-3 font-medium text-[#5C4F48]">
                    {params?.seaSurfaceTemperature ?? '—'} °C
                  </td>

                  {/* Coordinates */}
                  <td className="py-3 px-3 font-mono text-[11px] text-[#6C5E57]">
                    {params?.latitude?.toFixed(1) ?? '15.2'}°N, {params?.longitude?.toFixed(1) ?? '82.4'}°E
                  </td>

                  {/* Trajectory */}
                  <td className="py-3 px-3 text-[11px] text-[#5C4F48]">
                    {isCyclone ? `${pred.movementDegree ?? 295}° (${pred.forwardSpeed ?? 18} km/h)` : 'Stationary'}
                  </td>

                  {/* Select button */}
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectImage(item.imageId);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FF654E] text-white shadow-xs'
                          : 'bg-[#FAF7F2] hover:bg-[#FFEDE8] text-[#5C4F48] hover:text-[#D94935] border border-[#E8E0D2]'
                      }`}
                    >
                      {isSelected ? 'Viewing' : 'Select'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
