import { Header } from '@/components/layout/header';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { StaggerContainer, StaggerItem, Reveal } from '@/components/ui/reveal';
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PRODUCTS as STATIC_PRODUCTS, Product } from '@/lib/products';
import { Search, Filter, ArrowUpDown, X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveGoldRate, MetalType } from '@/lib/gold-price';

type SortOption = 'name-asc' | 'name-desc' | 'weight-asc' | 'weight-desc' | 'price-asc' | 'price-desc';

const PURITY_OPTIONS: MetalType[] = ['18K', '21K', '22K', '24K', 'Silver'];
const AVAILABILITY_OPTIONS: Array<'In Stock' | 'Out of Stock' | 'Made to Order'> = ['In Stock', 'Out of Stock', 'Made to Order'];

export default function CatalogPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get('category') || 'all';

    const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
    const [sortBy, setSortBy] = useState<SortOption>('name-asc');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPurities, setSelectedPurities] = useState<MetalType[]>([]);
    const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
    const [minWeight, setMinWeight] = useState('');
    const [maxWeight, setMaxWeight] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        purity: true,
        weight: true,
        availability: true,
        price: true,
    });

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

    const calculatePrice = (product: Product) => {
        const pricePerGram = goldPrices[product.purity] || 0;
        return (product.baseWeight * pricePerGram) + product.makingCharge;
    };

    const togglePurity = (purity: MetalType) => {
        setSelectedPurities(prev =>
            prev.includes(purity) ? prev.filter(p => p !== purity) : [...prev, purity]
        );
    };

    const toggleAvailability = (availability: string) => {
        setSelectedAvailability(prev =>
            prev.includes(availability) ? prev.filter(a => a !== availability) : [...prev, availability]
        );
    };

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedPurities([]);
        setSelectedAvailability([]);
        setMinWeight('');
        setMaxWeight('');
        setMinPrice('');
        setMaxPrice('');
    };

    const hasActiveFilters = searchQuery || selectedPurities.length > 0 || selectedAvailability.length > 0 || minWeight || maxWeight || minPrice || maxPrice;

    const filteredProducts = useMemo(() => {
        let products = activeCategory === 'all'
            ? allProducts
            : allProducts.filter(p => p.category === activeCategory);

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            products = products.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.productCode.toLowerCase().includes(q)
            );
        }

        if (selectedPurities.length > 0) {
            products = products.filter(p => selectedPurities.includes(p.purity));
        }

        if (selectedAvailability.length > 0) {
            products = products.filter(p => selectedAvailability.includes(p.availability));
        }

        if (minWeight) {
            products = products.filter(p => p.baseWeight >= parseFloat(minWeight));
        }
        if (maxWeight) {
            products = products.filter(p => p.baseWeight <= parseFloat(maxWeight));
        }

        if (minPrice) {
            products = products.filter(p => calculatePrice(p) >= parseFloat(minPrice));
        }
        if (maxPrice) {
            products = products.filter(p => calculatePrice(p) <= parseFloat(maxPrice));
        }

        return products;
    }, [allProducts, activeCategory, searchQuery, selectedPurities, selectedAvailability, minWeight, maxWeight, minPrice, maxPrice, goldPrices]);

    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            switch (sortBy) {
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'name-desc': return b.name.localeCompare(a.name);
                case 'weight-asc': return a.baseWeight - b.baseWeight;
                case 'weight-desc': return b.baseWeight - a.baseWeight;
                case 'price-asc': return calculatePrice(a) - calculatePrice(b);
                case 'price-desc': return calculatePrice(b) - calculatePrice(a);
                default: return 0;
            }
        });
    }, [filteredProducts, sortBy, goldPrices]);

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

    const FilterSectionHeader = ({ title, section }: { title: string; section: string }) => (
        <button
            onClick={() => toggleSection(section)}
            className="flex items-center justify-between w-full py-2 text-sm font-serif font-medium text-gray-900 tracking-wide"
        >
            {title}
            {expandedSections[section] ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
        </button>
    );

    const filterContent = (
        <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
                <FilterSectionHeader title="Purity" section="purity" />
                {expandedSections.purity && (
                    <div className="space-y-2 mt-2">
                        {PURITY_OPTIONS.map(purity => (
                            <label key={purity} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                    selectedPurities.includes(purity)
                                        ? 'bg-primary border-primary'
                                        : 'border-gray-300 group-hover:border-primary/50'
                                }`}>
                                    {selectedPurities.includes(purity) && (
                                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={selectedPurities.includes(purity)}
                                    onChange={() => togglePurity(purity)}
                                />
                                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                    {purity === 'Silver' ? '999.9 Fine Silver' : `${purity} Gold`}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <div className="border-b border-gray-100 pb-4">
                <FilterSectionHeader title="Weight (grams)" section="weight" />
                {expandedSections.weight && (
                    <div className="flex gap-3 mt-2">
                        <div className="flex-1">
                            <input
                                type="number"
                                placeholder="Min"
                                value={minWeight}
                                onChange={(e) => setMinWeight(e.target.value)}
                                className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                min="0"
                            />
                        </div>
                        <span className="text-gray-300 self-center">—</span>
                        <div className="flex-1">
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxWeight}
                                onChange={(e) => setMaxWeight(e.target.value)}
                                className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                min="0"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="border-b border-gray-100 pb-4">
                <FilterSectionHeader title="Availability" section="availability" />
                {expandedSections.availability && (
                    <div className="space-y-2 mt-2">
                        {AVAILABILITY_OPTIONS.map(status => (
                            <label key={status} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                    selectedAvailability.includes(status)
                                        ? 'bg-primary border-primary'
                                        : 'border-gray-300 group-hover:border-primary/50'
                                }`}>
                                    {selectedAvailability.includes(status) && (
                                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={selectedAvailability.includes(status)}
                                    onChange={() => toggleAvailability(status)}
                                />
                                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{status}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <div className="pb-2">
                <FilterSectionHeader title="Price Range (AED)" section="price" />
                {expandedSections.price && (
                    <div className="flex gap-3 mt-2">
                        <div className="flex-1">
                            <input
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                min="0"
                            />
                        </div>
                        <span className="text-gray-300 self-center">—</span>
                        <div className="flex-1">
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                                min="0"
                            />
                        </div>
                    </div>
                )}
            </div>

            {hasActiveFilters && (
                <button
                    onClick={clearAllFilters}
                    className="w-full text-sm text-primary hover:text-primary/80 font-medium py-2 transition-colors"
                >
                    Clear All Filters
                </button>
            )}
        </div>
    );

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

                    <Reveal delay={0.15}>
                        <div className="max-w-xl mx-auto mb-8">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, description, or product code..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 shadow-sm transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
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
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 font-light">Showing {sortedProducts.length} items</span>
                            {hasActiveFilters && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                    Filtered
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setFiltersOpen(!filtersOpen)}
                                className="lg:hidden flex items-center gap-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md px-4 py-2 hover:bg-gray-50 transition-colors"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Filters
                                {hasActiveFilters && (
                                    <span className="w-2 h-2 rounded-full bg-primary" />
                                )}
                            </button>

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

                    <div className="flex gap-8">
                        <aside className="hidden lg:block w-64 flex-shrink-0">
                            <div className="sticky top-28">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-serif text-lg text-gray-900">Filters</h3>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                                        >
                                            Clear all
                                        </button>
                                    )}
                                </div>
                                {filterContent}
                            </div>
                        </aside>

                        <AnimatePresence>
                            {filtersOpen && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                                        onClick={() => setFiltersOpen(false)}
                                    />
                                    <motion.div
                                        initial={{ x: '-100%' }}
                                        animate={{ x: 0 }}
                                        exit={{ x: '-100%' }}
                                        transition={{ type: 'tween', duration: 0.3 }}
                                        className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden shadow-2xl overflow-y-auto"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="font-serif text-xl text-gray-900">Filters</h3>
                                                <button
                                                    onClick={() => setFiltersOpen(false)}
                                                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                            {filterContent}
                                            <div className="mt-6 pt-4 border-t border-gray-100">
                                                <button
                                                    onClick={() => setFiltersOpen(false)}
                                                    className="w-full bg-primary text-white py-3 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                                                >
                                                    Show {sortedProducts.length} Results
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>

                        <div className="flex-1 min-w-0">
                            {sortedProducts.length > 0 ? (
                                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                    <SlidersHorizontal className="w-10 h-10 mx-auto mb-4 text-gray-300" />
                                    <p className="font-serif text-lg text-gray-500 mb-2">No products found</p>
                                    <p className="text-sm">Try adjusting your filters or search terms.</p>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="mt-4 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                                        >
                                            Clear all filters
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
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
