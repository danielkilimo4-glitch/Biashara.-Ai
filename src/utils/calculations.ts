/**
 * Pure calculation and formatting utilities for Kenyan businesses
 */

export interface MpesaFeeResult {
  withdrawalFee: number;
  sendMoneyFee: number;
  tillMerchantFee: number;
}

/**
 * Calculates Safaricom M-Pesa withdrawal fees based on standard tariff bands (in KSh)
 */
export function calculateMpesaWithdrawalFee(amount: number): number {
  if (amount <= 0) return 0;
  if (amount <= 49) return 0;
  if (amount <= 100) return 11;
  if (amount <= 500) return 29;
  if (amount <= 1000) return 29;
  if (amount <= 1500) return 31;
  if (amount <= 2500) return 31;
  if (amount <= 3500) return 52;
  if (amount <= 5000) return 69;
  if (amount <= 7500) return 87;
  if (amount <= 10000) return 115;
  if (amount <= 15000) return 167;
  if (amount <= 20000) return 185;
  if (amount <= 35000) return 197;
  if (amount <= 50000) return 278;
  return 309; // 50,001 to 250,000
}

/**
 * Calculates M-Pesa Till (Buy Goods) merchant fee (~0.55% capped at 200 KSh)
 */
export function calculateTillMerchantFee(amount: number): number {
  if (amount <= 200) return 0;
  const fee = Math.round(amount * 0.0055);
  return Math.min(fee, 200);
}

export interface UnitEconomicsInput {
  sellingPrice: number;
  costOfGoods: number;
  packagingCost?: number;
  deliveryCost?: number;
  mpesaFeeType?: 'till' | 'withdrawal' | 'none';
  customFee?: number;
}

export interface UnitEconomicsOutput {
  sellingPrice: number;
  totalCost: number;
  grossProfit: number;
  grossMarginPct: number;
  netProfit: number;
  netMarginPct: number;
  mpesaFee: number;
  markupPct: number;
  status: 'healthy' | 'caution' | 'loss';
  advice: string;
}

export function calculateUnitEconomics(input: UnitEconomicsInput): UnitEconomicsOutput {
  const {
    sellingPrice,
    costOfGoods,
    packagingCost = 0,
    deliveryCost = 0,
    mpesaFeeType = 'till',
    customFee = 0,
  } = input;

  let mpesaFee = customFee;
  if (mpesaFeeType === 'till') {
    mpesaFee = calculateTillMerchantFee(sellingPrice);
  } else if (mpesaFeeType === 'withdrawal') {
    mpesaFee = calculateMpesaWithdrawalFee(sellingPrice);
  }

  const grossProfit = sellingPrice - costOfGoods;
  const grossMarginPct = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;

  const totalCost = costOfGoods + packagingCost + deliveryCost + mpesaFee;
  const netProfit = sellingPrice - totalCost;
  const netMarginPct = sellingPrice > 0 ? (netProfit / sellingPrice) * 100 : 0;
  const markupPct = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

  let status: 'healthy' | 'caution' | 'loss' = 'healthy';
  let advice = '';

  if (netProfit < 0) {
    status = 'loss';
    advice = `Unapata hasara ya KSh ${Math.abs(Math.round(netProfit))} kwa kila item! Pandisha bei au punguza gharama za delivery na packaging mara moja.`;
  } else if (netMarginPct < 15) {
    status = 'caution';
    advice = `Margin yako ya ${netMarginPct.toFixed(1)}% iko chini. Mara nyingi ada za M-Pesa na usafiri zikiongezeka faida inafutika. Lenga margin ya angalau 25-35%.`;
  } else {
    status = 'healthy';
    advice = `Margin nzuri ya ${netMarginPct.toFixed(1)}%! Faida ya KSh ${Math.round(netProfit)} kwa kila item inatosha ku-reinvest katika mzigo mpya.`;
  }

  return {
    sellingPrice,
    totalCost,
    grossProfit,
    grossMarginPct: Number(grossMarginPct.toFixed(1)),
    netProfit: Number(netProfit.toFixed(2)),
    netMarginPct: Number(netMarginPct.toFixed(1)),
    mpesaFee,
    markupPct: Number(markupPct.toFixed(1)),
    status,
    advice,
  };
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceTotals {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
}

export function calculateInvoiceTotals(
  items: InvoiceItem[],
  discountType: 'fixed' | 'percent',
  discountValue: number,
  vatRate: number = 0
): InvoiceTotals {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  
  let discountAmount = 0;
  if (discountType === 'percent') {
    discountAmount = (subtotal * Math.min(100, Math.max(0, discountValue))) / 100;
  } else {
    discountAmount = Math.min(subtotal, Math.max(0, discountValue));
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * Math.max(0, vatRate)) / 100;
  const grandTotal = Math.round(taxableAmount + taxAmount);

  return {
    subtotal: Math.round(subtotal),
    discountAmount: Math.round(discountAmount),
    taxAmount: Math.round(taxAmount),
    grandTotal,
  };
}

export function formatKSh(amount: number): string {
  return `KSh ${amount.toLocaleString('en-KE')}`;
}
