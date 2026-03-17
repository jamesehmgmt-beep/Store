import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { User, Package, Heart, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-serif mb-2">My Wishlist</h1>
          <p className="text-muted-foreground mb-8">Items you've saved for later</p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="space-y-2">
              <Link to="/account" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 text-foreground text-left transition-colors">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Profile</span>
              </Link>
              <Link to="/account/orders" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 text-foreground text-left transition-colors">
                <Package className="w-5 h-5" />
                <span className="text-sm font-medium">Orders</span>
              </Link>
              <Link to="/account/wishlist" className="w-full flex items-center gap-3 px-4 py-3 bg-secondary text-foreground text-left">
                <Heart className="w-5 h-5" />
                <span className="text-sm font-medium">Wishlist</span>
              </Link>
              <Link to="/account/settings" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 text-foreground text-left transition-colors">
                <Settings className="w-5 h-5" />
                <span className="text-sm font-medium">Settings</span>
              </Link>
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 text-foreground text-left transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2">
              <div className="border border-border p-6">
                <h2 className="text-xl font-medium mb-6">Saved Items</h2>
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Your wishlist is empty.</p>
                  <Link 
                    to="/category/collections" 
                    className="inline-block mt-4 px-6 py-3 bg-foreground text-background text-sm font-medium uppercase tracking-wider hover:bg-foreground/90 transition-colors"
                  >
                    Explore Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;
