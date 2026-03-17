import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Leaf } from "lucide-react";

const SustainabilityPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <Leaf className="w-12 h-12 mx-auto mb-4 text-foreground" />
            <h1 className="text-3xl font-serif mb-4">Sustainability</h1>
            <p className="text-muted-foreground">
              Our commitment to a more sustainable future.
            </p>
          </div>

          <div className="space-y-8 text-muted-foreground">
            <p>
              At MUSLIMEEM, we believe that fashion and sustainability can go hand in hand. We're committed to reducing our environmental impact while delivering the quality modest fashion you love.
            </p>

            <div className="border-t border-border pt-8">
              <h2 className="text-xl font-medium text-foreground mb-4">Our Initiatives</h2>
              <ul className="space-y-4">
                <li>
                  <strong className="text-foreground">Eco-Friendly Packaging:</strong> We use recycled and recyclable materials for all our packaging.
                </li>
                <li>
                  <strong className="text-foreground">Sustainable Fabrics:</strong> We're working to incorporate more sustainable materials into our collections.
                </li>
                <li>
                  <strong className="text-foreground">Carbon Neutral Shipping:</strong> We offset the carbon emissions from all our deliveries.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SustainabilityPage;