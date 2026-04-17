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
