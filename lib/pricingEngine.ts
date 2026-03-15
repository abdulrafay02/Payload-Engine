import { LoadData, QuoteResult, VEHICLE_LIMITS, PRICING_CONSTANTS } from './types';

export function calculateQuote(data: LoadData): QuoteResult {
  const { loadedMiles, deadheadMiles, weight, dimensions } = data;
  const warnings: string[] = [];

  // Check limits
  const isOverweight = weight > VEHICLE_LIMITS.MAX_WEIGHT;
  if (isOverweight) {
    warnings.push(`OVERWEIGHT: ${weight}lbs exceeds ${VEHICLE_LIMITS.MAX_WEIGHT}lbs limit`);
  }

  let isOverSize = false;
  if (dimensions) {
    if (dimensions.length > VEHICLE_LIMITS.MAX_LENGTH) {
      isOverSize = true;
      warnings.push(`OVERLENGTH: ${dimensions.length}" exceeds ${VEHICLE_LIMITS.MAX_LENGTH}" limit`);
    }
    if (dimensions.width > VEHICLE_LIMITS.MAX_WIDTH) {
      isOverSize = true;
      warnings.push(`OVERWIDTH: ${dimensions.width}" exceeds ${VEHICLE_LIMITS.MAX_WIDTH}" limit`);
    }
    if (dimensions.height > VEHICLE_LIMITS.MAX_HEIGHT) {
      isOverSize = true;
      warnings.push(`OVERHEIGHT: ${dimensions.height}" exceeds ${VEHICLE_LIMITS.MAX_HEIGHT}" limit`);
    }
  }

  // Deterministic Math
  const basePay = loadedMiles * PRICING_CONSTANTS.BASE_CPM;
  const fuelSurcharge = loadedMiles * PRICING_CONSTANTS.FUEL_SURCHARGE_PER_MILE;
  const deadheadCost = deadheadMiles * PRICING_CONSTANTS.DEADHEAD_CPM;
  
  // Target profit margin
  const totalCost = basePay + fuelSurcharge + deadheadCost;
  const recommendedBid = totalCost * (1 + PRICING_CONSTANTS.MIN_PROFIT_MARGIN);
  const cpm = loadedMiles > 0 ? recommendedBid / loadedMiles : 0;

  if (loadedMiles < 50) {
    warnings.push("SHORT HAUL: Consider minimum flat rate");
  }

  return {
    recommendedBid: Math.round(recommendedBid * 100) / 100,
    basePay,
    fuelSurcharge,
    deadheadCost,
    profitMargin: PRICING_CONSTANTS.MIN_PROFIT_MARGIN,
    cpm: Math.round(cpm * 100) / 100,
    warnings,
    isOverweight,
    isOverSize,
  };
}
