import { useState } from 'react';
import { IntensityDataPoint } from '../types';

interface IntensityLineChartProps {
  data: IntensityDataPoint[];
  developmentStage: string;
}

export default function IntensityLineChart({
  data,
  developmentStage,
}: IntensityLineChartProps) {
  const [activePoint, setActivePoint] = useState<IntensityDataPoint | null>(null);

  if (!data || data.length === 0) {
    return null;
  }

  // Chart dimensions
  const width = 640;
  const height = 220;
  const padding = { top: 25, right: 30, bottom: 35, left: 55 };

  const calculatedMin = Math.floor(Math.min(...data.map((d) => d.windSpeed)) * 0.8 / 10) * 10;
  const calculatedMax = Math.ceil(Math.max(...data.map((d) => d.windSpeed)) * 1.15 / 10) * 10;
  const minSpeed = Math.max(0, calculatedMin);
  const maxSpeed = Math.max(minSpeed + 20, calculatedMax);
  const speedRange = maxSpeed - minSpeed;

  const getX = (index: number) => {
    return (
      padding.left +
      (index / (data.length - 1)) * (width - padding.left - padding.right)
    );
  };

  const getY = (speed: number) => {
    const ratio = (speed - minSpeed) / speedRange;
    return height - padding.bottom - ratio * (height - padding.top - padding.bottom);
  };

  // Generate path string
  const points = data.map((d, i) => `${getX(i)},${getY(d.windSpeed)}`);
  const linePath = `M ${points.join(' L ')}`;

  // Area under line
  const areaPath = `${linePath} L ${getX(data.length - 1)},${height - padding.bottom} L ${getX(0)},${height - padding.bottom} Z`;

  // Grid tick marks
  const yTicks = [
    minSpeed,
    Math.round(minSpeed + speedRange * 0.33),
    Math.round(minSpeed + speedRange * 0.66),
    maxSpeed,
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold text-[#7D7068]">
          Wind Speed Trend ({developmentStage})
        </span>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-[#5A4D46]">
            <span className="w-3 h-0.5 bg-[#FF654E]"></span>
            <span>Recorded</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#5A4D46]">
            <span className="w-3 h-0.5 border-t border-dashed border-[#FF654E]"></span>
            <span>AI Projection</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[260px] overflow-visible select-none"
        >
          <defs>
            {/* Coral Gradient Fill */}
            <linearGradient id="coralAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF654E" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#FF654E" stopOpacity={0.01} />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {yTicks.map((tickVal, tickIdx) => {
            const y = getY(tickVal);
            return (
              <g key={`ytick-${tickIdx}-${tickVal}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#EAE2D5"
                  strokeDasharray="3,3"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#8C7E76"
                  fontSize="11"
                  fontFamily="sans-serif"
                >
                  {tickVal}
                </text>
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={padding.left - 10}
            y={padding.top - 10}
            textAnchor="end"
            fill="#7D7068"
            fontSize="10"
            fontWeight="bold"
          >
            km/h
          </text>

          {/* Area fill */}
          <path d={areaPath} fill="url(#coralAreaGrad)" />

          {/* Main Trend Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#FF654E"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {data.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.windSpeed);
            const isHovered = activePoint?.time === d.time;
            const isPresent = d.time === 'Present';

            return (
              <g
                key={d.time}
                className="cursor-pointer"
                onMouseEnter={() => setActivePoint(d)}
                onMouseLeave={() => setActivePoint(null)}
              >
                {/* X-axis tick label */}
                <text
                  x={cx}
                  y={height - 12}
                  textAnchor="middle"
                  fill={isPresent ? '#FF654E' : '#7D7068'}
                  fontSize="11"
                  fontWeight={isPresent ? 'bold' : 'normal'}
                >
                  {d.time}
                </text>

                {/* Vertical helper line on hover or present */}
                {(isHovered || isPresent) && (
                  <line
                    x1={cx}
                    y1={padding.top}
                    x2={cx}
                    y2={height - padding.bottom}
                    stroke="#FF654E"
                    strokeWidth={isPresent && !isHovered ? 1 : 1.5}
                    strokeDasharray={isPresent && !isHovered ? '2,2' : 'none'}
                    opacity={isHovered ? 0.8 : 0.35}
                  />
                )}

                {/* Point circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isPresent ? 6 : isHovered ? 6 : 4}
                  fill={isPresent ? '#FF654E' : '#FFFFFF'}
                  stroke="#FF654E"
                  strokeWidth={isPresent ? 3 : 2}
                  className="transition-all duration-150"
                />

                {/* Speed label directly above present or hovered point */}
                {(isHovered || isPresent) && (
                  <g>
                    <rect
                      x={cx - 26}
                      y={cy - 28}
                      width={52}
                      height={20}
                      rx={4}
                      fill="#2D2320"
                      className="shadow-sm"
                    />
                    <text
                      x={cx}
                      y={cy - 14}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {d.windSpeed} km/h
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
