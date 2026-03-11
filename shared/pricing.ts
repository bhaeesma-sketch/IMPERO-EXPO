// Pricing configuration for accurate gold prices
// Based on Dubai retail market

export const PURITY_CONVERSION = {
  '24K': 1.0,
  '22K': 22/24,
  '21K': 21/24,
  '18K': 18/24,
} as const;

// Retail markup per purity (AED per gram above spot)
// These are typical Dubai jewelry retail markups
export const RETAIL_MARKUP_BY_PURITY = {
  '24K': 45, // AED per gram
  '22K': 50, // Slightly higher markup for common jewelry purity
  '21K': 55, // 21K is very popular in Middle East
  '18K': 60, // Lower purity, higher markup
  'Silver': 8, // Silver markup
} as const;

// Making charges (AED per gram) - variable by complexity
export const BASE_MAKING_CHARGES = {
  '24K': 8,    // Pure gold, simpler work
  '22K': 12,   // Most common
  '21K': 15,   // Popular purity
  '18K': 18,   // More complex alloys
  'Silver': 3,
} as const;

// VAT rates
export const VAT_RATE = 0.05; // 5% in UAE

// Currency conversions
export const FOREX_RATES = {
  USD_TO_AED: 3.6725,
  EUR_TO_AED: 4.01,
  GBP_TO_AED: 4.62,
} as const;

// Troy ounce to grams
export const TROY_OZ_TO_GRAMS = 31.1035;

/**
 * Calculate retail price based on spot price
 * This is the ACCURATE method for jewelry pricing
 */
export function calculateRetailPrice(
  spotPricePerGram: number,
  purity: keyof typeof PURITY_CONVERSION,
  makingChargeMultiplier: number = 1 // 1 = base, 1.5 = complex design, 0.7 = simple
): {
  spotPrice: number;
  retailMarkup: number;
  makingCharge: number;
  subtotal: number;
  vat: number;
  total: number;
} {
  // Adjust for purity
  const purityAdjusted = spotPricePerGram * PURITY_CONVERSION[purity];
  
  // Add retail markup
  const retailMarkup = RETAIL_MARKUP_BY_PURITY[purity];
  
  // Calculate making charge
  const baseMakingCharge = BASE_MAKING_CHARGES[purity];
  const adjustedMakingCharge = baseMakingCharge * makingChargeMultiplier;
  
  // Subtotal (before VAT)
  const subtotal = purityAdjusted + retailMarkup + adjustedMakingCharge;
  
  // VAT on entire amount
  const vat = subtotal * VAT_RATE;
  
  // Final total
  const total = subtotal + vat;
  
  return {
    spotPrice: purityAdjusted,
    retailMarkup,
    makingCharge: adjustedMakingCharge,
    subtotal,
    vat,
    total,
  };
}

/**
 * Calculate price for a piece of jewelry
 */
export function calculateJewelryPrice(
  spotPricePerGram: number,
  purity: keyof typeof PURITY_CONVERSION,
  weightInGrams: number,
  makingChargeMultiplier: number = 1
): {
  metalCost: number;
  makingCost: number;
  subtotal: number;
  vat: number;
  total: number;
  pricePerGram: number;
} {
  const priceBreakdown = calculateRetailPrice(spotPricePerGram, purity, makingChargeMultiplier);
  
  const metalCost = (priceBreakdown.spotPrice + priceBreakdown.retailMarkup) * weightInGrams;
  const makingCost = priceBreakdown.makingCharge * weightInGrams;
  const subtotal = metalCost + makingCost;
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;
  
  return {
    metalCost,
    makingCost,
    subtotal,
    vat,
    total,
    pricePerGram: priceBreakdown.total,
  };
}
