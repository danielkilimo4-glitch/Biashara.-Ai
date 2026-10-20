import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Coins, 
  Truck, 
  Package, 
  Store,
  DollarSign,
  ArrowRight,
  Info
} from 'lucide-react';
import { calculateUnitEconomics, calculateMpesaWithdrawalFee, calculateTillMerchantFee, formatKSh } from '../utils/calculations';

const PRESET_CALCULATIONS = [
  {
    name: '👟 Mitumba Shoes / Sneakers',
    sellingPrice: 2800,
    costOfGoods: 1600,
    packaging: 50,
    delivery: 200,
    mpesaType: 'till' as const,
    itemsPerDay: 4,
    monthlyRent: 15000,
  },
  {
    name: '👗 Fast-Fashion Thrift Dress',
    sellingPrice: 1200,
    costOfGoods: 500,
    packaging: 30,
    delivery: 150,
    mpesaType: 'till' as const,
    itemsPerDay: 8,
    monthlyRent: 12000,
  },
  {
    name: '🌭 Smokie & Pasua Trolley',
    sellingPrice: 50,
    costOfGoods: 28,
    packaging: 5,
    delivery: 0,
    mpesaType: 'none' as const,
    itemsPerDay: 80,
    monthlyRent: 5000,
  },
  {
    name: '📱 Phone Accessories & Cables',
    sellingPrice: 650,
    costOfGoods: 250,
    packaging: 20,
    delivery: 100,
    mpesaType: 'withdrawal' as const,
    itemsPerDay: 6,
    monthlyRent: 10000,
  },
];

