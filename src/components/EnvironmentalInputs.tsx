import { ChangeEvent } from 'react';
import { Sliders, RotateCcw } from 'lucide-react';
import { EnvironmentalParameters } from '../types';

interface EnvironmentalInputsProps {
  parameters: EnvironmentalParameters;
  onChange: (key: keyof EnvironmentalParameters, value: number) => void;
  onLoadSampleData: () => void;
}

export default function EnvironmentalInputs({
  parameters,
  onChange,
  onLoadSampleData,
}: EnvironmentalInputsProps) {
  const handleInputChange = (key: keyof EnvironmentalParameters) => (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const val = parseFloat(e.target.value);
    onChange(key, isNaN(val) ? 0 : val);
  };

  const fields: Array<{
    key: keyof EnvironmentalParameters;
    label: string;
    unit: string;
    step?: string;
    min?: number;
    max?: number;
    description: string;
  }> = [
    {
      key: 'windSpeed',
      label: 'Wind Speed',
      unit: 'km/h',
      step: '1',
      min: 0,
      max: 350,
      description: 'Maximum sustained surface wind',
    },
    {
      key: 'seaSurfaceTemperature',
      label: 'Sea Surface Temperature',
      unit: '°C',
      step: '0.1',
      min: 15,
      max: 38,
      description: 'Thermal energy potential',
    },
    {
      key: 'atmosphericPressure',
      label: 'Atmospheric Pressure',
      unit: 'hPa',
      step: '1',
      min: 870,
      max: 1040,
      description: 'Central minimum pressure',
    },
    {
      key: 'windDirection',
      label: 'Wind Direction',
      unit: 'degrees',
      step: '1',
      min: 0,
      max: 360,
      description: 'Azimuthal bearing (0°-360°)',
    },
    {
      key: 'latitude',
      label: 'Latitude',
      unit: 'degrees',
      step: '0.1',
      min: -90,
      max: 90,
      description: 'Coordinates (°N)',
    },
    {
      key: 'longitude',
      label: 'Longitude',
      unit: 'degrees',
      step: '0.1',
      min: -180,
      max: 180,
      description: 'Coordinates (°E)',
    },
    {
      key: 'rainfall',
      label: 'Rainfall',
      unit: 'mm',
      step: '1',
      min: 0,
      max: 800,
      description: '24-hour precipitation rate',
    },
  ];

  return (
    <div
      id="environmental-parameters-section"
      className="bg-white rounded-2xl border border-[#EBE4D8] shadow-[0_4px_25px_rgba(45,35,32,0.04)] p-6 sm:p-7"
    >
      {/* Header with Title and Load Sample Data */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#F4EFE6]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FF654E]/10 flex items-center justify-center text-[#FF654E]">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#2D2320]">
              Environmental Parameters
            </h3>
            <p className="text-xs text-[#7D7068]">
              Multi-source meteorological readings to supplement satellite imagery
            </p>
          </div>
        </div>

        <button
          id="load-sample-data-btn"
          type="button"
          onClick={onLoadSampleData}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#E6DDCE] hover:border-[#FF654E]/50 bg-[#FAF7F2] hover:bg-[#FFF5F2] text-[#2D2320] hover:text-[#FF654E] text-xs font-semibold transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#FF654E]" />
          Load Sample Data
        </button>
      </div>

      {/* 7 Compact Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {fields.map((field) => (
          <div
            key={field.key}
            className="p-3 rounded-xl bg-[#FAF7F2]/75 border border-[#EAE2D5] focus-within:border-[#FF654E] focus-within:bg-white transition-all"
          >
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <label
                htmlFor={`param-${field.key}`}
                className="text-xs font-bold text-[#3B302B] truncate"
              >
                {field.label}
              </label>
              <span className="text-[11px] font-semibold text-[#8C7E76] px-1.5 py-0.5 rounded bg-white/80 border border-[#E8E1D5] shrink-0">
                {field.unit}
              </span>
            </div>

            <div className="relative">
              <input
                id={`param-${field.key}`}
                type="number"
                step={field.step || 'any'}
                min={field.min}
                max={field.max}
                value={parameters[field.key]}
                onChange={handleInputChange(field.key)}
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-[#DDD5C7] text-sm font-semibold text-[#2D2320] focus:outline-none focus:ring-1 focus:ring-[#FF654E] focus:border-[#FF654E] transition-all"
              />
            </div>
            <p className="text-[10px] text-[#91857E] mt-1 truncate">
              {field.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
