import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

interface DataPoint {
  date: string;
  value: number; // 0 - 100
  label: string;
}

export const ProductivityAnalyticsCard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  const monthData: DataPoint[] = [
    { date: 'Aug 1', value: 42, label: 'Aug 1, 2026' },
    { date: 'Aug 6', value: 48, label: 'Aug 6, 2026' },
    { date: 'Aug 11', value: 65, label: 'Aug 11, 2026' },
    { date: 'Aug 16', value: 85, label: 'Aug 16, 2026' },
    { date: 'Aug 21', value: 72, label: 'Aug 21, 2026' },
    { date: 'Aug 26', value: 92, label: 'Aug 26, 2026' },
    { date: 'Aug 31', value: 88, label: 'Aug 31, 2026' },
  ];

  const weekData: DataPoint[] = [
    { date: 'Mon', value: 60, label: 'Monday' },
    { date: 'Tue', value: 75, label: 'Tuesday' },
    { date: 'Wed', value: 68, label: 'Wednesday' },
    { date: 'Thu', value: 84, label: 'Thursday' },
    { date: 'Fri', value: 95, label: 'Friday' },
    { date: 'Sat', value: 70, label: 'Saturday' },
    { date: 'Sun', value: 80, label: 'Sunday' },
  ];

  const quarterData: DataPoint[] = [
    { date: 'Jun', value: 55, label: 'June' },
    { date: 'Jul', value: 70, label: 'July' },
    { date: 'Aug', value: 88, label: 'August' },
    { date: 'Sep', value: 94, label: 'September' },
  ];

  const currentData =
    timeRange === 'week' ? weekData : timeRange === 'quarter' ? quarterData : monthData;

  // Chart coordinates
  const width = 480;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;

  const points = currentData.map((d, index) => {
    const x =
      paddingX + (index / (currentData.length - 1)) * (width - paddingX * 2);
    const y =
      height - paddingY - (d.value / 100) * (height - paddingY * 2);
    return { x, y, ...d };
  });

  // Generate SVG cubic Bezier curve path
  const generateSmoothPath = (pts: typeof points) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[0];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i != pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const linePath = generateSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative">
      <div>
        {/* Header with Title & Filter Buttons */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Productivity Analytics</h3>
            <p className="text-[11px] text-slate-400">Team efficiency & output curve</p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-xs">
            {(['week', 'month', 'quarter'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-medium capitalize transition-all ${
                  timeRange === r
                    ? 'bg-white text-blue-600 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Hover Tooltip display */}
        <div className="h-4 flex items-center justify-between text-[11px] mb-1">
          {hoveredPoint ? (
            <span className="text-blue-600 font-semibold">
              {hoveredPoint.label}: {hoveredPoint.value}% efficiency
            </span>
          ) : (
            <span className="text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              Peak efficiency +14% compared to target
            </span>
          )}
        </div>

        {/* SVG Curve Chart */}
        <div className="w-full relative overflow-visible">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto overflow-visible select-none"
          >
            <defs>
              <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines & Y-Axis Labels */}
            {[0, 25, 50, 75, 100].map((val) => {
              const y = height - paddingY - (val / 100) * (height - paddingY * 2);
              return (
                <g key={val}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={width - paddingX}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                    strokeDasharray={val === 0 || val === 100 ? '0' : '3 3'}
                  />
                  <text
                    x={paddingX - 10}
                    y={y + 3}
                    textAnchor="end"
                    fontSize="9"
                    fill="#94a3b8"
                    className="font-medium"
                  >
                    {val}%
                  </text>
                </g>
              );
            })}

            {/* Area fill */}
            <path d={areaPath} fill="url(#analyticsGradient)" />

            {/* Main smooth curve line */}
            <path
              d={linePath}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Data points & X-Axis Labels */}
            {points.map((pt, i) => (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredPoint?.date === pt.date ? '5' : '3.5'}
                  fill="#ffffff"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                <text
                  x={pt.x}
                  y={height - 5}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#94a3b8"
                  className="font-medium"
                >
                  {pt.date}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};
