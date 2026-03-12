import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { PRODUCTS as STATIC_PRODUCTS, Product } from "@/lib/products";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ShieldCheck, MapPin, RotateCcw, Loader2, Image as ImageIcon, Box, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { Product3DViewer } from "@/components/product/Product3DViewer";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'image' | '3d'>('image');

  const { data: dbProduct, isLoading } = useQuery({
    queryKey: ['/api/products', productId],
    queryFn: async () => {
      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!productId,
  });

  const staticProduct = STATIC_PRODUCTS.find((p) => p.id === productId);
  const product = dbProduct || staticProduct;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-serif mb-4">Product Not Found</h1>
        <Link href="/">
          <Button variant="outline">Return Home</Button>
        </Link>
      </div>
    );
  }

  const images = product.images || [product.image];
  const isJewelry = product.type === 'jewelry';

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link href="/catalog">
              <Button variant="ghost" className="pl-0 hover:bg-transparent text-gray-500 hover:text-primary gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Catalog
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column: Image Gallery + 3D Toggle */}
            <div className="space-y-4">
              {/* View Mode Tabs (only for jewelry) */}
              {isJewelry && (
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => setViewMode('image')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all ${viewMode === 'image'
                        ? 'bg-gray-900 text-white shadow-md'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Gallery
                  </button>
                  <button
                    onClick={() => setViewMode('3d')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all ${viewMode === '3d'
                        ? 'bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-white shadow-md'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                  >
                    <Box className="w-3.5 h-3.5" /> 3D View
                  </button>
                </div>
              )}

              {/* Main Viewer */}
              <AnimatePresence mode="wait">
                {viewMode === '3d' && isJewelry ? (
                  <motion.div
                    key="3d-viewer"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Product3DViewer product={product as Product} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="image-viewer"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="relative aspect-[4/5] bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex items-center justify-center p-8 group"
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeImageIndex}
                        src={images[activeImageIndex]}
                        alt={product.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full object-contain"
                      />
                    </AnimatePresence>

                    {/* Corner Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/80 text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-medium">
                        {product.purity === 'Silver' ? '999.9 Silver' : `${product.purity} Gold`}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Thumbnails (only in image mode) */}
              {viewMode === 'image' && images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 aspect-square rounded-lg overflow-hidden border-2 transition-all shrink-0 ${activeImageIndex === idx ? "border-primary shadow-md" : "border-transparent opacity-50 hover:opacity-100"
                        }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Details */}
            <div className="space-y-8 lg:pt-4">
              <Reveal>
                <div className="space-y-3">
                  <p className="text-xs text-gray-400 font-medium tracking-[0.2em] uppercase">
                    {product.productCode}
                  </p>
                  <h1 className="font-serif text-4xl md:text-5xl text-gray-900 leading-[1.1]">
                    {product.name}
                  </h1>
                </div>
              </Reveal>

              {/* Manufacturer & Availability */}
              <Reveal delay={0.1}>
                <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm py-5 border-y border-gray-100">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase tracking-wider mb-1">Manufacturer</span>
                    <span className="font-medium text-gray-900">{product.manufacturer}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase tracking-wider mb-1">Availability</span>
                    <span className={`font-medium flex items-center gap-1.5 ${product.availability === 'In Stock' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                      {product.availability === 'In Stock' && <Check className="w-3.5 h-3.5" />}
                      {product.availability}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase tracking-wider mb-1">Weight</span>
                    <span className="font-medium text-gray-900">
                      {product.displayWeight || `${product.baseWeight} g`}
                    </span>
                  </div>
                </div>
              </Reveal>

              {/* Overview */}
              <Reveal delay={0.2}>
                <div className="space-y-3">
                  <h3 className="font-serif text-lg text-gray-900">About This Piece</h3>
                  <p className="text-gray-500 leading-relaxed text-[15px]">
                    {product.description}
                  </p>
                </div>
              </Reveal>

              {/* Specifications */}
              <Reveal delay={0.3}>
                <div className="space-y-4">
                  <h3 className="font-serif text-lg text-gray-900">Specifications</h3>
                  <div className="rounded-xl overflow-hidden border border-gray-100">
                    {[
                      { label: `${product.purity === 'Silver' ? 'Metal' : 'Gold'} Purity`, value: product.purity },
                      { label: 'Certification', value: `Hallmarked ${product.purity.replace('K', '')}` },
                      { label: 'Metal Color', value: product.purity === 'Silver' ? 'Sterling Silver' : 'Yellow Gold' },
                      { label: 'Net Weight', value: product.displayWeight || `${product.baseWeight} g` },
                    ].map((spec, i) => (
                      <div key={i} className={`flex justify-between items-center px-5 py-3.5 text-sm ${i % 2 === 0 ? 'bg-gray-50/80' : 'bg-white'
                        }`}>
                        <span className="text-gray-500">{spec.label}</span>
                        <span className="text-gray-900 font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* CTA */}
              <Reveal delay={0.4}>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <a
                    href={`https://wa.me/971506485898?text=${encodeURIComponent(
                      `Hello Impero Di Gold,\n\nI am interested in:\n\n*${product.name}*\nCode: ${product.productCode}\nPurity: ${product.purity}\nWeight: ${product.displayWeight || product.baseWeight + 'g'}\n\nPlease share availability and price.\n\nThank you!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-medium tracking-wide flex items-center justify-center gap-3 text-base shadow-lg hover:shadow-xl transition-all">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Enquire via WhatsApp
                    </Button>
                  </a>

                  {isJewelry && (
                    <Link href="/try-on">
                      <Button variant="outline" className="h-14 px-6 rounded-xl border-primary/30 text-primary hover:bg-primary/5 gap-2 font-medium">
                        <Sparkles className="w-4 h-4" /> Virtual Try-On
                      </Button>
                    </Link>
                  )}
                </div>
              </Reveal>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 border-t border-gray-100 mt-20">
            {[
              { icon: ShieldCheck, title: "Certified Authenticity", desc: "Every product comes with a certificate of purity and hallmarking." },
              { icon: MapPin, title: "Visit Our Showroom", desc: "Gold Souq, Deira — Experience luxury in person." },
              { icon: RotateCcw, title: "Lifetime Exchange", desc: "Exchange your gold at prevailing market rates, anytime." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex gap-4 items-start p-5 rounded-xl bg-gray-50/50 border border-gray-100/80"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-serif text-base text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
