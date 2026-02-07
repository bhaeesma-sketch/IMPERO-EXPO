import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { MetalType } from '@/lib/gold-price';

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  purity: MetalType;
  baseWeight: number; // default weight to show
  displayWeight?: string; // Optional custom display (e.g. "10 Tola")
  customWeights?: number[]; // Optional custom weight options
  makingCharge: number; // AED per gram
  type: 'bullion' | 'jewelry';
}

export function ProductCard({ id, name, image, purity, baseWeight, displayWeight, customWeights, makingCharge, type }: ProductCardProps) {
  const [weight, setWeight] = useState(baseWeight);
  const [isHovered, setIsHovered] = useState(false);

  // Available weight options for bullion
  const weights = customWeights || (type === 'bullion' ? [1, 5, 10, 20, 50, 100] : [baseWeight]);

  return (
    <Link href={`/product/${id}`}>
      <motion.div
        className="group relative bg-transparent rounded-xl overflow-hidden cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Ghost Card Background (appears on hover) */}
        <div className="absolute inset-0 bg-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10" />

        {/* Image Container */}
        <div className="relative aspect-[4/5] p-6 flex items-center justify-center overflow-hidden bg-white rounded-xl group-hover:bg-transparent transition-colors duration-300">
          <motion.img
            src={image}
            alt={name}
            className="w-full h-full object-contain mix-blend-normal transition-all duration-300"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
          />

          {/* Shimmer overlay */}
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 pointer-events-none" />

          {/* Quick Actions Overlay */}
          <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
            <Button className="w-full bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm text-xs h-9">
              View Details
            </Button>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-serif font-medium text-lg text-gray-900 leading-tight">{name}</h3>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                {purity === 'Silver' ? '999.9 Fine Silver' : `${purity} Gold`}
              </p>
            </div>
            {/* Price removed */}
          </div>

          {/* Weight Selector (Bullion Only) */}
          {type === 'bullion' && weights.length > 1 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {weights.slice(0, 4).map((w) => (
                <button
                  key={w}
                  onClick={(e) => {
                    e.preventDefault();
                    setWeight(w);
                  }}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${weight === w
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
                    }`}
                >
                  {w}g
                </button>
              ))}
            </div>
          )}

          {/* Display Weight (if no selector or fixed weight) */}
          {(type !== 'bullion' || weights.length === 1) && displayWeight && (
            <div className="pt-2">
              <span className="text-xs font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">{displayWeight}</span>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
