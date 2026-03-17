import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Newspaper } from "lucide-react";

const PressPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <Newspaper className="w-12 h-12 mx-auto mb-4 text-foreground" />
            <h1 className="text-3xl font-serif mb-4">Press</h1>
            <p className="text-muted-foreground">
              Media inquiries and press resources.
            </p>
          </div>

          <div className="text-center py-12 border border-border">
            <p className="text-muted-foreground mb-4">
              For press inquiries, please contact our media team.
            </p>
            <p className="text-sm text-muted-foreground">
              Email: <a href="mailto:press@muslimeem.com" className="underline hover:text-foreground">press@muslimeem.com</a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PressPage;