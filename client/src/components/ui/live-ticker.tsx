import { motion, AnimatePresence } from 'framer-motion';
import { useLiveGoldRate, formatCurrency, MetalType } from '@/lib/gold-price';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

export function LiveTicker() {
  const { rates, trend, isLive } = useLiveGoldRate();

  const getIcon = () => {
    if (trend === 'up') return <ArrowUp className="w-3 h-3 text-green-500" />;
    if (trend === 'down') return <ArrowDown className="w-3 h-3 text-red-500" />;
    return <Minus className="w-3 h-3 text-gray-400" />;
  };

  const getColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white border-b border-gray-100 py-2 overflow-hidden sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between text-xs font-medium tracking-wide uppercase text-gray-500">
        <span className="hidden md:inline-block font-serif italic text-gold mr-4">Live Market Rates (AED/g)</span>
        
        <div className="flex-1 flex justify-end md:justify-center gap-6 md:gap-12 overflow-x-auto no-scrollbar">
          {(Object.keys(rates) as MetalType[]).map((purity: MetalType) => (
            <div key={purity} className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-gray-900 font-bold">{purity}</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={rates[purity]}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={`flex items-center gap-1 ${getColor()}`}
                >
                  {formatCurrency(rates[purity] as number)}
                  {getIcon()}
                </motion.span>
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2 ml-4">
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
          <span>{isLive ? 'Live' : 'Updating...'}</span>
        </div>
      </div>
    </div>
  );
}
