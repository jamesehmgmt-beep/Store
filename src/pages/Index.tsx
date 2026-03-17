import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { SecondaryHeroSection } from "@/components/SecondaryHeroSection";
import { CategoryButtons } from "@/components/CategoryButtons";
import { CategoryGrid } from "@/components/CategoryGrid";
import { VideoHeroSection } from "@/components/VideoHeroSection";
import { ShopTheLook } from "@/components/ShopTheLook";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <SecondaryHeroSection />
      <CategoryButtons />
      <VideoHeroSection />
      <CategoryGrid />
      <ShopTheLook />
      <Footer />
    </div>
  );
};

export default Index;