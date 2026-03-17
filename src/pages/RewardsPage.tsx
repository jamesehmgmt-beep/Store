import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Gift, Star, Coins } from "lucide-react";

const RewardsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <Gift className="w-12 h-12 mx-auto mb-4 text-foreground" />
            <h1 className="text-3xl font-serif mb-4">MUSLIMEEM Rewards</h1>
            <p className="text-muted-foreground">
              Earn points on every purchase and unlock exclusive benefits.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 border border-border">
              <Star className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-medium mb-2">Earn Points</h3>
              <p className="text-sm text-muted-foreground">Get 1 point for every £1 spent</p>
            </div>
            <div className="text-center p-6 border border-border">
              <Coins className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-medium mb-2">Redeem Rewards</h3>
              <p className="text-sm text-muted-foreground">Use points for discounts on future orders</p>
            </div>
            <div className="text-center p-6 border border-border">
              <Gift className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-medium mb-2">Exclusive Access</h3>
              <p className="text-sm text-muted-foreground">Early access to new collections and sales</p>
            </div>
          </div>

          <div className="text-center">
            <button className="px-8 py-4 bg-foreground text-background text-sm font-medium uppercase tracking-wider hover:bg-foreground/90 transition-colors">
              Join Now
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RewardsPage;