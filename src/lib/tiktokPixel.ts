// TikTok Pixel Event Tracking Utility
// Pixel ID: D76217JC77UBIUFTV5CG

declare global {
  interface Window {
    ttq: {
      track: (event: string, params?: Record<string, unknown>) => void;
      identify: (params: Record<string, unknown>) => void;
      page: () => void;
    };
  }
}

const ttq = () => window.ttq;

// Helper to safely call ttq methods
const safeTrack = (event: string, params?: Record<string, unknown>) => {
  try {
    if (typeof window !== 'undefined' && window.ttq) {
      ttq().track(event, params);
    }
  } catch (e) {
    console.warn(`TikTok Pixel: Failed to track ${event}`, e);
  }
};

// ---- EVENT TRACKING FUNCTIONS ----

/**
 * Track when a user views a product page
 */
export const trackViewContent = (product: {
  id: string;
  name: string;
  price: number;
  currency?: string;
  type?: string;
}) => {
  safeTrack('ViewContent', {
    contents: [
      {
        content_id: product.id,
        content_type: product.type || 'product',
        content_name: product.name,
      },
    ],
    value: product.price,
    currency: product.currency || 'USD',
  });
};

/**
 * Track when a user adds an item to cart
 */
export const trackAddToCart = (product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  currency?: string;
  type?: string;
}) => {
  safeTrack('AddToCart', {
    contents: [
      {
        content_id: product.id,
        content_type: product.type || 'product',
        content_name: product.name,
      },
    ],
    value: product.price * product.quantity,
    currency: product.currency || 'USD',
  });
};

/**
 * Track when a user adds an item to wishlist
 */
export const trackAddToWishlist = (product: {
  id: string;
  name: string;
  price: number;
  currency?: string;
  type?: string;
}) => {
  safeTrack('AddToWishlist', {
    contents: [
      {
        content_id: product.id,
        content_type: product.type || 'product',
        content_name: product.name,
      },
    ],
    value: product.price,
    currency: product.currency || 'USD',
  });
};

/**
 * Track when a user initiates checkout
 */
export const trackInitiateCheckout = (cart: {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalValue: number;
  currency?: string;
}) => {
  safeTrack('InitiateCheckout', {
    contents: cart.items.map((item) => ({
      content_id: item.id,
      content_type: 'product',
      content_name: item.name,
    })),
    value: cart.totalValue,
    currency: cart.currency || 'USD',
  });
};

/**
 * Track when a user places an order
 */
export const trackPlaceAnOrder = (order: {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalValue: number;
  currency?: string;
}) => {
  safeTrack('PlaceAnOrder', {
    contents: order.items.map((item) => ({
      content_id: item.id,
      content_type: 'product',
      content_name: item.name,
    })),
    value: order.totalValue,
    currency: order.currency || 'USD',
  });
};

/**
 * Track a completed purchase
 */
export const trackPurchase = (order: {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalValue: number;
  currency?: string;
}) => {
  safeTrack('Purchase', {
    contents: order.items.map((item) => ({
      content_id: item.id,
      content_type: 'product',
      content_name: item.name,
    })),
    value: order.totalValue,
    currency: order.currency || 'USD',
  });
};

/**
 * Track search events
 */
export const trackSearch = (params: {
  searchString: string;
  items?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  value?: number;
  currency?: string;
}) => {
  safeTrack('Search', {
    contents: (params.items || []).map((item) => ({
      content_id: item.id,
      content_type: 'product',
      content_name: item.name,
    })),
    value: params.value || 0,
    currency: params.currency || 'USD',
    search_string: params.searchString,
  });
};

/**
 * Track completed registrations
 */
export const trackCompleteRegistration = () => {
  safeTrack('CompleteRegistration', {
    contents: [],
    value: 0,
    currency: 'USD',
  });
};

/**
 * Track adding payment info
 */
export const trackAddPaymentInfo = (cart: {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalValue: number;
  currency?: string;
}) => {
  safeTrack('AddPaymentInfo', {
    contents: cart.items.map((item) => ({
      content_id: item.id,
      content_type: 'product',
      content_name: item.name,
    })),
    value: cart.totalValue,
    currency: cart.currency || 'USD',
  });
};
