import { useState, useEffect, useRef } from 'react';

const FALLBACK_RATES = {
  '24K': 548.50,
  '22K': 502.85,
  '21K': 479.95,
  '18K': 411.40,
  'Silver': 3.80,
};

export type MetalType = keyof typeof FALLBACK_RATES;

export const useLiveGoldRate = () => {
  const [rates, setRates] = useState(FALLBACK_RATES);
  const [trend, setTrend] = useState<'up' | 'down' | 'neutral'>('neutral');
  const [isLive, setIsLive] = useState(false);
  const lastPriceRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        const response = await fetch('/api/gold-rates');
        
        if (!response.ok) {
          throw new Error('API request failed');
        }
        
        const data = await response.json();
        
        if (!data['24K']) {
          throw new Error('Invalid price data');
        }

        const price24K = data['24K'];

        if (lastPriceRef.current !== null) {
          if (price24K > lastPriceRef.current) {
            setTrend('up');
          } else if (price24K < lastPriceRef.current) {
            setTrend('down');
          } else {
            setTrend('neutral');
          }
        }
        
        lastPriceRef.current = price24K;
        setIsLive(!data.stale);

        setRates({
          '24K': data['24K'],
          '22K': data['22K'],
          '21K': data['21K'],
          '18K': data['18K'],
          'Silver': data['Silver'] || FALLBACK_RATES['Silver'],
        });
      } catch (error) {
        console.error('Gold price fetch error:', error);
        setIsLive(false);
      }
    };

    fetchGoldPrice();
    const interval = setInterval(fetchGoldPrice, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  return { rates, trend, isLive };
};

export const calculatePrice = (grams: number, purity: MetalType, makingChargePerGram: number, liveRates: typeof FALLBACK_RATES) => {
  const metalPrice = liveRates[purity] * grams;
  const makingCharges = makingChargePerGram * grams;
  const vat = (metalPrice + makingCharges) * 0.05;
  
  return {
    base: metalPrice,
    making: makingCharges,
    vat: vat,
    total: metalPrice + makingCharges + vat
  };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2
  }).format(amount);
};
