export interface LoadData {
  origin: string;
  destination: string;
  loadedMiles: number;
  deadheadMiles: number;
  weight: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface QuoteResult {
  recommendedBid: number;
  basePay: number;
  fuelSurcharge: number;
  deadheadCost: number;
  profitMargin: number;
  cpm: number;
  warnings: string[];
  isOverweight: boolean;
  isOverSize: boolean;
}

export interface AuditEntry extends LoadData {
  id: string;
  timestamp: number;
  quote: QuoteResult;
  aiNote?: string;
  status: 'pending' | 'won' | 'lost';
}

export const VEHICLE_LIMITS = {
  MAX_WEIGHT: 3200,
  MAX_LENGTH: 132,
  MAX_WIDTH: 53,
  MAX_HEIGHT: 72,
};

export const PRICING_CONSTANTS = {
  BASE_CPM: 1.50, // Cost per mile
  DEADHEAD_CPM: 0.80,
  MIN_PROFIT_MARGIN: 0.20, // 20%
  FUEL_SURCHARGE_PER_MILE: 0.40,
};
