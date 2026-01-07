import React from 'react';
import { MarketData } from '../types';

interface StatsPanelProps {
  data: MarketData;
}

const StatCard = ({
  label,
  value,
  subValue,
  colorBg,
  colorText,
  borderColor
}: {
  label: string;
  value: string;
  subValue?: string;
  colorBg: string;
  colorText: string;
  borderColor: string;
}) => (
  <div className={`p-4 rounded-lg border ${borderColor} ${colorBg} flex flex-col justify-between`}>
    <span className={`text-sm font-semibold ${colorText} opacity-80 uppercase tracking-wider`}>
      {label}
    </span>
    <div className="mt-2">
      <span className={`text-2xl font-bold ${colorText}`}>{value}</span>
      {subValue && (
        <span className={`block text-sm ${colorText} opacity-75`}>{subValue}</span>
      )}
    </div>
  </div>
);

const StatsPanel: React.FC<StatsPanelProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatCard
        label="市场价格"
        value={`$${data.eqPrice.toFixed(2)}`}
        colorBg="bg-slate-50"
        borderColor="border-slate-200"
        colorText="text-slate-700"
      />
      <StatCard
        label="交易数量"
        value={`${data.eqQuantity.toFixed(2)}`}
        colorBg="bg-slate-50"
        borderColor="border-slate-200"
        colorText="text-slate-700"
      />
      <StatCard
        label="消费者剩余"
        value={`$${data.consumerSurplus.toFixed(2)}`}
        subValue="(蓝色区域)"
        colorBg="bg-blue-50"
        borderColor="border-blue-200"
        colorText="text-blue-800"
      />
      <StatCard
        label="生产者剩余"
        value={`$${data.producerSurplus.toFixed(2)}`}
        subValue="(紫色区域)"
        colorBg="bg-purple-50"
        borderColor="border-purple-200"
        colorText="text-purple-800"
      />
    </div>
  );
};

export default StatsPanel;