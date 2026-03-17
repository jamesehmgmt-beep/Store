import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MapPin } from "lucide-react";

const StoresPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-foreground" />
            <h1 className="text-3xl font-serif mb-4">Our Stores</h1>
            <p className="text-muted-foreground">
              Visit us in person at one of our locations.
            </p>
          </div>

          <div className="text-center py-12 border border-border">
            <p className="text-muted-foreground mb-4">
              MUSLIMEEM is currently available exclusively online.
            </p>
            <p className="text-sm text-muted-foreground">
              Stay tuned for retail locations coming soon.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StoresPage;