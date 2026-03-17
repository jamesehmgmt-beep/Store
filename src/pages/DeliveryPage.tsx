import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Truck, Clock, MapPin } from "lucide-react";
const DeliveryPage = () => {
  return <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <Truck className="w-12 h-12 mx-auto mb-4 text-foreground" />
            <h1 className="text-3xl font-serif mb-4">Delivery Information</h1>
            <p className="text-muted-foreground">
              Everything you need to know about our shipping options.
            </p>
          </div>

          <div className="space-y-8">
            <div className="border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="w-5 h-5" />
                <h3 className="font-medium">Standard Delivery</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">FREE on orders over £50</p>
              <p className="text-sm text-muted-foreground">3-5 working days • £3.99 for orders under £50</p>
            </div>

            <div className="border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5" />
                <h3 className="font-medium">UK Express Delivery</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Next working day delivery</p>
              <p className="text-sm text-muted-foreground">Order before 2pm • £5.99</p>
            </div>

            <div className="border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5" />
                <h3 className="font-medium">International Delivery</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">We ship worldwide</p>
              <p className="text-sm text-muted-foreground">5-10 working days • Prices vary by location</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>;
};
export default DeliveryPage;