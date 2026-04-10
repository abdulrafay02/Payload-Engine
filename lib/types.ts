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

export interface VehicleConfig {
  name: string;
  maxWeight: number;
  maxLength: number;
  maxWidth: number;
  maxHeight: number;
}

export const DEFAULT_VEHICLE: VehicleConfig = {
  name: 'T-250',
  maxWeight: 3200,
  maxLength: 132,
  maxWidth: 53,
  maxHeight: 72,
};

export const PRICING_CONSTANTS = {
  BASE_CPM: 1.50, // Cost per mile
  DEADHEAD_CPM: 0.80,
  MIN_PROFIT_MARGIN: 0.20, // 20%
  FUEL_SURCHARGE_PER_MILE: 0.40,
};
