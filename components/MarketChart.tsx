import React, { useMemo } from 'react';
import { MarketParams, MarketData } from '../types';

interface MarketChartProps {
  params: MarketParams;
  marketData: MarketData;
}

const MarketChart: React.FC<MarketChartProps> = ({ params, marketData }) => {
  const { eqQuantity, eqPrice } = marketData;
  const { demandIntercept, demandSlope, supplyIntercept, supplySlope } = params;

  // Chart Dimensions
  // Using a fixed viewBox aspect ratio (3:2)
  const width = 600;
  const height = 400;
  const padding = 40;
  
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  // Calculate Chart Domains (Scales)
  // Max Quantity: slightly more than equilibrium to show context
  const maxQ = Math.max(eqQuantity * 1.5, 20); 
  // Max Price: usually the demand intercept (highest willingness to pay)
  const maxP = Math.max(demandIntercept, supplyIntercept + supplySlope * maxQ) * 1.1;

  // Helper functions to map data values to SVG coordinates
  const toX = (q: number) => padding + (q / maxQ) * graphWidth;
  const toY = (p: number) => height - padding - (p / maxP) * graphHeight;

  // Generate Points for Lines
  const demandStart = { x: toX(0), y: toY(demandIntercept) };
  // Demand hits P=0 at Q = intercept/slope
  const qZeroDemand = demandIntercept / demandSlope;
  const demandEndQ = Math.min(maxQ, qZeroDemand);
  const demandEnd = { x: toX(demandEndQ), y: toY(demandIntercept - demandSlope * demandEndQ) };

  const supplyStart = { x: toX(0), y: toY(supplyIntercept) };
  const supplyEnd = { x: toX(maxQ), y: toY(supplyIntercept + supplySlope * maxQ) };

  const eqPoint = { x: toX(eqQuantity), y: toY(eqPrice) };

  // Generate Area Paths
  // Consumer Surplus: Triangle formed by (0, DemandIntercept), (EqQ, EqP), (0, EqP)
  const csPath = `M ${toX(0)},${toY(demandIntercept)} L ${eqPoint.x},${eqPoint.y} L ${toX(0)},${eqPoint.y} Z`;

  // Producer Surplus: Triangle formed by (0, SupplyIntercept), (EqQ, EqP), (0, EqP)
  const psPath = `M ${toX(0)},${toY(supplyIntercept)} L ${eqPoint.x},${eqPoint.y} L ${toX(0)},${eqPoint.y} Z`;

  // Grid lines
  const gridLines = useMemo(() => {
    const lines = [];
    const xSteps = 5;
    const ySteps = 5;

    for (let i = 0; i <= xSteps; i++) {
      const qVal = (maxQ / xSteps) * i;
      const x = toX(qVal);
      lines.push(
        <React.Fragment key={`x-${i}`}>
          <line x1={x} y1={padding} x2={x} y2={height - padding} stroke="#e2e8f0" strokeDasharray="4 4" />
          <text x={x} y={height - padding + 20} textAnchor="middle" fontSize="11" fill="#64748b">
            {qVal.toFixed(0)}
          </text>
        </React.Fragment>
      );
    }

    for (let i = 0; i <= ySteps; i++) {
      const pVal = (maxP / ySteps) * i;
      const y = toY(pVal);
      lines.push(
        <React.Fragment key={`y-${i}`}>
          <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e2e8f0" strokeDasharray="4 4" />
          <text x={padding - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#64748b">
            ${pVal.toFixed(0)}
          </text>
        </React.Fragment>
      );
    }
    return lines;
  }, [maxQ, maxP]);

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      {/* 
        Container ensures the SVG maintains aspect ratio and doesn't explode. 
        'max-w-full' ensures it fits in the grid.
        'h-auto' allows height to adjust based on width.
      */}
      <div className="relative w-full" style={{ paddingBottom: '66.66%' /* 3:2 Aspect Ratio */ }}>
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="absolute top-0 left-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Axis Labels */}
          <text x={width / 2} y={height - 5} textAnchor="middle" fill="#475569" fontSize="12" fontWeight="bold">
            数量 (Quantity)
          </text>
          <text x={12} y={height / 2} textAnchor="middle" fill="#475569" fontSize="12" fontWeight="bold" transform={`rotate(-90, 12, ${height / 2})`}>
            价格 (Price)
          </text>

          {/* Grid */}
          {gridLines}

          {/* Consumer Surplus Area */}
          <path d={csPath} fill="#3b82f6" fillOpacity="0.2" stroke="none" />
          
          {/* Producer Surplus Area */}
          <path d={psPath} fill="#a855f7" fillOpacity="0.2" stroke="none" />

          {/* Axes Lines */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#64748b" strokeWidth="2" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#64748b" strokeWidth="2" />

          {/* Demand Line */}
          <line 
            x1={demandStart.x} y1={demandStart.y} 
            x2={demandEnd.x} y2={demandEnd.y} 
            stroke="#2563eb" strokeWidth="3" 
            strokeLinecap="round"
          />

          {/* Supply Line */}
          <line 
            x1={supplyStart.x} y1={supplyStart.y} 
            x2={supplyEnd.x} y2={supplyEnd.y} 
            stroke="#ef4444" strokeWidth="3" 
            strokeLinecap="round"
          />

          {/* Equilibrium Lines */}
          <line 
            x1={eqPoint.x} y1={eqPoint.y} 
            x2={eqPoint.x} y2={height - padding} 
            stroke="#64748b" strokeWidth="2" strokeDasharray="5 5" 
          />
          <line 
            x1={padding} y1={eqPoint.y} 
            x2={eqPoint.x} y2={eqPoint.y} 
            stroke="#64748b" strokeWidth="2" strokeDasharray="5 5" 
          />

          {/* Equilibrium Dot */}
          <circle cx={eqPoint.x} cy={eqPoint.y} r="5" fill="#0f172a" stroke="#fff" strokeWidth="2" />

          {/* Labels for Lines */}
          <text x={demandEnd.x - 10} y={demandEnd.y - 15} fill="#2563eb" fontWeight="bold" fontSize="12" textAnchor="end">需求 D</text>
          <text x={supplyEnd.x - 10} y={supplyEnd.y - 15} fill="#ef4444" fontWeight="bold" fontSize="12" textAnchor="end">供给 S</text>

        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4 text-sm">
         <div className="flex items-center">
            <span className="w-3 h-3 bg-blue-500 opacity-30 mr-2 border border-blue-500"></span>
            <span className="text-slate-600">消费者剩余</span>
         </div>
         <div className="flex items-center">
            <span className="w-3 h-3 bg-purple-500 opacity-30 mr-2 border border-purple-500"></span>
            <span className="text-slate-600">生产者剩余</span>
         </div>
      </div>
    </div>
  );
};

export default MarketChart;