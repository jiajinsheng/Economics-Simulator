import React from 'react';
import { MarketParams } from '../types';

interface ControlsProps {
  params: MarketParams;
  onChange: (newParams: MarketParams) => void;
}

const SliderControl = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  colorClass
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  colorClass: string;
}) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <span className={`text-sm font-bold ${colorClass}`}>{value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400"
    />
  </div>
);

const Controls: React.FC<ControlsProps> = ({ params, onChange }) => {
  const updateParam = (key: keyof MarketParams, value: number) => {
    onChange({ ...params, [key]: value });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
        市场参数设置
      </h3>

      <div className="space-y-6">
        <div>
          <h4 className="text-blue-600 font-semibold mb-2 flex items-center">
            <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
            需求端 (Demand)
          </h4>
          <SliderControl
            label="支付意愿 (截距)"
            value={params.demandIntercept}
            min={50}
            max={200}
            step={5}
            onChange={(v) => updateParam('demandIntercept', v)}
            colorClass="text-blue-700"
          />
          <SliderControl
            label="价格敏感度 (斜率)"
            value={params.demandSlope}
            min={0.5}
            max={5}
            step={0.1}
            onChange={(v) => updateParam('demandSlope', v)}
            colorClass="text-blue-700"
          />
        </div>

        <div>
          <h4 className="text-red-600 font-semibold mb-2 flex items-center">
             <span className="w-3 h-3 bg-red-600 rounded-full mr-2"></span>
             供给端 (Supply)
          </h4>
          <SliderControl
            label="基础成本 (截距)"
            value={params.supplyIntercept}
            min={0}
            max={50}
            step={2}
            onChange={(v) => updateParam('supplyIntercept', v)}
            colorClass="text-red-700"
          />
          <SliderControl
            label="生产扩展性 (斜率)"
            value={params.supplySlope}
            min={0.5}
            max={5}
            step={0.1}
            onChange={(v) => updateParam('supplySlope', v)}
            colorClass="text-red-700"
          />
        </div>
      </div>
    </div>
  );
};

export default Controls;