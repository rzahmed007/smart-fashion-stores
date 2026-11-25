import { create } from 'zustand';
import type { Product } from '@/types';

interface UIState {
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  quickShopProduct: Product | null;
  openCart: () => void;
  closeCart: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openQuickShop: (product: Product) => void;
  closeQuickShop: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  quickShopProduct: null,
  openCart: () => set({ isCartOpen: true, isMobileMenuOpen: false, isSearchOpen: false }),
  closeCart: () => set({ isCartOpen: false }),
  openMobileMenu: () => set({ isMobileMenuOpen: true, isCartOpen: false, isSearchOpen: false }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  openSearch: () => set({ isSearchOpen: true, isMobileMenuOpen: false, isCartOpen: false }),
  closeSearch: () => set({ isSearchOpen: false }),
  openQuickShop: (product) => set({ quickShopProduct: product }),
  closeQuickShop: () => set({ quickShopProduct: null }),
}));
