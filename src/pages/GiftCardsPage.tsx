import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Gift } from "lucide-react";

const GiftCardsPage = () => {
  const amounts = [25, 50, 75, 100, 150, 200];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <Gift className="w-12 h-12 mx-auto mb-4 text-foreground" />
            <h1 className="text-3xl font-serif mb-4">Gift Cards</h1>
            <p className="text-muted-foreground">
              Give the gift of confidence. Perfect for any occasion.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {amounts.map((amount) => (
              <button
                key={amount}
                className="p-6 border border-border hover:border-foreground transition-colors text-center"
              >
                <span className="text-2xl font-serif">£{amount}</span>
              </button>
            ))}
          </div>

          <div className="text-center">
            <button className="px-8 py-4 bg-foreground text-background text-sm font-medium uppercase tracking-wider hover:bg-foreground/90 transition-colors">
              Purchase Gift Card
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Gift cards are delivered instantly via email and never expire.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GiftCardsPage;