import { Header } from '@/components/layout/header';
import { ProductCard } from '@/components/product/product-card'; // Assuming this exists as per home.tsx
import { Button } from '@/components/ui/button';
import { StaggerContainer, StaggerItem, Reveal } from '@/components/ui/reveal';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PRODUCTS as STATIC_PRODUCTS, Product } from '@/lib/products';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLiveGoldRate } from '@/lib/gold-price';

type SortOption = 'name-asc' | 'name-desc' | 'weight-asc' | 'weight-desc' | 'price-asc' | 'price-desc';

export default function CatalogPage() {
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<SortOption>('name-asc');
    const { rates: goldPrices } = useLiveGoldRate();

    const { data: dbProducts = [] } = useQuery<Product[]>({
        queryKey: ['/api/products'],
        queryFn: async () => {
            const res = await fetch('/api/products');
            if (!res.ok) return [];
            return res.json();
        },
    });

    const allProducts: Product[] = dbProducts.length > 0 ? dbProducts : STATIC_PRODUCTS;

    // Calculate price for sorting
    const calculatePrice = (product: Product) => {
        const pricePerGram = goldPrices[product.purity] || 0;
        return (product.baseWeight * pricePerGram) + product.makingCharge;
    };

    const filteredProducts = activeCategory === 'all'
        ? allProducts
        : allProducts.filter(p => p.category === activeCategory);

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'weight-asc':
                return a.baseWeight - b.baseWeight;
            case 'weight-desc':
                return b.baseWeight - a.baseWeight;
            case 'price-asc':
                return calculatePrice(a) - calculatePrice(b);
            case 'price-desc':
                return calculatePrice(b) - calculatePrice(a);
            default:
                return 0;
        }
    });

    const categories = [
        { id: 'all', label: 'All Products' },
        { id: 'coins', label: 'Gold Coins' },
        { id: 'bars', label: 'Gold Bars' },
        { id: 'silver', label: 'Silver' },
        { id: 'jewelry', label: 'Fine Jewelry' },
    ];

    const sortOptions = [
        { value: 'name-asc', label: 'Name (A-Z)' },
        { value: 'name-desc', label: 'Name (Z-A)' },
        { value: 'weight-asc', label: 'Weight (Low to High)' },
        { value: 'weight-desc', label: 'Weight (High to Low)' },
        { value: 'price-asc', label: 'Price (Low to High)' },
        { value: 'price-desc', label: 'Price (High to Low)' },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
            <Header />

            <div className="pt-32 pb-12 bg-gray-50 border-b border-gray-100">
                <div className="container mx-auto px-4 text-center">
                    <Reveal>
                        <h1 className="font-serif text-5xl text-gray-900 mb-6">The Collection</h1>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <p className="text-gray-500 max-w-xl mx-auto mb-8 font-light">
                            Explore our curated selection of investment-grade bullion and exquisite jewelry pieces.
                        </p>
                    </Reveal>

                    <Reveal delay={0.2}>
                        <div className="flex flex-wrap justify-center gap-4">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`px-6 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${activeCategory === cat.id
                                        ? 'bg-primary text-white shadow-lg transform -translate-y-1'
                                        : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </div>

            <section className="py-16 bg-white min-h-[50vh]">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <span className="text-sm text-gray-500 font-light">Showing {sortedProducts.length} items</span>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    className="text-sm text-gray-700 bg-white border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {sortedProducts.length > 0 ? (
                        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {sortedProducts.map((product) => (
                                <StaggerItem key={product.id}>
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
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    ) : (
                        <div className="text-center py-20 text-gray-400">
                            <p>No products found in this category.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer (Simplified) */}
            <footer className="bg-white border-t border-gray-100 py-12 text-center text-sm text-gray-500 font-light">
                <div className="container mx-auto px-4">
                    <p>&copy; 2022 Impero Di Gold & Diamonds LLC. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
