import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Minus, Plus, Heart, Star, Info, ChevronDown, Ruler, Check, Dumbbell, Leaf, SlidersHorizontal, Settings, WashingMachine, ChevronLeft, ChevronRight, Search, ThumbsUp, MessageSquare } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FreeShippingBar } from "@/components/FreeShippingBar";
import { Button } from "@/components/ui/button";
import { fetchProductByHandle, fetchProducts, formatPrice, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ProductData {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
        image?: {
          url: string;
          altText: string | null;
        };
      };
    }>;
  };
  options: Array<{
    name: string;
    values: string[];
  }>;
}

// You May Also Like Component
const YouMayAlsoLike = ({ currentProductId }: { currentProductId: string }) => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts(8);
      // Filter out current product
      const filtered = data.filter((p) => p.node.id !== currentProductId);
      setProducts(filtered);
      setLoading(false);
    };
    loadProducts();
  }, [currentProductId]);

  const visibleProducts = 4;
  const maxIndex = Math.max(0, products.length - visibleProducts);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  if (loading || products.length === 0) return null;

  return (
    <div className="px-4 md:px-8 lg:px-16 py-16 bg-background">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">You may also like</h2>
      
      <div className="relative">
        {/* Left Arrow - Desktop only */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-background rounded-full shadow-md items-center justify-center transition-opacity hidden md:flex ${
            currentIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-secondary'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Products Grid - Desktop */}
        <div className="overflow-hidden mx-14 hidden md:block">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentIndex * (100 / visibleProducts)}%)` }}
          >
            {products.map((product) => (
              <Link
                key={product.node.id}
                to={`/product/${product.node.handle}`}
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / visibleProducts}%` }}
              >
                <div className="group">
                  <div className="aspect-[3/4] bg-secondary overflow-hidden mb-3">
                    {product.node.images.edges[0]?.node.url && (
                      <img
                        src={product.node.images.edges[0].node.url}
                        alt={product.node.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-medium leading-tight line-clamp-2">{product.node.title}</h3>
                    <span className="text-sm font-medium">
                      {formatPrice(product.node.priceRange.minVariantPrice.amount, product.node.priceRange.minVariantPrice.currencyCode)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Products Grid - Mobile */}
        <div className="grid grid-cols-2 gap-4 md:hidden">
          {products.slice(0, 4).map((product) => (
            <Link
              key={product.node.id}
              to={`/product/${product.node.handle}`}
              className="block"
            >
              <div className="group">
                <div className="aspect-[3/4] bg-secondary overflow-hidden mb-3">
                  {product.node.images.edges[0]?.node.url && (
                    <img
                      src={product.node.images.edges[0].node.url}
                      alt={product.node.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-xs font-medium leading-tight line-clamp-2">{product.node.title}</h3>
                  <span className="text-xs font-medium">
                    {formatPrice(product.node.priceRange.minVariantPrice.amount, product.node.priceRange.minVariantPrice.currencyCode)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow - Desktop only */}
        <button
          onClick={handleNext}
          disabled={currentIndex >= maxIndex}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-background rounded-full shadow-md items-center justify-center transition-opacity hidden md:flex ${
            currentIndex >= maxIndex ? 'opacity-40 cursor-not-allowed' : 'hover:bg-secondary'
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-colors ${
              idx === currentIndex ? 'bg-foreground' : 'bg-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    rating: 5,
    title: "Beautiful Thobe",
    content: "The quality of the fabric is exceptional. Lightweight, breathable, and perfect for daily wear or Friday prayers. Highly recommend!",
    fits: "True to size",
    sizePurchased: "Large",
    daysAgo: 7,
    hasResponse: false,
  },
  {
    id: 2,
    rating: 5,
    title: "5 stars to Muslimeem!",
    content: "Gorgeous craftsmanship and modest design. I've been looking for something this elegant for a long time. Worth every penny.",
    fits: "True to size",
    sizePurchased: null,
    daysAgo: 14,
    hasResponse: false,
  },
  {
    id: 3,
    rating: 5,
    title: "Stunning Hijab Collection",
    content: "The fabric drapes so beautifully and doesn't slip at all. I've ordered in three colors already — nothing else compares.",
    fits: null,
    sizePurchased: null,
    daysAgo: 21,
    hasResponse: true,
    response: {
      author: "Muslimeem Customer Care",
      content: "We're so glad you love the collection! Modesty and elegance, always. 🤍",
      daysAgo: 21,
    },
  },
];

// Reviews Section Component
const ReviewsSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [starFilterOpen, setStarFilterOpen] = useState(false);
  const [imagesFilterOpen, setImagesFilterOpen] = useState(false);
  const [sizeFilterOpen, setSizeFilterOpen] = useState(false);
  const [incentivesFilterOpen, setIncentivesFilterOpen] = useState(false);

  const totalReviews = 261;
  const averageRating = 4.0;

  return (
    <div className="px-4 md:px-8 lg:px-16 py-16 bg-background border-t border-border">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <h2 className="text-3xl md:text-4xl font-bold">Reviews</h2>
        <div className="flex items-center gap-1">
          <Star className="w-6 h-6 fill-foreground text-foreground" />
          <span className="text-3xl md:text-4xl font-bold">{averageRating}</span>
        </div>
        <span className="text-xl text-muted-foreground">({totalReviews})</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        {/* Left Sidebar - Filters */}
        <div className="space-y-6">
          {/* Fits true to size slider */}
          <div className="space-y-3">
            <h3 className="font-semibold">Fits true to size</h3>
            <div className="relative pt-2">
              <div className="h-1 bg-muted rounded-full">
                <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-3 h-3 bg-foreground rounded-full"></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Small</span>
                <span>True to size</span>
                <span>Large</span>
              </div>
            </div>
          </div>

          {/* Search Reviews */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search Reviews"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-md bg-background text-sm"
            />
          </div>

          {/* Filter Accordions */}
          <div className="space-y-0">
            <Collapsible open={starFilterOpen} onOpenChange={setStarFilterOpen}>
              <CollapsibleTrigger className="w-full flex items-center justify-between py-4 border-b border-border/50">
                <span className="text-sm font-medium">Star rating</span>
                <Plus className={`w-4 h-4 transition-transform ${starFilterOpen ? 'rotate-45' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="py-3 space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <label key={stars} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < stars ? 'fill-foreground text-foreground' : 'text-muted'}`} />
                      ))}
                    </div>
                  </label>
                ))}
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={imagesFilterOpen} onOpenChange={setImagesFilterOpen}>
              <CollapsibleTrigger className="w-full flex items-center justify-between py-4 border-b border-border/50">
                <span className="text-sm font-medium">Images</span>
                <Plus className={`w-4 h-4 transition-transform ${imagesFilterOpen ? 'rotate-45' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="py-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">With images only</span>
                </label>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={sizeFilterOpen} onOpenChange={setSizeFilterOpen}>
              <CollapsibleTrigger className="w-full flex items-center justify-between py-4 border-b border-border/50">
                <span className="text-sm font-medium">Size</span>
                <Plus className={`w-4 h-4 transition-transform ${sizeFilterOpen ? 'rotate-45' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="py-3 space-y-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <label key={size} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">{size}</span>
                  </label>
                ))}
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={incentivesFilterOpen} onOpenChange={setIncentivesFilterOpen}>
              <CollapsibleTrigger className="w-full flex items-center justify-between py-4 border-b border-border/50">
                <span className="text-sm font-medium">Incentives</span>
                <Plus className={`w-4 h-4 transition-transform ${incentivesFilterOpen ? 'rotate-45' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="py-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Verified purchase</span>
                </label>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Right - Reviews List */}
        <div className="space-y-6">
          {/* Reviews Header */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Showing 16 of {totalReviews} reviews</span>
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort by:</span>
              <select className="text-sm font-medium bg-transparent border-none cursor-pointer">
                <option>Highest to Lowest Rating</option>
                <option>Lowest to Highest Rating</option>
                <option>Most Recent</option>
              </select>
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-0">
            {mockReviews.map((review) => (
              <div key={review.id} className="border-b border-border py-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-foreground text-foreground' : 'text-muted'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{review.daysAgo} days ago</span>
                </div>
                
                <h4 className="font-semibold mb-2">{review.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{review.content}</p>
                
                {(review.fits || review.sizePurchased) && (
                  <div className="flex gap-4 text-sm mb-4">
                    {review.fits && (
                      <span><strong>Fits:</strong> {review.fits}</span>
                    )}
                    {review.sizePurchased && (
                      <span><strong>Size Purchased:</strong> {review.sizePurchased}</span>
                    )}
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span>Leave a comment</span>
                  </button>
                </div>

                {/* Brand Response */}
                {review.hasResponse && review.response && (
                  <div className="mt-4 bg-[#f5f0eb] p-4 rounded-md">
                    <p className="text-sm text-muted-foreground mb-2">Response from Muslimeem</p>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-foreground rounded-full flex items-center justify-center">
                        <span className="text-background text-xs font-bold">M</span>
                      </div>
                      <span className="text-sm font-medium">{review.response.author}</span>
                      <span className="text-sm text-muted-foreground">{review.response.daysAgo} days ago</span>
                    </div>
                    <p className="text-sm">{review.response.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [shippingOpen, setShippingOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [designedOpen, setDesignedOpen] = useState(false);
  const [fabricOpen, setFabricOpen] = useState(false);
  const [fitOpen, setFitOpen] = useState(false);
  const [productFeaturesOpen, setProductFeaturesOpen] = useState(false);
  const [materialOpen, setMaterialOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  
  // Bundle upsell state
  const [bundle1Color, setBundle1Color] = useState("");
  const [bundle1Size, setBundle1Size] = useState("");
  const [bundle2Color, setBundle2Color] = useState("");
  const [bundle2Size, setBundle2Size] = useState("");
  const [bundleProduct, setBundleProduct] = useState<ProductData | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      setLoading(true);
      const data = await fetchProductByHandle(handle);
      setProduct(data);
      
      if (data?.options) {
        const defaults: Record<string, string> = {};
        data.options.forEach((option: { name: string; values: string[] }) => {
          if (option.values.length > 0) {
            defaults[option.name] = option.values[0];
          }
        });
        setSelectedOptions(defaults);
      }
      setLoading(false);
    };
    loadProduct();
  }, [handle]);

  // Load a different product for the bundle
  useEffect(() => {
    const loadBundleProduct = async () => {
      if (!product) return;
      const products = await fetchProducts(8);
      // Filter out current product and find a different one
      const filtered = products.filter((p) => p.node.id !== product.id);
      if (filtered.length > 0) {
        // Pick a random product from the filtered list
        const randomProduct = filtered[Math.floor(Math.random() * filtered.length)];
        setBundleProduct(randomProduct.node as unknown as ProductData);
      }
    };
    loadBundleProduct();
  }, [product]);

  const getSelectedVariant = () => {
    if (!product) return null;
    return product.variants.edges.find(({ node }) => {
      return node.selectedOptions.every(
        (opt) => selectedOptions[opt.name] === opt.value
      );
    })?.node;
  };

  const handleAddToCart = () => {
    const variant = getSelectedVariant();
    if (!product || !variant) return;

    addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions,
    });

    toast.success("Added to cart!", {
      description: `${product.title} has been added to your cart.`,
      position: "top-center",
    });
  };

  const images = product?.images.edges || [];
  const selectedVariant = getSelectedVariant();
  const currentPrice = selectedVariant?.price.amount || product?.priceRange.minVariantPrice.amount || "0";
  const originalPrice = (parseFloat(currentPrice) * 1.26).toFixed(2); // Simulated original price for sale

  // Build display images: put the selected variant's image first if it exists
  const displayImages = (() => {
    if (!selectedVariant?.image?.url) return images;
    const variantImgUrl = selectedVariant.image.url;
    // Check if the variant image is already in the product images
    const existingIdx = images.findIndex(img => img.node.url === variantImgUrl);
    if (existingIdx === 0) return images; // Already first
    if (existingIdx > 0) {
      // Move variant image to front
      const reordered = [...images];
      const [moved] = reordered.splice(existingIdx, 1);
      reordered.unshift(moved);
      return reordered;
    }
    // Variant image not in product images — prepend it
    return [{ node: { url: variantImgUrl, altText: selectedVariant.image.altText } }, ...images];
  })();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] pt-24">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 pt-24">
          <p className="text-muted-foreground">Product not found</p>
          <Link to="/">
            <Button variant="outline">Return Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Free Shipping Bar */}
      <div className="pt-24">
        <FreeShippingBar />
      </div>

      {/* Breadcrumb */}
      <div className="px-4 md:px-8 lg:px-16 py-3">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/category/collections" className="hover:text-foreground">Collections</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.title}</span>
        </nav>
      </div>

      {/* Product Section - Leonisa Layout */}
      <div className="px-4 md:px-8 lg:px-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 lg:gap-10">
          
          {/* Left - Image Grid (2 per row) */}
          <div className="space-y-1">
            <div className="grid grid-cols-2 gap-1">
              {displayImages.slice(0, 6).map((img, idx) => (
                <div key={idx} className="relative aspect-[3/4] bg-[#f5f0eb] overflow-hidden">
                  <img
                    src={img.node.url}
                    alt={img.node.altText || `${product.title} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right - Product Details (Sticky) */}
          <div className="lg:sticky lg:top-28 lg:self-start space-y-4">
            
            {/* Bestseller Badge - Nude color rounded */}
            <div className="inline-block bg-[#f5f0eb] px-4 py-1.5 rounded-full">
              <span className="text-xs font-medium">Bestseller</span>
            </div>

            {/* Product Title */}
            <div>
              <p className="text-base font-medium">MUSLIMEEM</p>
              <p className="text-base text-muted-foreground">{product.title}</p>
            </div>

            {/* Quality Level */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                <div className="w-6 h-1 bg-foreground"></div>
                <div className="w-6 h-1 bg-foreground"></div>
                <div className="w-6 h-1 bg-muted"></div>
              </div>
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Premium Quality</span>
            </div>

            {/* Rating & SKU */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-foreground text-foreground" />
                ))}
                <Star className="w-4 h-4 fill-muted text-muted" />
                <span className="text-xs text-muted-foreground ml-1">155</span>
              </div>
              <span className="text-xs text-muted-foreground">012952802S</span>
            </div>

            {/* Price with Sale */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground line-through">
                ${originalPrice}
              </span>
              <span className="text-xl font-semibold text-red-600">
                {formatPrice(currentPrice, selectedVariant?.price.currencyCode || "USD")}
              </span>
              <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded font-medium">
                Sale 26%
              </span>
            </div>


            {/* Nude Options Box - Contains Color, Size, Quantity, Add to Bag */}
            <div className="bg-[#f5f0eb] p-5 rounded-2xl space-y-5">
              
              {/* Color Options - Variant Image Thumbnails */}
              {product.options.filter(opt => opt.name.toLowerCase() === 'color').map((option) => {
                // Build a map from color value to variant image
                const colorImageMap: Record<string, string> = {};
                product.variants.edges.forEach(({ node }) => {
                  const colorOpt = node.selectedOptions.find(o => o.name.toLowerCase() === 'color');
                  if (colorOpt && node.image?.url && !colorImageMap[colorOpt.value]) {
                    colorImageMap[colorOpt.value] = node.image.url;
                  }
                });

                return (
                  <div key={option.name} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Color</span>
                      <span className="text-sm">{selectedOptions[option.name]}</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {option.values.map((value) => {
                        const imageUrl = colorImageMap[value];
                        return (
                          <button
                            key={value}
                            onClick={() => setSelectedOptions((prev) => ({ ...prev, [option.name]: value }))}
                            className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                              selectedOptions[option.name] === value
                                ? "border-foreground ring-2 ring-foreground ring-offset-2"
                                : "border-muted hover:border-foreground"
                            }`}
                            title={value}
                          >
                            {imageUrl ? (
                              <img src={imageUrl} alt={value} className="w-full h-full object-cover" />
                            ) : (
                              <span className="flex items-center justify-center w-full h-full bg-secondary text-xs text-muted-foreground">
                                {value.slice(0, 3)}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Size Options with Size Guide */}
              {product.options.filter(opt => opt.name.toLowerCase() === 'size').map((option) => (
                <div key={option.name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Size</span>
                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                      <Ruler className="w-4 h-4" />
                      Size Guide
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {option.values.map((value) => (
                      <button
                        key={value}
                        onClick={() => setSelectedOptions((prev) => ({ ...prev, [option.name]: value }))}
                        className={`min-w-[44px] h-10 px-4 rounded-full border text-sm font-medium transition-all ${
                          selectedOptions[option.name] === value
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background text-foreground border-border hover:border-foreground"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Quantity & Add to Bag */}
              <div className="flex gap-3 items-center">
                <div className="flex items-center border border-border rounded-full bg-background">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-11 flex items-center justify-center hover:bg-secondary/50 transition-colors rounded-l-full"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-11 flex items-center justify-center hover:bg-secondary/50 transition-colors rounded-r-full"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant?.availableForSale}
                  className="flex-1 h-11 text-sm font-medium uppercase tracking-wider rounded-full bg-foreground text-background hover:bg-foreground/90"
                >
                  {selectedVariant?.availableForSale ? "ADD TO BAG" : "Out of Stock"}
                </Button>
              </div>
            </div>

            {/* Non-returnable Notice */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-2">
              <Info className="w-4 h-4" />
              <span className="underline">See our return policy for details</span>
            </div>

            {/* Buy the Set Upsell Section */}
            <div className="space-y-6 pt-2">
              <h3 className="text-lg font-medium text-center">Add 2 Items</h3>
              
              <div className="flex flex-col gap-6">
                {/* Product 1 - Current Product */}
                <div className="w-full">
                  <div className="flex gap-3 mb-4">
                    <div className="w-24 h-28 bg-[#e8e4df] rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={displayImages[0]?.node.url || ''} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-sm font-medium leading-tight line-clamp-2">{product.title}</p>
                        <p className="text-sm font-semibold mt-1">
                          {formatPrice(currentPrice, selectedVariant?.price.currencyCode || "USD")}
                        </p>
                      </div>
                  </div>
                  <div className="flex gap-2">
                    {product.options.map((option) => (
                      <div key={option.name} className="relative flex-1">
                        <select 
                          value={option.name.toLowerCase() === 'color' ? bundle1Color : bundle1Size}
                          onChange={(e) => {
                            if (option.name.toLowerCase() === 'color') setBundle1Color(e.target.value);
                            else setBundle1Size(e.target.value);
                          }}
                          className="w-full appearance-none text-sm border-0 rounded-full px-4 py-3 pr-10 bg-[#f5f0eb] text-foreground"
                        >
                          <option value="">{option.name}</option>
                          {option.values.map(v => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <span className="text-2xl font-light text-muted-foreground">+</span>
                </div>

                {/* Product 2 - Different Product */}
                {bundleProduct ? (
                  <div className="w-full">
                    <div className="flex gap-3 mb-4">
                      <div className="w-24 h-28 bg-[#e8e4df] rounded-xl overflow-hidden flex-shrink-0">
                        <img 
                          src={bundleProduct.images.edges[0]?.node.url || ''} 
                          alt={bundleProduct.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-sm font-medium leading-tight line-clamp-2">{bundleProduct.title}</p>
                        <p className="text-sm font-semibold mt-1">
                          {formatPrice(bundleProduct.priceRange.minVariantPrice.amount, bundleProduct.priceRange.minVariantPrice.currencyCode)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {bundleProduct.options.map((option: { name: string; values: string[] }) => (
                        <div key={option.name} className="relative flex-1">
                          <select 
                            value={option.name.toLowerCase() === 'color' ? bundle2Color : bundle2Size}
                            onChange={(e) => {
                              if (option.name.toLowerCase() === 'color') setBundle2Color(e.target.value);
                              else setBundle2Size(e.target.value);
                            }}
                            className="w-full appearance-none text-sm border-0 rounded-full px-4 py-3 pr-10 bg-[#f5f0eb] text-foreground"
                          >
                            <option value="">{option.name}</option>
                            {option.values.map((v: string) => (
                              <option key={v} value={v}>{v}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-center h-32 text-muted-foreground text-sm">
                    Loading...
                  </div>
                )}
              </div>

              {/* Dynamic Add to Bag Button */}
              {(() => {
                // Check if all required options are filled for product 1
                const p1HasColor = product.options.some(o => o.name.toLowerCase() === 'color');
                const p1HasSize = product.options.some(o => o.name.toLowerCase() === 'size');
                const p1Ready = (!p1HasColor || bundle1Color) && (!p1HasSize || bundle1Size);

                // Check if all required options are filled for product 2
                const p2HasColor = bundleProduct?.options.some((o: { name: string }) => o.name.toLowerCase() === 'color');
                const p2HasSize = bundleProduct?.options.some((o: { name: string }) => o.name.toLowerCase() === 'size');
                const p2Ready = (!p2HasColor || bundle2Color) && (!p2HasSize || bundle2Size);

                const allReady = p1Ready && p2Ready && bundleProduct;

                return (
                  <Button 
                    variant="secondary" 
                    className={`w-full h-11 text-sm font-medium uppercase tracking-wide rounded-full ${
                      allReady
                        ? 'bg-foreground text-background hover:bg-foreground/90'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                    disabled={!allReady}
                    onClick={() => {
                      if (!allReady || !product || !bundleProduct) return;

                      // Find variant 1 by matching all selected options
                      const variant1 = product.variants.edges.find(({ node }) => {
                        return node.selectedOptions.every(opt => {
                          if (opt.name.toLowerCase() === 'color') return opt.value === bundle1Color;
                          if (opt.name.toLowerCase() === 'size') return opt.value === bundle1Size;
                          return true;
                        });
                      })?.node;

                      // Find variant 2 by matching all selected options
                      const variant2 = bundleProduct.variants.edges.find(({ node }) => {
                        return node.selectedOptions.every((opt: { name: string; value: string }) => {
                          if (opt.name.toLowerCase() === 'color') return opt.value === bundle2Color;
                          if (opt.name.toLowerCase() === 'size') return opt.value === bundle2Size;
                          return true;
                        });
                      })?.node;

                      if (variant1 && variant2) {
                        const opts1: Array<{ name: string; value: string }> = [];
                        if (bundle1Color) opts1.push({ name: 'Color', value: bundle1Color });
                        if (bundle1Size) opts1.push({ name: 'Size', value: bundle1Size });

                        addItem({
                          product: { node: product },
                          variantId: variant1.id,
                          variantTitle: opts1.map(o => o.value).join(' / '),
                          price: variant1.price,
                          quantity: 1,
                          selectedOptions: opts1,
                        });

                        const opts2: Array<{ name: string; value: string }> = [];
                        if (bundle2Color) opts2.push({ name: 'Color', value: bundle2Color });
                        if (bundle2Size) opts2.push({ name: 'Size', value: bundle2Size });

                        addItem({
                          product: { node: bundleProduct },
                          variantId: variant2.id,
                          variantTitle: opts2.map(o => o.value).join(' / '),
                          price: variant2.price,
                          quantity: 1,
                          selectedOptions: opts2,
                        });

                        toast.success("Items added to bag!", {
                          description: "2 items have been added to your cart.",
                          position: "top-center",
                        });
                      } else {
                        toast.error("Could not find variant", {
                          description: "Please try different options.",
                          position: "top-center",
                        });
                      }
                    }}
                  >
                    {allReady ? 'Add Both to Bag' : 'Choose Options'}
                  </Button>
                );
              })()}
            </div>

            {/* Product Details Accordion Section */}
            <div className="space-y-0 pt-4 border-t border-border">
              {/* Designed for Everyday Modesty */}
              <Collapsible open={designedOpen} onOpenChange={setDesignedOpen}>
                <CollapsibleTrigger className="w-full flex items-center justify-between py-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <Dumbbell className="w-5 h-5" />
                    <span className="text-sm font-medium">Designed for Everyday Modesty</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${designedOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="py-3 text-sm text-muted-foreground">
                  Crafted for daily wear, special occasions, and everything in between. Modest designs that move with you for comfort and confidence.
                </CollapsibleContent>
              </Collapsible>

              {/* Silky-Soft, Breathable Fabric */}
              <Collapsible open={fabricOpen} onOpenChange={setFabricOpen}>
                <CollapsibleTrigger className="w-full flex items-center justify-between py-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <Leaf className="w-5 h-5" />
                    <span className="text-sm font-medium">Silky-Soft, Breathable Fabric</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${fabricOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="py-3 text-sm text-muted-foreground">
                  Made with premium breathable fabrics that feel silky-soft against your skin while keeping you cool and comfortable all day.
                </CollapsibleContent>
              </Collapsible>

              {/* Tailored Modest Fit */}
              <Collapsible open={fitOpen} onOpenChange={setFitOpen}>
                <CollapsibleTrigger className="w-full flex items-center justify-between py-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <SlidersHorizontal className="w-5 h-5" />
                    <span className="text-sm font-medium">Tailored Modest Fit</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${fitOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="py-3 text-sm text-muted-foreground">
                  Expertly tailored for a flattering and modest silhouette. Thoughtful construction ensures full coverage without compromising on style.
                </CollapsibleContent>
              </Collapsible>

              {/* Product Features */}
              <Collapsible open={productFeaturesOpen} onOpenChange={setProductFeaturesOpen}>
                <CollapsibleTrigger className="w-full flex items-center justify-between py-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5" />
                    <span className="text-sm font-medium">Product Features</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${productFeaturesOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="py-3 text-sm text-muted-foreground space-y-2">
                  <p>• Premium modest fashion craftsmanship</p>
                  <p>• Reinforced stitching for lasting quality</p>
                  <p>• Wrinkle-resistant for easy travel</p>
                  <p>• Elegant drape and structured fit</p>
                </CollapsibleContent>
              </Collapsible>

              {/* Material and care */}
              <Collapsible open={materialOpen} onOpenChange={setMaterialOpen}>
                <CollapsibleTrigger className="w-full flex items-center justify-between py-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <WashingMachine className="w-5 h-5" />
                    <span className="text-sm font-medium">Material and care</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${materialOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="py-3 text-sm text-muted-foreground space-y-2">
                  <p><strong>Fabric:</strong> Premium blend — varies by product</p>
                  <p><strong>Care:</strong> Machine wash cold, tumble dry low</p>
                  <p><strong>Origin:</strong> Ethically sourced and crafted</p>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* View Product Features */}
            <Collapsible open={featuresOpen} onOpenChange={setFeaturesOpen}>
              <CollapsibleTrigger className="w-full flex items-center justify-center gap-2 py-3 bg-secondary/50 hover:bg-secondary/70 transition-colors text-sm font-medium uppercase tracking-wide rounded-full">
                View Product Features
                <ChevronDown className={`w-4 h-4 transition-transform ${featuresOpen ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4 space-y-2 text-sm text-muted-foreground">
                <p><strong>Care:</strong> Machine wash cold, tumble dry low.</p>
                <p><strong>Origin:</strong> Ethically sourced and crafted</p>
              </CollapsibleContent>
            </Collapsible>

            {/* Shipping & Returns Accordion */}
            <Collapsible open={shippingOpen} onOpenChange={setShippingOpen} className="border-t border-border pt-4">
              <CollapsibleTrigger className="w-full flex items-center justify-between py-2 text-base font-medium">
                Shipping & Returns
                <ChevronDown className={`w-5 h-5 transition-transform ${shippingOpen ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3 space-y-3 text-sm text-muted-foreground">
                <p><strong>Free Shipping:</strong> On all orders over $99</p>
                <p><strong>Standard Shipping:</strong> 5-7 business days</p>
                <p><strong>Express Shipping:</strong> 2-3 business days</p>
                <p><strong>Returns:</strong> We accept returns within 30 days for unworn items in original packaging. See our returns page for details.</p>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>

      {/* Why We Made This Section */}
      <div className="px-4 md:px-8 lg:px-16 py-16 bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Left - Title and Description */}
          <div className="space-y-6">
            <div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1]">Why we<br />made this</h2>
              <div className="w-10 h-1 bg-red-600 mt-6"></div>
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-sm">
              Every piece tells a story of faith, culture, and timeless elegance. We craft modest fashion that honors tradition while embracing modern style.
            </p>
          </div>

          {/* Center - Model Image */}
          <div className="aspect-[3/4] bg-[#f0ebe6] overflow-hidden">
            {images[0]?.node.url && (
              <img 
                src={images[0].node.url} 
                alt="Product lifestyle"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Right - Fabric Detail Image */}
          <div className="aspect-[3/4] bg-[#2a2a2a] overflow-hidden">
            {images[1]?.node.url && (
              <img 
                src={images[1].node.url} 
                alt="Fabric detail"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Accordion Section */}
        <div className="mt-12 max-w-6xl mx-auto">
          {/* Designed for Everyday Modesty */}
          <Collapsible open={designedOpen} onOpenChange={setDesignedOpen}>
            <CollapsibleTrigger className="w-full flex items-center justify-between py-5 border-b border-border/30">
              <div className="flex items-center gap-4">
                <Dumbbell className="w-5 h-5" />
                <span className="text-base font-medium">Designed for Everyday Modesty</span>
              </div>
              <Plus className={`w-5 h-5 transition-transform ${designedOpen ? 'rotate-45' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="py-4 text-sm text-muted-foreground">
              Crafted for daily wear, special occasions, and everything in between. Modest designs that move with you for comfort and confidence.
            </CollapsibleContent>
          </Collapsible>

          {/* Silky-Soft, Breathable Fabric */}
          <Collapsible open={fabricOpen} onOpenChange={setFabricOpen}>
            <CollapsibleTrigger className="w-full flex items-center justify-between py-5 border-b border-border/30">
              <div className="flex items-center gap-4">
                <Leaf className="w-5 h-5" />
                <span className="text-base font-medium">Silky-Soft, Breathable Fabric</span>
              </div>
              <Plus className={`w-5 h-5 transition-transform ${fabricOpen ? 'rotate-45' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="py-4 text-sm text-muted-foreground">
              Made with premium breathable fabrics that feel silky-soft against your skin while keeping you cool and comfortable all day.
            </CollapsibleContent>
          </Collapsible>

          {/* Tailored Modest Fit */}
          <Collapsible open={fitOpen} onOpenChange={setFitOpen}>
            <CollapsibleTrigger className="w-full flex items-center justify-between py-5 border-b border-border/30">
              <div className="flex items-center gap-4">
                <SlidersHorizontal className="w-5 h-5" />
                <span className="text-base font-medium">Tailored Modest Fit</span>
              </div>
              <Plus className={`w-5 h-5 transition-transform ${fitOpen ? 'rotate-45' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="py-4 text-sm text-muted-foreground">
              Expertly tailored for a flattering and modest silhouette. Thoughtful construction ensures full coverage without compromising on style.
            </CollapsibleContent>
          </Collapsible>

          {/* Product Features */}
          <Collapsible open={productFeaturesOpen} onOpenChange={setProductFeaturesOpen}>
            <CollapsibleTrigger className="w-full flex items-center justify-between py-5 border-b border-border/30">
              <div className="flex items-center gap-4">
                <Settings className="w-5 h-5" />
                <span className="text-base font-medium">Product Features</span>
              </div>
              <Plus className={`w-5 h-5 transition-transform ${productFeaturesOpen ? 'rotate-45' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="py-4 text-sm text-muted-foreground space-y-2">
              <p>• Premium modest fashion craftsmanship</p>
              <p>• Reinforced stitching for lasting quality</p>
              <p>• Wrinkle-resistant for easy travel</p>
              <p>• Elegant drape and structured fit</p>
            </CollapsibleContent>
          </Collapsible>

          {/* Material and care */}
          <Collapsible open={materialOpen} onOpenChange={setMaterialOpen}>
            <CollapsibleTrigger className="w-full flex items-center justify-between py-5 border-b border-border/30">
              <div className="flex items-center gap-4">
                <WashingMachine className="w-5 h-5" />
                <span className="text-base font-medium">Material and care</span>
              </div>
              <Plus className={`w-5 h-5 transition-transform ${materialOpen ? 'rotate-45' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="py-4 text-sm text-muted-foreground space-y-2">
              <p><strong>Fabric:</strong> Premium blend — varies by product</p>
              <p><strong>Care:</strong> Machine wash cold, tumble dry low</p>
              <p><strong>Origin:</strong> Ethically sourced and crafted</p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* You May Also Like Section */}
      <YouMayAlsoLike currentProductId={product.id} />

      {/* Reviews Section */}
      <ReviewsSection />

      <Footer />
    </div>
  );
};

export default ProductPage;
