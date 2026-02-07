import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { VirtualTryOn } from '@/components/virtual-tryon/VirtualTryOn';
import { Header } from '@/components/layout/header';
import { Product, PRODUCTS as STATIC_PRODUCTS } from '@/lib/products';
import { Loader2 } from 'lucide-react';

export default function TryOnPage() {
    const { data: dbProducts = [], isLoading } = useQuery<Product[]>({
        queryKey: ['/api/products'],
        queryFn: async () => {
            const res = await fetch('/api/products');
            if (!res.ok) return [];
            return res.json();
        },
    });

    const products = dbProducts.length > 0 ? dbProducts : STATIC_PRODUCTS;
    const jewelryProducts = products.filter(p => p.type === 'jewelry');

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (jewelryProducts.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="font-serif text-4xl mb-4">No Jewelry Available</h1>
                    <p className="text-gray-500">Please add jewelry products to try on.</p>
                </div>
            </div>
        );
    }

    return <VirtualTryOn products={jewelryProducts} />;
}
