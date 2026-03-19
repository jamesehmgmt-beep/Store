import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ShopifyProduct, createStorefrontCheckout } from '@/lib/shopify';
import { toast } from 'sonner';

export interface CartItem {
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  quantity: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  isShippingFee?: boolean;
}

type ShippingOption = 'standard' | 'express';

// Shipping product details from Shopify
const SHIPPING_PRODUCT_VARIANT_ID = 'gid://shopify/ProductVariant/43117885390907';
const SHIPPING_PRODUCT_SKU = 'SHIPPING-STANDARD';

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isOpen: boolean;
  shippingOption: ShippingOption;
  
  // Actions
  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  setCartId: (cartId: string) => void;
  setCheckoutUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  setOpen: (open: boolean) => void;
  setShippingOption: (option: ShippingOption) => void;
  createCheckout: () => Promise<string | null>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSubtotalPrice: () => number;
  getDiscountPercentage: () => number;
  getShippingCost: () => number;
  getOrderTotal: () => number;
  getProductItems: () => CartItem[];
  syncShippingProduct: () => void;
}

const FREE_SHIPPING_THRESHOLD = 120;
const STANDARD_SHIPPING_COST = 15;
const EXPRESS_SHIPPING_COST = 20;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      isOpen: false,
      shippingOption: 'standard' as ShippingOption,

      addItem: (item) => {
        const { items, syncShippingProduct } = get();
        const existingItem = items.find(i => i.variantId === item.variantId);
        
        if (existingItem) {
          set({
            items: items.map(i =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          });
        } else {
          set({ items: [...items, item] });
        }
        
        // Sync shipping product after adding item
        setTimeout(() => syncShippingProduct(), 0);
        
        set({ isOpen: true });
      },

      updateQuantity: (variantId, quantity) => {
        const { syncShippingProduct } = get();
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.variantId === variantId ? { ...item, quantity } : item
          )
        });
        
        // Sync shipping product after updating quantity
        setTimeout(() => syncShippingProduct(), 0);
      },

      removeItem: (variantId) => {
        const { syncShippingProduct } = get();
        set({
          items: get().items.filter(item => item.variantId !== variantId)
        });
        
        // Sync shipping product after removing item
        setTimeout(() => syncShippingProduct(), 0);
      },

      clearCart: () => {
        set({ items: [], cartId: null, checkoutUrl: null, shippingOption: 'standard' });
      },

      setCartId: (cartId) => set({ cartId }),
      setCheckoutUrl: (checkoutUrl) => set({ checkoutUrl }),
      setLoading: (isLoading) => set({ isLoading }),
      setOpen: (isOpen) => set({ isOpen }),
      setShippingOption: (shippingOption) => set({ shippingOption }),

      createCheckout: async () => {
        const { items, setLoading, setCheckoutUrl } = get();
        // Filter out local shipping fee items — they use a placeholder variant ID
        // that doesn't exist in Shopify and would cause the cart creation to fail
        const productItems = items.filter(item => !item.isShippingFee);
        if (productItems.length === 0) return null;

        setLoading(true);
        try {
          const checkoutUrl = await createStorefrontCheckout(
            productItems.map(item => ({ variantId: item.variantId, quantity: item.quantity }))
          );
          setCheckoutUrl(checkoutUrl);
          return checkoutUrl;
        } catch (error) {
          console.error('Failed to create checkout:', error);
          toast.error('Checkout failed', {
            description: 'Unable to create checkout. Please try again.',
          });
          return null;
        } finally {
          setLoading(false);
        }
      },

      getTotalItems: () => {
        // Don't count shipping fee as an item
        return get().items
          .filter(item => !item.isShippingFee)
          .reduce((sum, item) => sum + item.quantity, 0);
      },

      getProductItems: () => {
        // Get only actual product items (not shipping)
        return get().items.filter(item => !item.isShippingFee);
      },

      getTotalPrice: () => {
        // No discounts - just calculate total price of all items
        return get().items
          .filter(item => !item.isShippingFee)
          .reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
      },

      getSubtotalPrice: () => {
        // Subtotal is the price BEFORE discounts (excluding shipping)
        return get().items
          .filter(item => !item.isShippingFee)
          .reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
      },

      getDiscountPercentage: () => {
        // This now returns 0 since discounts are per-product, not cart-wide
        // Individual item discounts are calculated in getTotalPrice
        return 0;
      },

      getShippingCost: () => {
        const { shippingOption } = get();
        const totalPrice = get().getTotalPrice();
        
        // Base shipping cost: $15 standard or free if $120+
        const baseShipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
        
        // Express adds $20 on top of base shipping
        if (shippingOption === 'express') {
          return baseShipping + EXPRESS_SHIPPING_COST;
        }
        
        return baseShipping;
      },

      getOrderTotal: () => {
        return get().getTotalPrice() + get().getShippingCost();
      },

      syncShippingProduct: () => {
        const { items } = get();
        const productItems = items.filter(item => !item.isShippingFee);
        const shippingItem = items.find(item => item.isShippingFee);
        
        // Calculate total price of products only (no discounts)
        const productTotal = productItems.reduce((sum, item) => {
          return sum + (parseFloat(item.price.amount) * item.quantity);
        }, 0);

        const needsShipping = productTotal > 0 && productTotal < FREE_SHIPPING_THRESHOLD;

        if (needsShipping && !shippingItem) {
          // Add shipping product
          const shippingCartItem: CartItem = {
            product: {
              node: {
                id: 'gid://shopify/Product/7520805191739',
                title: 'Standard Shipping',
                description: 'Shipping fee for orders under $120',
                handle: 'standard-shipping',
                priceRange: {
                  minVariantPrice: {
                    amount: '15.00',
                    currencyCode: 'USD',
                  },
                },
                images: { edges: [] },
                variants: {
                  edges: [{
                    node: {
                      id: SHIPPING_PRODUCT_VARIANT_ID,
                      title: 'Default Title',
                      price: { amount: '15.00', currencyCode: 'USD' },
                      availableForSale: true,
                      selectedOptions: [],
                    },
                  }],
                },
                options: [],
              },
            },
            variantId: SHIPPING_PRODUCT_VARIANT_ID,
            variantTitle: 'Standard Shipping',
            price: { amount: '15.00', currencyCode: 'USD' },
            quantity: 1,
            selectedOptions: [],
            isShippingFee: true,
          };
          set({ items: [...items, shippingCartItem] });
        } else if (!needsShipping && shippingItem) {
          // Remove shipping product
          set({ items: items.filter(item => !item.isShippingFee) });
        }
      },
    }),
    {
      name: 'shopify-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, shippingOption: state.shippingOption }),
      // Migration to clean up old cart data and reset state
      migrate: (persistedState: any, version: number) => {
        // Version 2: Clear all items to ensure clean state with no legacy discount flags
        if (version < 2) {
          return { items: [], shippingOption: 'standard' };
        }
        return persistedState;
      },
      version: 2,
    }
  )
);