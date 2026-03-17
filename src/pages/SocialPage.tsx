import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

const SocialPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <Instagram className="w-12 h-12 mx-auto mb-4 text-foreground" />
            <h1 className="text-3xl font-serif mb-4">Follow Us</h1>
            <p className="text-muted-foreground">
              Stay connected with MUSLIMEEM on social media.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
            <a href="#" className="flex flex-col items-center p-6 border border-border hover:border-foreground transition-colors">
              <Instagram className="w-8 h-8 mb-3" />
              <span className="font-medium">Instagram</span>
              <span className="text-sm text-muted-foreground">@muslimeemapparel</span>
            </a>
            <a href="#" className="flex flex-col items-center p-6 border border-border hover:border-foreground transition-colors">
              <Facebook className="w-8 h-8 mb-3" />
              <span className="font-medium">Facebook</span>
              <span className="text-sm text-muted-foreground">MUSLIMEEM Apparel</span>
            </a>
            <a href="#" className="flex flex-col items-center p-6 border border-border hover:border-foreground transition-colors">
              <Twitter className="w-8 h-8 mb-3" />
              <span className="font-medium">Twitter</span>
              <span className="text-sm text-muted-foreground">@muslimeemapparel</span>
            </a>
            <a href="#" className="flex flex-col items-center p-6 border border-border hover:border-foreground transition-colors">
              <Youtube className="w-8 h-8 mb-3" />
              <span className="font-medium">YouTube</span>
              <span className="text-sm text-muted-foreground">MUSLIMEEM</span>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SocialPage;