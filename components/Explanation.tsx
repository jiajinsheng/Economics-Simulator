import React, { useState } from 'react';
import { explainMarketParams } from '../services/geminiService';
import { MarketData, MarketParams } from '../types';
import { Sparkles, Loader2, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ExplanationProps {
  params: MarketParams;
  data: MarketData;
}

const Explanation: React.FC<ExplanationProps> = ({ params, data }) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    setLoading(true);
    const result = await explainMarketParams(params, data);
    setExplanation(result);
    setLoading(false);
  };

  return (
    <div className="mt-6 bg-slate-900 text-slate-100 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-indigo-400" />
          AI 经济学导师
        </h3>
        {!explanation && !loading && (
          <button
            onClick={handleExplain}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            分析当前市场
          </button>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <p>正在分析供需曲线...</p>
        </div>
      )}

      {explanation && !loading && (
        <div className="prose prose-invert max-w-none text-sm leading-relaxed">
          <ReactMarkdown>{explanation}</ReactMarkdown>
          <button
            onClick={handleExplain}
            className="mt-4 text-xs text-indigo-300 hover:text-indigo-200 underline"
          >
            更新分析
          </button>
        </div>
      )}

      {!explanation && !loading && (
        <p className="text-slate-400 text-sm">
          请调整左侧的控制滑块以改变市场条件，然后让 AI 解释这对生产者和消费者剩余的影响。
        </p>
      )}
    </div>
  );
};

export default Explanation;