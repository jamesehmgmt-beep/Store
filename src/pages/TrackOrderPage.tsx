import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { Package, Search } from "lucide-react";

const TrackOrderPage = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for order tracking functionality
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-xl mx-auto px-4">
          <div className="text-center mb-10">
            <Package className="w-12 h-12 mx-auto mb-4 text-foreground" />
            <h1 className="text-3xl font-serif mb-2">Track Your Order</h1>
            <p className="text-muted-foreground">
              Enter your order details below to check the status of your delivery.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Order Number</label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. MUSLIMEEM-12345"
                className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter the email used for your order"
                className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-foreground text-background text-sm font-medium uppercase tracking-wider hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Track Order
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Having trouble? <a href="/contact" className="underline hover:text-foreground">Contact our support team</a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TrackOrderPage;