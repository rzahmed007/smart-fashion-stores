import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, ColorVariant, OrderSummary, Product, ProductSize } from '@/types';

interface CartState {
  items: CartItem[];
  buyNowItem: CartItem | null;
  lastOrder: OrderSummary | null;
  recentlyViewedIds: string[];
  addItem: (
    product: Product,
    selectedColor: ColorVariant,
    selectedSize: ProductSize,
    quantity?: number
  ) => void;
  setBuyNowItem: (
    product: Product,
    selectedColor: ColorVariant,
    selectedSize: ProductSize,
    quantity?: number
  ) => void;
  clearBuyNowItem: () => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateVariant: (
    itemId: string,
    newColor: ColorVariant,
    newSize: ProductSize,
    maxStock?: number
  ) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  setLastOrder: (order: OrderSummary) => void;
  addRecentlyViewed: (productId: string) => void;
}

function buildCartItem(
  product: Product,
  selectedColor: ColorVariant,
  selectedSize: ProductSize,
  quantity: number
): CartItem {
  return {
    id: `${product.id}__${selectedColor.name}__${selectedSize}`,
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: selectedColor.image || product.images[0],
    price: product.price,
    originalPrice: product.originalPrice,
    selectedColor,
    selectedSize,
    quantity,
    fabric: product.fabric,
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      buyNowItem: null,
      lastOrder: null,
      recentlyViewedIds: [],
      addItem: (product, selectedColor, selectedSize, quantity = 1) => {
        const sizeInfo = product.sizes.find((s) => s.size === selectedSize);
        const maxStock = sizeInfo?.stockCount ?? 10;
        const itemId = `${product.id}__${selectedColor.name}__${selectedSize}`;

        set((state) => {
          const existing = state.items.find((i) => i.id === itemId);
          if (existing) {
            const nextQty = Math.min(maxStock, existing.quantity + quantity);
            return {
              items: state.items.map((i) =>
                i.id === itemId ? { ...i, quantity: nextQty } : i
              ),
            };
          }
          const clampedQty = Math.min(maxStock, Math.max(1, quantity));
          const newItem = buildCartItem(product, selectedColor, selectedSize, clampedQty);
          return { items: [...state.items, newItem] };
        });
      },
      setBuyNowItem: (product, selectedColor, selectedSize, quantity = 1) => {
        const sizeInfo = product.sizes.find((s) => s.size === selectedSize);
        const maxStock = sizeInfo?.stockCount ?? 10;
        const clampedQty = Math.min(maxStock, Math.max(1, quantity));
        set({
          buyNowItem: buildCartItem(product, selectedColor, selectedSize, clampedQty),
        });
      },
      clearBuyNowItem: () => set({ buyNowItem: null }),
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          set((state) => ({
            items: state.items.filter((i) => i.id !== itemId),
          }));
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
        }));
      },
      updateVariant: (itemId, newColor, newSize, maxStock = 10) => {
        set((state) => {
          const target = state.items.find((i) => i.id === itemId);
          if (!target) return state;

          const nextId = `${target.productId}__${newColor.name}__${newSize}`;
          const nextImage = newColor.image || target.image;
          const remaining = state.items.filter((i) => i.id !== itemId);
          const duplicate = remaining.find((i) => i.id === nextId);

          if (duplicate) {
            return {
              items: remaining.map((i) =>
                i.id === nextId
                  ? {
                      ...i,
                      quantity: Math.min(maxStock, i.quantity + target.quantity),
                    }
                  : i
              ),
            };
          }

          return {
            items: state.items.map((i) =>
              i.id === itemId
                ? {
                    ...i,
                    id: nextId,
                    image: nextImage,
                    selectedColor: newColor,
                    selectedSize: newSize,
                    quantity: Math.min(maxStock, i.quantity),
                  }
                : i
            ),
          };
        });
      },
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        }));
      },
      clearCart: () => set({ items: [] }),
      setLastOrder: (order) => set({ lastOrder: order }),
      addRecentlyViewed: (productId) => {
        set((state) => {
          const next = [
            productId,
            ...state.recentlyViewedIds.filter((id) => id !== productId),
          ].slice(0, 8);
          return { recentlyViewedIds: next };
        });
      },
    }),
    {
      name: 'sfs-cart-storage',
    }
  )
);
