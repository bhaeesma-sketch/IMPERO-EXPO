import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { PRODUCTS as STATIC_PRODUCTS } from "@/lib/products";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ShieldCheck, MapPin, RotateCcw, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StaggerContainer, StaggerItem, Reveal } from "@/components/ui/reveal";
import { Separator } from "@/components/ui/separator";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id;
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb / Back Link */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="pl-0 hover:bg-transparent text-gray-500 hover:text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Catalog
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left Column: Image Gallery */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-[4/5] bg-white rounded-sm overflow-hidden shadow-sm border border-gray-100 flex items-center justify-center p-8"
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
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </AnimatePresence>

                {/* Magnifier Hint */}
                <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-wider rounded-full text-gray-500">
                  Hover to Zoom
                </div>
              </motion.div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 aspect-square rounded-sm overflow-hidden border-2 transition-all ${activeImageIndex === idx ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover object-center" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Details */}
            <div className="space-y-8">
              <Reveal>
                <div className="space-y-2">
                  <h1 className="font-serif text-4xl md:text-5xl text-gray-900 leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-sm text-gray-400 font-medium tracking-wider uppercase">
                    {product.productCode}
                  </p>
                </div>
              </Reveal>

              {/* Manufacturer & Availability */}
              <Reveal delay={0.1}>
                <div className="flex flex-col sm:flex-row gap-6 text-sm py-4 border-y border-gray-100">
                  <div>
                    <span className="text-gray-500 block mb-1">Manufacturer</span>
                    <span className="font-medium text-gray-900">{product.manufacturer}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Availability</span>
                    <span className={`font-medium flex items-center gap-2 ${product.availability === 'In Stock' ? 'text-green-600' : 'text-amber-600'
                      }`}>
                      {product.availability === 'In Stock' && <Check className="w-4 h-4" />}
                      {product.availability}
                    </span>
                  </div>
                </div>
              </Reveal>

              {/* Overview */}
              <Reveal delay={0.2}>
                <div className="space-y-4">
                  <h3 className="font-serif text-xl text-gray-900">Overview</h3>
                  <p className="text-gray-600 leading-relaxed font-light">
                    {product.description}
                  </p>
                  <p className="text-gray-600 leading-relaxed font-light">
                    Investing in {product.purity} {product.purity === 'Silver' ? 'bullion' : 'gold'} from {product.manufacturer} is a secure way to preserve wealth.
                    Each piece is certified for authenticity and purity, ensuring you receive only the finest quality precious metals.
                  </p>
                </div>
              </Reveal>

              {/* Specifications Table */}
              <Reveal delay={0.3}>
                <div className="space-y-4 pt-4">
                  <h3 className="font-serif text-xl text-gray-900">Metal Information</h3>
                  <div className="bg-gray-50 rounded-sm p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200/60 last:border-0 last:pb-0">
                      <span className="text-gray-500 text-sm">{product.purity === 'Silver' ? 'Metal' : 'Gold'} Purity</span>
                      <span className="text-gray-900 font-medium text-sm text-right">{product.purity}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200/60 last:border-0 last:pb-0">
                      <span className="text-gray-500 text-sm">Certification</span>
                      <span className="text-gray-900 font-medium text-sm text-right">Hallmarked {product.purity.replace('K', '')}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200/60 last:border-0 last:pb-0">
                      <span className="text-gray-500 text-sm">Metal Color</span>
                      <span className="text-gray-900 font-medium text-sm text-right">
                        {product.purity === 'Silver' ? 'Silver' : 'Yellow Gold'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200/60 last:border-0 last:pb-0">
                      <span className="text-gray-500 text-sm">Weight</span>
                      <span className="text-gray-900 font-medium text-sm text-right">
                        {product.displayWeight || `${product.baseWeight} g`}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Actions - No Price, No Cart, Just Enquiry */}
              <Reveal delay={0.4}>
                <div className="pt-8">
                  <a
                    href={`https://wa.me/971506485898?text=${encodeURIComponent(
                      `Hello Impero Di Gold,\n\nI am interested in the following product:\n\n*${product.name}*\nProduct Code: ${product.productCode}\nPurity: ${product.purity}\nWeight: ${product.displayWeight || product.baseWeight + 'g'}\n\nCould you please provide:\n- Current availability\n- Price details\n- Any ongoing offers\n\nThank you!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full sm:w-auto h-14 px-8 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-sm font-medium tracking-wide flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl transition-all">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Enquire via WhatsApp
                    </Button>
                  </a>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 border-t border-gray-100 mt-20">
            {[
              { icon: ShieldCheck, title: "100% Certified Authenticity", desc: "Every product comes with a certificate of purity." },
              { icon: MapPin, title: "Visit Showroom", desc: "Gold Souq, Deira - Experience luxury in person." },
              { icon: RotateCcw, title: "Lifetime Exchange", desc: "Exchange your jewelry at prevailing market rates." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <item.icon className="w-8 h-8 text-primary shrink-0" strokeWidth={1} />
                <div>
                  <h4 className="font-serif text-lg text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
