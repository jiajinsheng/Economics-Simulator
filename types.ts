export interface MarketParams {
  demandIntercept: number; // The price where demand is 0 (y-intercept)
  demandSlope: number; // How much price drops per unit (positive number, treated negatively in logic)
  supplyIntercept: number; // The price where supply starts (y-intercept)
  supplySlope: number; // How much price increases per unit
}

export interface MarketData {
  eqPrice: number;
  eqQuantity: number;
  consumerSurplus: number;
  producerSurplus: number;
  totalSurplus: number;
}

export interface ChartPoint {
  q: number;
  demand: number | null;
  supply: number | null;
  priceLine: number | null;
  // Specific keys for area shading to ensure they stop at equilibrium
  csArea: number | null; 
  psArea: number | null;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
