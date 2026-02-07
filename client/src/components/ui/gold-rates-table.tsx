import { motion } from 'framer-motion';
import { useLiveGoldRate, formatCurrency, MetalType } from '@/lib/gold-price';
import { ArrowUp, ArrowDown, Minus, TrendingUp } from 'lucide-react';

export function GoldRatesTable() {
  const { rates, trend, isLive } = useLiveGoldRate();

  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-500';
  };

  const purityData = [
    { key: '24K' as MetalType, name: '24 Karat', purity: '999.9', description: 'Pure Gold' },
    { key: '22K' as MetalType, name: '22 Karat', purity: '916.7', description: 'Jewelry Grade' },
    { key: '21K' as MetalType, name: '21 Karat', purity: '875.0', description: 'Premium Jewelry' },
    { key: '18K' as MetalType, name: '18 Karat', purity: '750.0', description: 'Fine Jewelry' },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-[#FAFAFA] to-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-[1px] w-12 bg-primary/50"></span>
            <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">Market Rates</span>
            <span className="h-[1px] w-12 bg-primary/50"></span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">
            Today's Gold Prices
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Live Dubai retail gold rates updated every 10 seconds. Prices shown per gram in AED.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
            <span className="text-sm text-gray-500">{isLive ? 'Live Prices' : 'Connecting...'}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-gray-800">Gold Rates</span>
                </div>
                <div className={`flex items-center gap-2 ${getTrendColor()}`}>
                  {getTrendIcon()}
                  <span className="text-sm font-medium">
                    {trend === 'up' ? 'Rising' : trend === 'down' ? 'Falling' : 'Stable'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="gold-rates-table">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-4 px-6 text-xs font-bold tracking-wider text-gray-500 uppercase">Purity</th>
                    <th className="text-left py-4 px-6 text-xs font-bold tracking-wider text-gray-500 uppercase">Fineness</th>
                    <th className="text-left py-4 px-6 text-xs font-bold tracking-wider text-gray-500 uppercase hidden sm:table-cell">Type</th>
                    <th className="text-right py-4 px-6 text-xs font-bold tracking-wider text-gray-500 uppercase">Price / Gram</th>
                  </tr>
                </thead>
                <tbody>
                  {purityData.map((item, index) => (
                    <motion.tr
                      key={item.key}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      data-testid={`rate-row-${item.key}`}
                    >
                      <td className="py-5 px-6">
                        <span className="font-serif text-xl font-semibold text-gray-900">{item.name}</span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                          {item.purity}
                        </span>
                      </td>
                      <td className="py-5 px-6 hidden sm:table-cell">
                        <span className="text-gray-500">{item.description}</span>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <motion.span
                          key={rates[item.key]}
                          initial={{ opacity: 0.5, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="font-mono text-xl font-bold text-gray-900"
                        >
                          {formatCurrency(rates[item.key])}
                        </motion.span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                <p>Prices are indicative and may vary at retail locations</p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  Updates every 10 seconds
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8"
        >
          {purityData.map((item) => (
            <div 
              key={item.key}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center"
              data-testid={`rate-card-${item.key}`}
            >
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{item.key}</div>
              <motion.div
                key={rates[item.key]}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                className="font-mono text-lg font-bold text-primary"
              >
                {formatCurrency(rates[item.key])}
              </motion.div>
              <div className="text-xs text-gray-400 mt-1">per gram</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
