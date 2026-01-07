import React from 'react';
import { MarketData, MarketParams } from '../types';

// This component is currently unused as AI features have been disabled.
// Kept as a placeholder to prevent import errors if referenced elsewhere.

interface ExplanationProps {
  params: MarketParams;
  data: MarketData;
}

const Explanation: React.FC<ExplanationProps> = () => {
  return null;
};

export default Explanation;