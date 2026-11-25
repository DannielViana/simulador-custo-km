import { useState, useEffect, useMemo } from 'react';
import type { FuelInputs } from './types/fuel';
import { calculateFuelCost } from './utils/calculateFuel';

const STORAGE_KEY = 'simulador-custo-km-v4';

const DEFAULT_INPUTS: FuelInputs = {
  ethanolPrice: 0,
  gasolinePrice: 0,
  ethanolDiscount: 0,
  gasolineDiscount: 0,
  ethanolConsumption: 0,
  gasolineConsumption: 0,
};

const formatBRL = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function App() {
  const [inputs, setInputs] = useState<FuelInputs>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as FuelInputs) : DEFAULT_INPUTS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  }, [inputs]);

  const result = useMemo(() => calculateFuelCost(inputs), [inputs]);

  const handleChange = (field: keyof FuelInputs, rawValue: string) => {
    const parsed = parseFloat(rawValue);
    setInputs((prev) => ({
      ...prev,
      [field]: Number.isNaN(parsed) ? 0 : Math.max(0, parsed),
    }));
  };

  const resetDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setInputs(DEFAULT_INPUTS);
  };

  const bestOptionLabel =
    result.bestOption === 'ethanol'
      ? 'Etanol'
      : result.bestOption === 'gasoline'
      ? 'Gasolina'
      : 'Aguardando preços';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4">
      <main className="max-w-3xl mx-auto space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Simulador de Custo por Km
            </h1>
            <p className="text-sm text-slate-400">
              Comparativo de custo por km entre Etanol e Gasolina com desconto
            </p>
          </div>
          <button
            type="button"
            onClick={resetDefaults}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
          >
            Zerar valores
          </button>
        </header>

        {/* Cards de Resultado */}
        <section className="grid sm:grid-cols-2 gap-4">
          <div className="bg-emerald-950/50 border border-emerald-700/60 rounded-xl p-4">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              Mais vantajoso
            </span>
            <p className="text-2xl font-bold text-white mt-1">{bestOptionLabel}</p>
            <p className="text-sm text-emerald-300 mt-1">
              {formatBRL(result.bestCostPerKm)} / km rodado
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Paridade Real
            </span>
            <p className="text-2xl font-bold text-white mt-1">
              {result.priceRatio.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Etanol líquido: {formatBRL(result.effectiveEthanolPrice)}/L · Gasolina líquida:{' '}
              {formatBRL(result.effectiveGasolinePrice)}/L
            </p>
          </div>
        </section>

        {/* Inputs de Combustível */}
        <section className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-emerald-400">Etanol</h2>
              <span className="text-xs text-slate-400">
                {formatBRL(result.ethanolCostPerKm)}/km
              </span>
            </div>
            <InputField
              label="Preço na bomba (R$/L)"
              step="0.01"
              placeholder="0,00"
              value={inputs.ethanolPrice}
              onChange={(v) => handleChange('ethanolPrice', v)}
            />
            <InputField
              label="Desconto app/posto (R$/L)"
              step="0.01"
              placeholder="0,00"
              value={inputs.ethanolDiscount}
              onChange={(v) => handleChange('ethanolDiscount', v)}
            />
            <InputField
              label="Consumo médio (km/L)"
              step="0.1"
              placeholder="0,0"
              value={inputs.ethanolConsumption}
              onChange={(v) => handleChange('ethanolConsumption', v)}
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-amber-400">Gasolina</h2>
              <span className="text-xs text-slate-400">
                {formatBRL(result.gasolineCostPerKm)}/km
              </span>
            </div>
            <InputField
              label="Preço na bomba (R$/L)"
              step="0.01"
              placeholder="0,00"
              value={inputs.gasolinePrice}
              onChange={(v) => handleChange('gasolinePrice', v)}
            />
            <InputField
              label="Desconto app/posto (R$/L)"
              step="0.01"
              placeholder="0,00"
              value={inputs.gasolineDiscount}
              onChange={(v) => handleChange('gasolineDiscount', v)}
            />
            <InputField
              label="Consumo médio (km/L)"
              step="0.1"
              placeholder="0,0"
              value={inputs.gasolineConsumption}
              onChange={(v) => handleChange('gasolineConsumption', v)}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: number;
  step?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

function InputField({
  label,
  value,
  step = '1',
  placeholder = '0',
  onChange,
}: InputFieldProps) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-slate-400">{label}</span>
      <input
        type="number"
        step={step}
        min="0"
        placeholder={placeholder}
        value={value === 0 ? '' : value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
      />
    </label>
  );
}

export default App;