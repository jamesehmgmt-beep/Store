import { Link } from "react-router-dom";
import heroImage from "@/assets/hero1.webp";

interface HeroSectionProps {
  ctaLink?: string;
}

export const HeroSection = ({ 
  ctaLink = "/category/collections"
}: HeroSectionProps) => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-secondary">
      {/* Hero Image */}
      <img
        src={heroImage}
        alt="MUSLIMEEM Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-end pb-24 section-padding">
        <div className="text-center animate-slide-up">
          {/* Shop Now Button */}
          <Link
            to={ctaLink}
            className="inline-block px-8 py-3 bg-background text-foreground text-xs tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
          >
            SHOP NOW
          </Link>
        </div>
      </div>
    </section>
  );
};