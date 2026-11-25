export type FuelType = 'ethanol' | 'gasoline' | 'none';

export interface FuelInputs {
  ethanolPrice: number;
  gasolinePrice: number;
  ethanolDiscount: number;
  gasolineDiscount: number;
  ethanolConsumption: number;
  gasolineConsumption: number;
}

export interface FuelCalculationResult {
  effectiveEthanolPrice: number;
  effectiveGasolinePrice: number;
  ethanolCostPerKm: number;
  gasolineCostPerKm: number;
  bestCostPerKm: number;
  bestOption: FuelType;
  priceRatio: number;
}