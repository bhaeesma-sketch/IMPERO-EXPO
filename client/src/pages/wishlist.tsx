import { Header } from '@/components/layout/header';
import { useWishlist } from '@/hooks/use-wishlist';
import { useAuth } from '@/hooks/use-auth';
import { PRODUCTS as STATIC_PRODUCTS, Product } from '@/lib/products';
import { useLiveGoldRate } from '@/lib/gold-price';
import { ProductCard } from '@/components/product/product-card';
import { motion } from 'framer-motion';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/reveal';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function WishlistPage() {
  const { user } = useAuth();
  const { items, toggleWishlist, isLoading } = useWishlist();
  const { rates } = useLiveGoldRate();

  const { data: dbProducts = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      if (!res.ok) return [];
      return res.json();
    },
  });

  const allProducts: Product[] = dbProducts.length > 0 ? dbProducts : STATIC_PRODUCTS;

  const wishlistProducts = items
    .map(item => allProducts.find(p => p.id === item.productId))
    .filter((p): p is Product => !!p);

  if (!user) {
    return (
      <div className="min-h-screen bg-white text-foreground font-sans">
        <Header />
        <div className="pt-40 pb-20 flex flex-col items-center justify-center text-center px-4">
          <Reveal>
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-8">
              <Heart className="w-10 h-10 text-gray-300" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-serif text-4xl text-gray-900 mb-4">Sign In to View Your Wishlist</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-gray-500 max-w-md mx-auto mb-8 font-light leading-relaxed">
              Create an account or sign in to save your favorite pieces and access them anytime.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <Link href="/auth">
              <Button className="bg-primary text-white hover:bg-primary/90 px-8 py-3 text-sm tracking-wide">
                Sign In
              </Button>
            </Link>
          </Reveal>
        </div>
      </div>
    );
  }

  if (!isLoading && wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-white text-foreground font-sans">
        <Header />
        <div className="pt-40 pb-20 flex flex-col items-center justify-center text-center px-4">
          <Reveal>
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-8">
              <Heart className="w-10 h-10 text-gray-300" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-serif text-4xl text-gray-900 mb-4">Your Wishlist is Empty</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-gray-500 max-w-md mx-auto mb-8 font-light leading-relaxed">
              Discover our exquisite collection and save your favorite pieces for later.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <Link href="/catalog">
              <Button className="bg-primary text-white hover:bg-primary/90 px-8 py-3 text-sm tracking-wide">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Explore the Collection
              </Button>
            </Link>
          </Reveal>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
      <Header />

      <div className="pt-32 pb-12 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <Reveal>
            <h1 className="font-serif text-5xl text-gray-900 mb-4">My Wishlist</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-gray-500 font-light">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
            </p>
          </Reveal>
        </div>
      </div>

      <section className="py-16 bg-white min-h-[50vh]">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistProducts.map((product) => (
              <StaggerItem key={product.id}>
                <div className="relative group">
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    image={product.image}
                    purity={product.purity}
                    baseWeight={product.baseWeight}
                    displayWeight={product.displayWeight}
                    customWeights={product.customWeights}
                    makingCharge={product.makingCharge}
                    type={product.type}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-100 py-12 text-center text-sm text-gray-500 font-light">
        <div className="container mx-auto px-4">
          <p>&copy; 2022 Impero Di Gold & Diamonds LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
