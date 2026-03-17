import { Truck, Tag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

const FREE_SHIPPING_THRESHOLD = 120;

export const FreeShippingBar = () => {
  const totalAmount = useCartStore((state) => state.getTotalPrice());
  const progress = Math.min(100, (totalAmount / FREE_SHIPPING_THRESHOLD) * 100);

  const amountRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - totalAmount);
  const isFreeShipping = totalAmount >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className="bg-[#f5f0eb] py-2 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-foreground" />
            <span className="text-sm">View Offers</span>
          </div>
          <span className="text-muted-foreground">|</span>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-foreground" />
            <span className="text-sm font-semibold">
              {isFreeShipping ? "Free Shipping Unlocked!" : `$${amountRemaining.toFixed(0)} away from Free Shipping`}
            </span>
          </div>
          <div className="flex-1 max-w-xs">
            <div className="relative h-3 bg-[#e0dcd7] rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-foreground rounded-full transition-all duration-300 flex items-center justify-end pr-0.5"
                style={{ width: `${Math.max(progress, 8)}%` }}
              >
                <Truck className="w-3 h-3 text-background" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Stacked */}
        <div className="flex sm:hidden flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-foreground" />
              <span className="text-xs font-semibold">
                {isFreeShipping ? "Free Shipping!" : `$${amountRemaining.toFixed(0)} to Free Shipping`}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag className="w-3 h-3 text-foreground" />
              <span className="text-xs">Offers</span>
            </div>
          </div>
          <div className="w-full">
            <div className="relative h-2.5 bg-[#e0dcd7] rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-foreground rounded-full transition-all duration-300 flex items-center justify-end pr-0.5"
                style={{ width: `${Math.max(progress, 8)}%` }}
              >
                <Truck className="w-2.5 h-2.5 text-background" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
