import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMpesaWithdrawalFee,
  calculateTillMerchantFee,
  calculateUnitEconomics,
  calculateInvoiceTotals,
  formatKSh,
} from './calculations.ts';

test('calculateMpesaWithdrawalFee handles tariff bands accurately', () => {
  assert.equal(calculateMpesaWithdrawalFee(0), 0);
  assert.equal(calculateMpesaWithdrawalFee(40), 0);
  assert.equal(calculateMpesaWithdrawalFee(100), 11);
  assert.equal(calculateMpesaWithdrawalFee(500), 29);
  assert.equal(calculateMpesaWithdrawalFee(1000), 29);
  assert.equal(calculateMpesaWithdrawalFee(1500), 31);
  assert.equal(calculateMpesaWithdrawalFee(3000), 52);
  assert.equal(calculateMpesaWithdrawalFee(5000), 69);
  assert.equal(calculateMpesaWithdrawalFee(10000), 115);
  assert.equal(calculateMpesaWithdrawalFee(25000), 197);
  assert.equal(calculateMpesaWithdrawalFee(60000), 309);
});

test('calculateTillMerchantFee calculates ~0.55% capped at 200 KSh', () => {
  assert.equal(calculateTillMerchantFee(100), 0);
  assert.equal(calculateTillMerchantFee(1000), 6);
  assert.equal(calculateTillMerchantFee(10000), 55);
  assert.equal(calculateTillMerchantFee(100000), 200);
});

test('calculateUnitEconomics calculates healthy profit margin and status', () => {
  const result = calculateUnitEconomics({
    sellingPrice: 2500,
    costOfGoods: 1400,
    packagingCost: 50,
    deliveryCost: 200,
    mpesaFeeType: 'till',
  });

  assert.equal(result.sellingPrice, 2500);
  assert.equal(result.mpesaFee, 14); // 2500 * 0.0055 = 13.75 -> 14
  assert.equal(result.totalCost, 1400 + 50 + 200 + 14); // 1664
  assert.equal(result.netProfit, 2500 - 1664); // 836
  assert.equal(result.status, 'healthy');
  assert.ok(result.netMarginPct > 30);
});

test('calculateUnitEconomics detects loss and warns', () => {
  const result = calculateUnitEconomics({
    sellingPrice: 1000,
    costOfGoods: 900,
    packagingCost: 50,
    deliveryCost: 150,
    mpesaFeeType: 'withdrawal',
  });

  assert.equal(result.status, 'loss');
  assert.ok(result.netProfit < 0);
  assert.ok(result.advice.includes('hasara'));
});

test('calculateInvoiceTotals calculates subtotal, discount, VAT, and grand total', () => {
  const items = [
    { id: '1', description: 'Canvas Sneakers (Size 42)', quantity: 2, unitPrice: 1800 },
    { id: '2', description: 'Shoe Cleaner Kit', quantity: 1, unitPrice: 400 },
  ];

  const totals = calculateInvoiceTotals(items, 'fixed', 200, 16);
  // Subtotal = (2*1800) + 400 = 4000
  // Discount = 200 -> Taxable = 3800
  // VAT 16% of 3800 = 608
  // Grand total = 3800 + 608 = 4408
  assert.equal(totals.subtotal, 4000);
  assert.equal(totals.discountAmount, 200);
  assert.equal(totals.taxAmount, 608);
  assert.equal(totals.grandTotal, 4408);
});

test('formatKSh formats numbers with Kenyan locale', () => {
  assert.equal(formatKSh(1500), 'KSh 1,500');
  assert.equal(formatKSh(45000), 'KSh 45,000');
});
