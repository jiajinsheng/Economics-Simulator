import React, { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Label
} from 'recharts';
import { MarketParams, MarketData, ChartPoint } from '../types';

interface MarketChartProps {
  params: MarketParams;
  marketData: MarketData;
}

const MarketChart: React.FC<MarketChartProps> = ({ params, marketData }) => {
  const { eqQuantity, eqPrice } = marketData;

  // Generate data points for the chart
  const data = useMemo(() => {
    const points: ChartPoint[] = [];
    const maxQ = Math.max(eqQuantity * 1.5, 20); // Dynamic X-axis range
    const step = maxQ / 50;

    // We strictly want a point AT equilibrium for clean shading
    const qValues = new Set<number>();
    for (let q = 0; q <= maxQ; q += step) qValues.add(q);
    qValues.add(eqQuantity); // Ensure precise intersection
    
    const sortedQs = Array.from(qValues).sort((a, b) => a - b);

    sortedQs.forEach((q) => {
      const demandP = Math.max(0, params.demandIntercept - params.demandSlope * q);
      const supplyP = Math.max(0, params.supplyIntercept + params.supplySlope * q);
      
      // Calculate areas only if Q <= Equilibrium Quantity
      const isLeftOfEq = q <= eqQuantity + 0.001; // Epsilon for float comparison

      points.push({
        q: Number(q.toFixed(2)),
        demand: demandP > 0 ? Number(demandP.toFixed(2)) : null,
        supply: Number(supplyP.toFixed(2)),
        priceLine: Number(eqPrice.toFixed(2)),
        // "csArea" is the demand curve value used for the shading area, bounded by Q_e
        csArea: isLeftOfEq ? Number(demandP.toFixed(2)) : null,
        // "psArea" is the supply curve value used for the shading area, bounded by Q_e
        psArea: isLeftOfEq ? Number(supplyP.toFixed(2)) : null,
      });
    });

    return points;
  }, [params, eqQuantity, eqPrice]);

  return (
    <div className="w-full h-[400px] md:h-[500px] bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="q" 
            type="number" 
            domain={[0, 'auto']} 
            tick={{ fill: '#64748b' }}
          >
            <Label value="数量 (Quantity)" offset={0} position="insideBottom" fill="#475569" />
          </XAxis>
          <YAxis 
            domain={[0, 'auto']} 
            tick={{ fill: '#64748b' }}
          >
             <Label value="价格 (Price)" angle={-90} position="insideLeft" fill="#475569" style={{ textAnchor: 'middle' }} />
          </YAxis>
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [`$${value}`, '']}
            labelFormatter={(label) => `数量: ${label}`}
          />
          
          {/* Consumer Surplus Area: Fill between Demand (csArea) and EqPrice */}
          <Area
            type="monotone"
            dataKey="csArea"
            stroke="none"
            fill="#3b82f6"
            fillOpacity={0.2}
            baseValue={eqPrice}
            name="消费者剩余 (Consumer Surplus)"
            isAnimationActive={false}
          />

          {/* Producer Surplus Area: Fill between Supply (psArea) and EqPrice */}
          <Area
            type="monotone"
            dataKey="psArea"
            stroke="none"
            fill="#a855f7"
            fillOpacity={0.2}
            baseValue={eqPrice}
            name="生产者剩余 (Producer Surplus)"
            isAnimationActive={false}
          />

          {/* Main Lines */}
          <Line 
            type="monotone" 
            dataKey="demand" 
            stroke="#2563eb" 
            strokeWidth={3} 
            dot={false} 
            name="需求曲线"
            isAnimationActive={false}
          />
          <Line 
            type="monotone" 
            dataKey="supply" 
            stroke="#ef4444" 
            strokeWidth={3} 
            dot={false} 
            name="供给曲线"
            isAnimationActive={false}
          />
          
          {/* Equilibrium Price Line (Visual Guide) */}
          <Line
            type="monotone"
            dataKey="priceLine"
            stroke="#64748b"
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={false}
            name="均衡价格"
            activeDot={false}
            isAnimationActive={false}
          />

          <ReferenceDot x={eqQuantity} y={eqPrice} r={6} fill="#0f172a" stroke="#fff" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketChart;