import { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, Loader2, ExternalLink, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/shopify";
import { trackInitiateCheckout, trackPlaceAnOrder } from "@/lib/tiktokPixel";

interface CartDrawerProps {
  children: ReactNode;
}

const FREE_SHIPPING_THRESHOLD = 120;

export const CartDrawer = ({ children }: CartDrawerProps) => {
  const { 
    items, 
    isLoading, 
    isOpen,
    setOpen,
    updateQuantity, 
    removeItem, 
    createCheckout,
    getTotalItems,
    getTotalPrice,
    getSubtotalPrice,
    getProductItems,
  } = useCartStore();

  const handleCheckout = async () => {
    // TikTok Pixel: Track InitiateCheckout & PlaceAnOrder
    const cartData = {
      items: productItems.map(item => ({
        id: item.product.node.id,
        name: item.product.node.title,
        price: parseFloat(item.price.amount),
        quantity: item.quantity,
      })),
      totalValue: totalPrice,
      currency: currencyCode,
    };
    trackInitiateCheckout(cartData);
    trackPlaceAnOrder(cartData);

    // Open window BEFORE async call — browsers block popups after async in incognito
    const win = window.open('about:blank', '_blank');
    const checkoutUrl = await createCheckout();
    if (checkoutUrl) {
      if (win && !win.closed) {
        win.location.href = checkoutUrl;
      } else {
        // Fallback if popup was still blocked — navigate in same tab
        window.location.href = checkoutUrl;
      }
      setOpen(false);
    } else {
      // Close blank tab if checkout failed
      if (win && !win.closed) win.close();
    }
  };

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const subtotalPrice = getSubtotalPrice();
  const productItems = getProductItems(); // Only actual products, not shipping
  const currencyCode = items[0]?.price.currencyCode || 'USD';
  const hasShippingFee = totalPrice < FREE_SHIPPING_THRESHOLD && productItems.length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-background">
        <SheetHeader className="flex-shrink-0 border-b border-border pb-4">
          <SheetTitle className="font-serif text-2xl">Shopping Bag</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? "Your bag is empty" : `${totalItems} item${totalItems !== 1 ? 's' : ''} in your bag`}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {productItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-serif text-lg">Your bag is empty</p>
                <p className="text-sm text-muted-foreground mt-2">Add items to get started</p>
              </div>
            </div>
          ) : (
            <>
              {/* Scrollable items area */}
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-6">
                {productItems.map((item) => {
                    const itemTotal = parseFloat(item.price.amount) * item.quantity;
                    
                    return (
                      <div key={item.variantId} className="flex gap-4">
                        <div className="w-20 h-24 bg-secondary overflow-hidden flex-shrink-0">
                          {item.product.node.images?.edges?.[0]?.node && (
                            <img
                              src={item.product.node.images.edges[0].node.url}
                              alt={item.product.node.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.product.node.title}</h4>
                          {item.variantTitle !== "Default Title" && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.selectedOptions.map(option => option.value).join(' / ')}
                            </p>
                          )}
                          <div className="mt-2">
                            <p className="font-medium text-sm">
                              {formatPrice(itemTotal.toString(), item.price.currencyCode)}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              className="w-7 h-7 border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              className="w-7 h-7 border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => removeItem(item.variantId)}
                              className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Fixed checkout section */}
              <div className="flex-shrink-0 space-y-4 pt-6 border-t border-border mt-6">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-sm uppercase tracking-wider">Subtotal</span>
                  <span className="text-base font-serif">
                    {formatPrice(subtotalPrice.toString(), currencyCode)}
                  </span>
                </div>


                {/* Shipping - now added as a product to checkout */}
                <div className="flex justify-between items-center">
                  <span className="text-sm uppercase tracking-wider">Shipping</span>
                  {hasShippingFee ? (
                    <span className="text-sm font-medium">$15.00</span>
                  ) : (
                    <span className="text-sm font-medium text-green-600">FREE</span>
                  )}
                </div>

                {/* Free shipping upsell */}
                {hasShippingFee && (
                  <p className="text-xs text-muted-foreground">
                    Add ${(FREE_SHIPPING_THRESHOLD - totalPrice).toFixed(2)} more for free shipping!
                  </p>
                )}

                {/* Express shipping note */}
                <p className="text-xs text-muted-foreground">
                  Express shipping (+$20) available at checkout
                </p>

                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-sm uppercase tracking-wider font-medium">Estimated Total</span>
                  <span className="font-serif text-xl">
                    {formatPrice((totalPrice + (hasShippingFee ? 15 : 0)).toString(), currencyCode)}
                  </span>
                </div>
                
                <Button 
                  onClick={handleCheckout}
                  className="w-full h-12 text-sm uppercase tracking-wider" 
                  disabled={productItems.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Checkout
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  Taxes calculated at checkout
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};