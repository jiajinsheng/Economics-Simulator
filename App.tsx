import React, { useState, useMemo } from 'react';
import MarketChart from './components/MarketChart';
import Controls from './components/Controls';
import StatsPanel from './components/StatsPanel';
import { MarketParams, MarketData } from './types';

// Inline SVG Icon to avoid external dependency issues
const TrendingUp = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const App: React.FC = () => {
  // Initial State: Standard X supply/demand cross
  const [params, setParams] = useState<MarketParams>({
    demandIntercept: 100,
    demandSlope: 1,
    supplyIntercept: 20,
    supplySlope: 1,
  });

  // Derived State: Calculate Market Equilibrium & Surpluses
  const marketData: MarketData = useMemo(() => {
    const { demandIntercept, demandSlope, supplyIntercept, supplySlope } = params;

    // Math:
    // Pd = a - bQ
    // Ps = c + dQ
    // Equilibrium: a - bQ = c + dQ => Q(b + d) = a - c => Q = (a - c) / (b + d)

    const eqQuantity = (demandIntercept - supplyIntercept) / (demandSlope + supplySlope);
    const safeEqQuantity = Math.max(0, eqQuantity);
    
    // Price at equilibrium
    const eqPrice = demandIntercept - demandSlope * safeEqQuantity;

    // Consumer Surplus: Area of triangle below Demand, above Price = 0.5 * base * height
    // Height = Intercept - EqPrice
    // Base = EqQuantity
    const csHeight = demandIntercept - eqPrice;
    const consumerSurplus = 0.5 * safeEqQuantity * csHeight;

    // Producer Surplus: Area of triangle above Supply, below Price
    // Height = EqPrice - SupplyIntercept
    const psHeight = eqPrice - supplyIntercept;
    const producerSurplus = 0.5 * safeEqQuantity * psHeight;

    return {
      eqQuantity: safeEqQuantity,
      eqPrice,
      consumerSurplus: Math.max(0, consumerSurplus),
      producerSurplus: Math.max(0, producerSurplus),
      totalSurplus: Math.max(0, consumerSurplus + producerSurplus)
    };
  }, [params]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">经济学模拟器 (Economics Simulator)</h1>
          </div>
          <p className="text-slate-600 max-w-2xl">
            探索供给和需求的变化如何影响市场均衡和福利。
            实时可视化<span className="text-blue-600 font-semibold">消费者剩余</span>和<span className="text-purple-600 font-semibold">生产者剩余</span>。
          </p>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Controls */}
          <div className="lg:col-span-4 space-y-6">
            <Controls params={params} onChange={setParams} />
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
              <h4 className="font-semibold mb-1">小贴士：</h4>
              <p>增加**支付意愿（需求截距）**可以模拟消费者收入增加或产品更受欢迎的情况。注意观察价格和交易数量是如何同时上升的。</p>
            </div>
          </div>

          {/* Right: Visualization & Stats */}
          <div className="lg:col-span-8">
            <StatsPanel data={marketData} />
            <MarketChart params={params} marketData={marketData} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;