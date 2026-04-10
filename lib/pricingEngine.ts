import { LoadData, QuoteResult, VehicleConfig, PRICING_CONSTANTS } from './types';

export function calculateQuote(data: LoadData, vehicle: VehicleConfig): QuoteResult {
  const { loadedMiles, deadheadMiles, weight, dimensions } = data;
  const warnings: string[] = [];

  // Check limits
  const isOverweight = weight > vehicle.maxWeight;
  if (isOverweight) {
    warnings.push(`OVERWEIGHT: ${weight}lbs exceeds ${vehicle.maxWeight}lbs limit`);
  }

  let isOverSize = false;
  if (dimensions) {
    if (dimensions.length > vehicle.maxLength) {
      isOverSize = true;
      warnings.push(`OVERLENGTH: ${dimensions.length}" exceeds ${vehicle.maxLength}" limit`);
    }
    if (dimensions.width > vehicle.maxWidth) {
      isOverSize = true;
      warnings.push(`OVERWIDTH: ${dimensions.width}" exceeds ${vehicle.maxWidth}" limit`);
    }
    if (dimensions.height > vehicle.maxHeight) {
      isOverSize = true;
      warnings.push(`OVERHEIGHT: ${dimensions.height}" exceeds ${vehicle.maxHeight}" limit`);
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
