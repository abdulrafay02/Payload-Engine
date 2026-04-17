import { VehicleConfig, LoadData } from './types';

export const DEFAULT_VEHICLE: VehicleConfig = {
  name: 'T-250',
  maxWeight: 3200,
  maxLength: 132,
  maxWidth: 53,
  maxHeight: 72,
};

export const DEFAULT_LOAD_DATA: LoadData = {
  origin: '',
  destination: '',
  loadedMiles: 0,
  deadheadMiles: 0,
  weight: 0,
};

export const PRICING_CONSTANTS = {
  BASE_CPM: 1.50, // Cost per mile
  DEADHEAD_CPM: 0.80,
  MIN_PROFIT_MARGIN: 0.20, // 20%
  FUEL_SURCHARGE_PER_MILE: 0.40,
};

export const STORAGE_KEYS = {
  AUDIT_TRAIL: 'payload_audit_trail',
  BOOTED: 'payload_booted',
};

export const ANIMATION_ROW_DELAY = 1.2;
export const ANIMATION_ROW_STAGGER = 0.1;
export const ANIMATION_DURATION = 0.4;
