import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RefreshCw, CheckCircle } from "lucide-react";

const ReturnsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <RefreshCw className="w-12 h-12 mx-auto mb-4 text-foreground" />
            <h1 className="text-3xl font-serif mb-4">Returns & Exchanges</h1>
            <p className="text-muted-foreground">
              We want you to love your MUSLIMEEM pieces. If something isn't right, we're here to help.
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-medium mb-4">Our Returns Policy</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">30-day return window from date of delivery</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Items must be unworn with original tags attached</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Free returns on all UK orders</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Refunds processed within 5-7 business days</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-medium mb-4">How to Return</h2>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium flex-shrink-0">1</span>
                  <div>
                    <p className="font-medium">Start your return</p>
                    <p className="text-sm text-muted-foreground">Log into your account or use your order number to initiate a return.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium flex-shrink-0">2</span>
                  <div>
                    <p className="font-medium">Pack your items</p>
                    <p className="text-sm text-muted-foreground">Place items in their original packaging or a secure alternative.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium flex-shrink-0">3</span>
                  <div>
                    <p className="font-medium">Ship it back</p>
                    <p className="text-sm text-muted-foreground">Drop off at your nearest post office or arrange a collection.</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-foreground text-background text-sm font-medium uppercase tracking-wider hover:bg-foreground/90 transition-colors">
              Start a Return
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReturnsPage;