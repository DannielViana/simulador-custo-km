import type { FuelInputs, FuelCalculationResult, FuelType } from '../types/fuel';

export function calculateFuelCost(inputs: FuelInputs): FuelCalculationResult {
  const effectiveEthanolPrice = Math.max(0, inputs.ethanolPrice - inputs.ethanolDiscount);
  const effectiveGasolinePrice = Math.max(0, inputs.gasolinePrice - inputs.gasolineDiscount);

  const ethanolCostPerKm =
    inputs.ethanolConsumption > 0 ? effectiveEthanolPrice / inputs.ethanolConsumption : 0;

  const gasolineCostPerKm =
    inputs.gasolineConsumption > 0 ? effectiveGasolinePrice / inputs.gasolineConsumption : 0;

  const hasEthanol = effectiveEthanolPrice > 0 && inputs.ethanolConsumption > 0;
  const hasGasoline = effectiveGasolinePrice > 0 && inputs.gasolineConsumption > 0;

  let bestOption: FuelType = 'none';
  let bestCostPerKm = 0;

  if (hasEthanol && hasGasoline) {
    bestOption = ethanolCostPerKm <= gasolineCostPerKm ? 'ethanol' : 'gasoline';
    bestCostPerKm = Math.min(ethanolCostPerKm, gasolineCostPerKm);
  } else if (hasEthanol) {
    bestOption = 'ethanol';
    bestCostPerKm = ethanolCostPerKm;
  } else if (hasGasoline) {
    bestOption = 'gasoline';
    bestCostPerKm = gasolineCostPerKm;
  }

  const priceRatio =
    effectiveGasolinePrice > 0 ? (effectiveEthanolPrice / effectiveGasolinePrice) * 100 : 0;

  return {
    effectiveEthanolPrice,
    effectiveGasolinePrice,
    ethanolCostPerKm,
    gasolineCostPerKm,
    bestCostPerKm,
    bestOption,
    priceRatio,
  };
}