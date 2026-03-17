import hero22Image from "@/assets/hero22.webp";

interface SecondaryHeroSectionProps {
  className?: string;
}

export const SecondaryHeroSection = ({ className }: SecondaryHeroSectionProps) => {
  return (
    <section className={`relative w-full overflow-hidden bg-secondary aspect-[21/9] ${className || ''}`}>
      <img 
        src={hero22Image} 
        alt="MUSLIMEEM Collection" 
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </section>
  );
};
