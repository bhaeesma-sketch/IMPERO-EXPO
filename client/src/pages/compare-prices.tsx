import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { LiveTicker } from '@/components/ui/live-ticker';
import { useLiveGoldRate, formatCurrency, MetalType } from '@/lib/gold-price';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PRODUCTS as STATIC_PRODUCTS, Product } from '@/lib/products';

type PriceHistory = {
  id: string;
  timestamp: string;
  price24k: number;
  price22k: number;
  price21k: number;
  price18k: number;
};

const PURITY_COLORS: Record<string, string> = {
  '24K': '#D4AF37',
  '22K': '#C5A028',
  '21K': '#B8941D',
  '18K': '#9A7B0A',
};

export default function ComparePrices() {
  const [selectedDays, setSelectedDays] = useState(7);
  const [selectedPurities, setSelectedPurities] = useState<MetalType[]>(['24K', '22K']);
  const { rates, trend, isLive } = useLiveGoldRate();

  const { data: dbProducts = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      if (!res.ok) return [];
      return res.json();
    },
  });

  const PRODUCTS: Product[] = dbProducts.length > 0 ? dbProducts : STATIC_PRODUCTS;

  const { data: priceHistory = [], isLoading } = useQuery<PriceHistory[]>({
    queryKey: ['/api/gold-prices/history', selectedDays],
    queryFn: async () => {
      const res = await fetch(`/api/gold-prices/history?days=${selectedDays}`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  useEffect(() => {
    if (isLive && rates['24K'] > 0) {
      fetch('/api/gold-prices/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price24k: rates['24K'],
          price22k: rates['22K'],
          price21k: rates['21K'],
          price18k: rates['18K'],
        }),
      }).catch(console.error);
    }
  }, [isLive, rates['24K']]);

  const chartData = priceHistory.map(item => ({
    time: new Date(item.timestamp).toLocaleString('en-AE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    '24K': item.price24k,
    '22K': item.price22k,
    '21K': item.price21k,
    '18K': item.price18k,
  })).reverse();

  const togglePurity = (purity: MetalType) => {
    if (selectedPurities.includes(purity)) {
      if (selectedPurities.length > 1) {
        setSelectedPurities(selectedPurities.filter(p => p !== purity));
      }
    } else {
      setSelectedPurities([...selectedPurities, purity]);
    }
  };

  const bullionProducts = PRODUCTS.filter(p => p.type === 'bullion');
  const jewelryProducts = PRODUCTS.filter(p => p.type === 'jewelry');

  return (
    <div className="min-h-screen bg-background">
      <LiveTicker />
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-12 bg-primary/50"></span>
              <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">Price Analysis</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">Compare Gold Prices</h1>
            <p className="text-gray-500 max-w-2xl">
              Track historical gold price trends and compare different purity levels to make informed decisions.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6 mb-12">
            {(['24K', '22K', '21K', '18K'] as MetalType[]).map((purity, index) => (
              <motion.div
                key={purity}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl p-6 border shadow-sm cursor-pointer transition-all ${selectedPurities.includes(purity)
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-gray-100 hover:border-gray-200'
                  }`}
                onClick={() => togglePurity(purity)}
                data-testid={`purity-card-${purity}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Gold {purity}</span>
                  <div className={`w-4 h-4 rounded-full ${selectedPurities.includes(purity) ? 'bg-primary' : 'bg-gray-200'}`} />
                </div>
                <div className="font-mono text-2xl font-bold text-gray-900 mb-2">
                  {formatCurrency(rates[purity])}
                </div>
                <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
                  {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : trend === 'down' ? <ArrowDownRight className="w-4 h-4" /> : null}
                  <span>per gram</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 mb-12"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-serif text-2xl text-gray-900 mb-1">Price History</h2>
                <p className="text-sm text-gray-500">Gold price trends over time</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                {[1, 7, 14, 30].map(days => (
                  <Button
                    key={days}
                    variant={selectedDays === days ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDays(days)}
                    data-testid={`days-${days}`}
                  >
                    {days === 1 ? '24h' : `${days}D`}
                  </Button>
                ))}
              </div>
            </div>

            <div className="h-80" data-testid="price-chart">
              {isLoading ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Loading price data...
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 12 }}
                      stroke="#9ca3af"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      stroke="#9ca3af"
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), '']}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Legend />
                    {selectedPurities.map(purity => (
                      <Line
                        key={purity}
                        type="monotone"
                        dataKey={purity}
                        stroke={PURITY_COLORS[purity]}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <TrendingUp className="w-12 h-12 mb-4 opacity-50" />
                  <p>No historical data yet</p>
                  <p className="text-sm">Prices are being recorded automatically</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="font-serif text-3xl text-gray-900 mb-8">Compare Products</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Investment Bullion</h3>
                  <p className="text-sm text-gray-500">Pure gold bars for wealth preservation</p>
                </div>
                <div className="divide-y divide-gray-50">
                  {bullionProducts.slice(0, 4).map((product) => (
                    <div key={product.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors" data-testid={`compare-product-${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover object-center rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-500">{product.purity} • {product.displayWeight || `${product.baseWeight}g`}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400 uppercase">Inquire</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Fine Jewelry</h3>
                  <p className="text-sm text-gray-500">Exquisite craftsmanship in gold</p>
                </div>
                <div className="divide-y divide-gray-50">
                  {jewelryProducts.slice(0, 4).map((product) => (
                    <div key={product.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors" data-testid={`compare-product-${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover object-center rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-500">{product.purity} • {product.displayWeight || `${product.baseWeight}g`}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400 uppercase">Inquire</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white"
          >
            <div className="max-w-2xl">
              <h3 className="font-serif text-2xl mb-3">Need Expert Advice?</h3>
              <p className="text-gray-300 mb-6">
                Our specialists can help you choose the right gold investment based on current market conditions and your goals.
              </p>
              <Button
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => window.open('https://wa.me/971501234567?text=Hi, I would like expert advice on gold prices', '_blank')}
                data-testid="whatsapp-cta"
              >
                Chat with an Expert
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
