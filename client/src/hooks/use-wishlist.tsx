import { createContext, useContext, ReactNode, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';

interface WishlistItem {
  id: number;
  userId: string;
  productId: string;
  createdAt: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  isLoading: boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery<WishlistItem[]>({
    queryKey: ['/api/wishlist'],
    queryFn: async () => {
      const res = await fetch('/api/wishlist', { credentials: 'include' });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId }),
      });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] }),
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] }),
  });

  const isInWishlist = useCallback((productId: string) => {
    return items.some(item => item.productId === productId);
  }, [items]);

  const toggleWishlist = useCallback((productId: string) => {
    if (!user) return;
    if (isInWishlist(productId)) {
      removeMutation.mutate(productId);
    } else {
      addMutation.mutate(productId);
    }
  }, [user, isInWishlist, addMutation, removeMutation]);

  return (
    <WishlistContext.Provider value={{ items, isInWishlist, toggleWishlist, isLoading, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    return {
      items: [] as WishlistItem[],
      isInWishlist: () => false,
      toggleWishlist: () => {},
      isLoading: false,
      count: 0,
    };
  }
  return context;
}