export const ProfitCalculator: React.FC = () => {
  const [sellingPrice, setSellingPrice] = useState<number>(2800);
  const [costOfGoods, setCostOfGoods] = useState<number>(1600);
  const [packagingCost, setPackagingCost] = useState<number>(50);
  const [deliveryCost, setDeliveryCost] = useState<number>(200);
  const [mpesaFeeType, setMpesaFeeType] = useState<'till' | 'withdrawal' | 'none'>('till');
  const [itemsPerDay, setItemsPerDay] = useState<number>(4);
  const [monthlyRent, setMonthlyRent] = useState<number>(15000);

  const unitEconomics = calculateUnitEconomics({
    sellingPrice,
    costOfGoods,
    packagingCost,
    deliveryCost,
    mpesaFeeType,
  });

  // Monthly Projection Calculations (Assuming 26 working days)
  const monthlyItems = itemsPerDay * 26;
  const monthlyRevenue = monthlyItems * sellingPrice;
  const monthlyGrossProfit = monthlyItems * unitEconomics.grossProfit;
  const monthlyNetBeforeRent = monthlyItems * unitEconomics.netProfit;
  const monthlyNetTakeHome = monthlyNetBeforeRent - monthlyRent;
  const breakEvenUnits = unitEconomics.netProfit > 0 
    ? Math.ceil(monthlyRent / unitEconomics.netProfit) 
    : 0;

  const loadPreset = (preset: typeof PRESET_CALCULATIONS[0]) => {
    setSellingPrice(preset.sellingPrice);
    setCostOfGoods(preset.costOfGoods);
    setPackagingCost(preset.packaging);
    setDeliveryCost(preset.delivery);
    setMpesaFeeType(preset.mpesaType);
    setItemsPerDay(preset.itemsPerDay);
    setMonthlyRent(preset.monthlyRent);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-stone-850 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Calculator className="w-5 h-5" />
          </span>
          <h2 className="text-lg font-bold text-white">M-Pesa & Biashara Profit Calculator</h2>
        </div>
        <p className="text-xs text-stone-400">
          Calculate your real profit per item after wholesale purchase, packaging, boda boda delivery, and Safaricom M-Pesa transaction fees.
        </p>

        {/* Presets */}
        <div className="mt-4 pt-3 border-t border-stone-800">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-2">
            Mifano Halisi ya Biashara (Real Kenyan Scenarios):
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {PRESET_CALCULATIONS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadPreset(preset)}
                className="whitespace-nowrap px-3 py-1.5 bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-300 hover:text-emerald-400 rounded-lg text-xs font-medium transition-colors shrink-0"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Inputs */}
        <div className="lg:col-span-5 bg-stone-850 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-stone-800 pb-3">
            <Coins className="w-4 h-4 text-emerald-400" />
            Gharama za Item Moja (Single Unit Costs)
          </h3>

          <div>
            <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Bei ya Kuuza kwa Mteja (Selling Price KSh)
            </label>
            <input
              type="number"
              min="0"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-stone-900 border border-stone-750 rounded-xl px-3.5 py-2.5 text-sm font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Bei ya Kununua Mzigo (Wholesale / Buying Cost KSh)
            </label>
            <input
              type="number"
              min="0"
              value={costOfGoods}
              onChange={(e) => setCostOfGoods(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-stone-900 border border-stone-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Package className="w-3 h-3 text-stone-400" /> Packaging (KSh)
              </label>
              <input
                type="number"
                min="0"
                value={packagingCost}
                onChange={(e) => setPackagingCost(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-stone-900 border border-stone-750 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Truck className="w-3 h-3 text-stone-400" /> Boda / Delivery (KSh)
              </label>
              <input
                type="number"
                min="0"
                value={deliveryCost}
                onChange={(e) => setDeliveryCost(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-stone-900 border border-stone-750 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* M-Pesa Fee Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Ada ya M-Pesa (Transaction Fee Model)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMpesaFeeType('till')}
                className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                  mpesaFeeType === 'till'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-stone-900 text-stone-400 border-stone-750 hover:text-white'
                }`}
              >
                Buy Goods (~0.55%)
              </button>
              <button
                type="button"
                onClick={() => setMpesaFeeType('withdrawal')}
                className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                  mpesaFeeType === 'withdrawal'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-stone-900 text-stone-400 border-stone-750 hover:text-white'
                }`}
              >
                Agent Withdrawal
              </button>
              <button
                type="button"
                onClick={() => setMpesaFeeType('none')}
                className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                  mpesaFeeType === 'none'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-stone-900 text-stone-400 border-stone-750 hover:text-white'
                }`}
              >
                Cash (0 KSh)
              </button>
            </div>
          </div>

          {/* Monthly Fixed Cost / Rent */}
          <div className="pt-2 border-t border-stone-800 space-y-3">
            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-stone-400" /> Makadirio ya Mwezi (Monthly Projections)
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-stone-400 mb-1">Items Unazouza kwa Siku</label>
                <input
                  type="number"
                  min="1"
                  value={itemsPerDay}
                  onChange={(e) => setItemsPerDay(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-stone-900 border border-stone-750 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] text-stone-400 mb-1">Kodi ya Stall / Rent (KSh/mwezi)</label>
                <input
                  type="number"
                  min="0"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-stone-900 border border-stone-750 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Calculated Results */}
        <div className="lg:col-span-7 space-y-4">
          {/* Health Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 shadow-lg ${
              unitEconomics.status === 'healthy'
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : unitEconomics.status === 'caution'
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                : 'bg-red-950/40 border-red-500/50 text-red-200'
            }`}
          >
            {unitEconomics.status === 'healthy' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : unitEconomics.status === 'caution' ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="text-sm font-bold capitalize">
                {unitEconomics.status === 'healthy'
                  ? 'Faida Iko Safi (Healthy Margin)'
                  : unitEconomics.status === 'caution'
                  ? 'Margin Iko Chini (Caution)'
                  : 'Unaingia Hasara (Loss Warning)'}
              </h4>
              <p className="text-xs mt-1 leading-relaxed opacity-90">{unitEconomics.advice}</p>
            </div>
          </div>

          {/* Unit Cost Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-stone-850 border border-stone-800 p-3.5 rounded-xl text-center">
              <span className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">
                Gharama Yote (Total Cost)
              </span>
              <span className="text-base font-extrabold text-stone-200">
                {formatKSh(unitEconomics.totalCost)}
              </span>
            </div>

            <div className="bg-stone-850 border border-stone-800 p-3.5 rounded-xl text-center">
              <span className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">
                Ada ya M-Pesa
              </span>
              <span className="text-base font-extrabold text-stone-200">
                {formatKSh(unitEconomics.mpesaFee)}
              </span>
            </div>

            <div className="bg-stone-850 border border-stone-800 p-3.5 rounded-xl text-center">
              <span className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">
                Faida Halisi (Net Profit)
              </span>
              <span
                className={`text-base font-extrabold ${
                  unitEconomics.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {formatKSh(unitEconomics.netProfit)}
              </span>
            </div>

            <div className="bg-stone-850 border border-stone-800 p-3.5 rounded-xl text-center">
              <span className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">
                Net Margin %
              </span>
              <span
                className={`text-base font-extrabold ${
                  unitEconomics.netMarginPct >= 20 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {unitEconomics.netMarginPct}%
              </span>
            </div>
          </div>

          {/* Visual Cost Allocation Bar */}
          <div className="bg-stone-850 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
              Mgawanyo wa KSh {sellingPrice.toLocaleString()} (Where Your Money Goes)
            </h4>

            {sellingPrice > 0 ? (
              <div className="w-full h-5 rounded-full overflow-hidden flex bg-stone-800">
                <div
                  style={{ width: `${Math.min(100, (costOfGoods / sellingPrice) * 100)}%` }}
                  className="bg-blue-500 h-full"
                  title="Stock / Wholesale"
                />
                <div
                  style={{ width: `${Math.min(100, (packagingCost / sellingPrice) * 100)}%` }}
                  className="bg-amber-500 h-full"
                  title="Packaging"
                />
                <div
                  style={{ width: `${Math.min(100, (deliveryCost / sellingPrice) * 100)}%` }}
                  className="bg-purple-500 h-full"
                  title="Delivery"
                />
                <div
                  style={{ width: `${Math.min(100, (unitEconomics.mpesaFee / sellingPrice) * 100)}%` }}
                  className="bg-red-500 h-full"
                  title="M-Pesa Fee"
                />
                <div
                  style={{ width: `${Math.max(0, (unitEconomics.netProfit / sellingPrice) * 100)}%` }}
                  className="bg-emerald-500 h-full"
                  title="Net Profit"
                />
              </div>
            ) : null}

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] pt-1">
              <div className="flex items-center gap-1.5 text-stone-300">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                <span>Mzigo: {formatKSh(costOfGoods)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                <span>Begi: {formatKSh(packagingCost)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-300">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
                <span>Boda: {formatKSh(deliveryCost)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-300">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                <span>M-Pesa: {formatKSh(unitEconomics.mpesaFee)}</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>Faida: {formatKSh(unitEconomics.netProfit)}</span>
              </div>
            </div>
          </div>

          {/* Monthly Projection Table */}
          <div className="bg-stone-850 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Makadirio ya Mwezi (Monthly Forecast)
              </h4>
              <span className="text-[11px] text-stone-400">Siku 26 za kazi</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-stone-900 p-3 rounded-xl border border-stone-800">
                <span className="text-[10px] text-stone-400 block mb-0.5">Jumla ya Mauzo (Revenue)</span>
                <span className="text-sm font-bold text-stone-200">{formatKSh(monthlyRevenue)}</span>
                <span className="text-[10px] text-stone-500 block">{monthlyItems} items/mwezi</span>
              </div>

              <div className="bg-stone-900 p-3 rounded-xl border border-stone-800">
                <span className="text-[10px] text-stone-400 block mb-0.5">Faida Kabla ya Rent</span>
                <span className="text-sm font-bold text-emerald-400">{formatKSh(monthlyNetBeforeRent)}</span>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-stone-900 p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
                <span className="text-[10px] text-emerald-300 block mb-0.5 font-semibold">
                  Mshahara Wako Baada ya Rent
                </span>
                <span className={`text-base font-extrabold ${monthlyNetTakeHome >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatKSh(monthlyNetTakeHome)}
                </span>
              </div>
            </div>

            {breakEvenUnits > 0 && (
              <div className="p-3 bg-stone-900 rounded-xl text-xs text-stone-300 flex items-center gap-2 border border-stone-800">
                <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Unahitaji kuuza angalau <strong>{breakEvenUnits} items kwa mwezi</strong> (takriban <strong>{Math.ceil(breakEvenUnits / 26)} items kwa siku</strong>) ili kulipa tu kodi ya KSh {monthlyRent.toLocaleString()} kabla ya kuanza kupata faida yako binafsi.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
