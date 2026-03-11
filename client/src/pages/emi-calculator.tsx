import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { useLiveGoldRate } from '@/lib/gold-price';
import { motion } from 'framer-motion';
import { Reveal } from '@/components/ui/reveal';
import { Calculator, TrendingDown, Info } from 'lucide-react';

const PURITIES = ['24K', '22K', '21K', '18K'] as const;
type Purity = typeof PURITIES[number];

const TENURES = [
  { months: 3, rate: 0, label: '3 Months' },
  { months: 6, rate: 5, label: '6 Months' },
  { months: 12, rate: 8, label: '12 Months' },
  { months: 24, rate: 12, label: '24 Months' },
];

export default function EMICalculatorPage() {
  const { rates } = useLiveGoldRate();
  const [purity, setPurity] = useState<Purity>('22K');
  const [weight, setWeight] = useState<number>(10);
  const [makingCharge, setMakingCharge] = useState<number>(50);

  const ratePerGram = rates[purity] || 0;
  const totalPrice = weight * ratePerGram + makingCharge;

  const emiBreakdown = TENURES.map(({ months, rate, label }) => {
    const interest = (totalPrice * rate) / 100;
    const totalPayable = totalPrice + interest;
    const monthly = totalPayable / months;
    return { months, rate, label, interest, totalPayable, monthly };
  });

  const maxTotal = Math.max(...emiBreakdown.map((e) => e.totalPayable), 1);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 2,
    }).format(n);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
      <Header />

      <div className="pt-32 pb-12 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <Reveal>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calculator className="w-8 h-8 text-primary" />
              <h1 className="font-serif text-5xl text-gray-900">EMI Calculator</h1>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-gray-500 max-w-xl mx-auto font-light">
              Plan your gold &amp; jewelry purchase with flexible installment options.
              Calculate your monthly payments instantly.
            </p>
          </Reveal>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2">
              <Reveal direction="left">
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                  <h2 className="font-serif text-2xl text-gray-900 mb-8">Configure</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-3">
                        Gold Purity
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {PURITIES.map((p) => (
                          <button
                            key={p}
                            onClick={() => setPurity(p)}
                            className={`py-3 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 ${
                              purity === p
                                ? 'bg-primary text-white shadow-lg'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary/40'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-gray-400">
                        Current rate: <span className="text-primary font-medium">{fmt(ratePerGram)}</span> / gram
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Weight (grams)
                      </label>
                      <input
                        type="number"
                        min={0.1}
                        step={0.1}
                        value={weight}
                        onChange={(e) => setWeight(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Making Charge (AED)
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={makingCharge}
                        onChange={(e) => setMakingCharge(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="mt-8 p-5 bg-white rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Total Price</p>
                    <p className="font-serif text-3xl text-gray-900">{fmt(totalPrice)}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {weight}g × {fmt(ratePerGram)} + {fmt(makingCharge)} making
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-3">
              <Reveal direction="right">
                <h2 className="font-serif text-2xl text-gray-900 mb-6">Installment Plans</h2>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {emiBreakdown.map((plan, i) => (
                  <Reveal key={plan.months} delay={0.1 * i}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className={`rounded-2xl p-6 border transition-all ${
                        plan.rate === 0
                          ? 'bg-primary/5 border-primary/20'
                          : 'bg-gray-50 border-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-serif text-lg text-gray-900">{plan.label}</span>
                        {plan.rate === 0 ? (
                          <span className="text-xs font-medium bg-primary text-white px-3 py-1 rounded-full">
                            0% Interest
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {plan.rate}% Interest
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Monthly Payment</p>
                      <p className="font-serif text-2xl text-gray-900 mb-4">
                        {fmt(plan.monthly)}
                      </p>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-500">
                          <span>Total Payable</span>
                          <span className="font-medium text-gray-700">{fmt(plan.totalPayable)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                          <span>Total Interest</span>
                          <span className={`font-medium ${plan.interest === 0 ? 'text-green-600' : 'text-gray-700'}`}>
                            {fmt(plan.interest)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={0.3}>
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingDown className="w-5 h-5 text-primary" />
                    <h3 className="font-serif text-lg text-gray-900">Tenure Comparison</h3>
                  </div>

                  <div className="space-y-4">
                    {emiBreakdown.map((plan) => (
                      <div key={plan.months}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600 font-medium">{plan.label}</span>
                          <span className="text-gray-500">{fmt(plan.totalPayable)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(plan.totalPayable / maxTotal) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className={`h-full rounded-full ${
                              plan.rate === 0 ? 'bg-primary' : 'bg-primary/60'
                            }`}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {fmt(plan.monthly)}/mo × {plan.months} months
                          {plan.interest > 0 && ` (incl. ${fmt(plan.interest)} interest)`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center space-y-6">
          <Reveal>
            <div className="flex items-start justify-center gap-2 max-w-2xl mx-auto">
              <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-400 font-light">
                This calculator provides an estimate only. Actual EMI and interest rates may vary based on the financing partner's terms and conditions.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <a
              href="https://wa.me/971506485898?text=I%20am%20interested%20in%20EMI%20options%20for%20gold%20jewelry."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-serif tracking-wide px-8 py-3 rounded-full transition-all shadow-lg hover:shadow-xl"
            >
              Inquire on WhatsApp
            </a>
          </Reveal>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-100 py-12 text-center text-sm text-gray-500 font-light">
        <div className="container mx-auto px-4">
          <p>&copy; 2022 Impero Di Gold &amp; Diamonds LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
