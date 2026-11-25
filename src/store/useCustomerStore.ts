import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DEMO_CUSTOMER_PROFILE,
  DEMO_ORDERS,
  DEMO_SAVED_ADDRESSES,
} from '@/data/customer';
import type { CustomerProfile, OrderSummary, SavedAddress } from '@/types';

interface CustomerState {
  isAuthenticated: boolean;
  rememberMe: boolean;
  profile: CustomerProfile;
  addresses: SavedAddress[];
  orders: OrderSummary[];
  loginDemoSession: (overrides?: Partial<CustomerProfile>, rememberMe?: boolean) => void;
  logoutDemoSession: () => void;
  updateProfile: (updates: Partial<CustomerProfile>) => void;
  addAddress: (address: Omit<SavedAddress, 'id'>) => void;
  updateAddress: (id: string, updates: Omit<SavedAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addOrder: (order: OrderSummary) => void;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      rememberMe: true,
      profile: DEMO_CUSTOMER_PROFILE,
      addresses: DEMO_SAVED_ADDRESSES,
      orders: DEMO_ORDERS,

      loginDemoSession: (overrides, rememberMe = true) =>
        set((state) => ({
          isAuthenticated: true,
          rememberMe,
          profile: overrides ? { ...state.profile, ...overrides } : state.profile,
        })),

      logoutDemoSession: () => set({ isAuthenticated: false }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),

      addAddress: (address) =>
        set((state) => {
          const newId = `addr-${Date.now()}`;
          const shouldBeDefault = address.isDefault || state.addresses.length === 0;
          const normalizedExisting = shouldBeDefault
            ? state.addresses.map((a) => ({ ...a, isDefault: false }))
            : state.addresses;
          return {
            addresses: [
              ...normalizedExisting,
              { ...address, id: newId, isDefault: shouldBeDefault },
            ],
          };
        }),

      updateAddress: (id, updates) =>
        set((state) => {
          const shouldBeDefault = updates.isDefault;
          return {
            addresses: state.addresses.map((addr) => {
              if (addr.id === id) {
                return { ...updates, id };
              }
              return shouldBeDefault ? { ...addr, isDefault: false } : addr;
            }),
          };
        }),

      deleteAddress: (id) =>
        set((state) => {
          const remaining = state.addresses.filter((a) => a.id !== id);
          if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
            remaining[0] = { ...remaining[0], isDefault: true };
          }
          return { addresses: remaining };
        }),

      setDefaultAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        })),

      addOrder: (order) =>
        set((state) => ({
          orders: [
            order,
            ...state.orders.filter((existing) => existing.orderId !== order.orderId),
          ],
        })),
    }),
    {
      name: 'sfs-customer-demo-storage',
    }
  )
);
