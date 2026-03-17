import { Link } from "react-router-dom";

interface FeaturedSectionProps {
  title: string;
  link: string;
  align?: "left" | "right" | "center";
  aspectRatio?: "video" | "square" | "portrait";
}

export const FeaturedSection = ({
  title,
  link,
  align = "center",
  aspectRatio = "video",
}: FeaturedSectionProps) => {
  const aspectClasses = {
    video: "aspect-video md:aspect-[21/9]",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
  };

  const alignClasses = {
    left: "items-start text-left pl-8 md:pl-16",
    right: "items-end text-right pr-8 md:pr-16",
    center: "items-center text-center",
  };

  return (
    <section className="section-padding py-8">
      <div
        className={`relative ${aspectClasses[aspectRatio]} bg-secondary/30 overflow-hidden`}
      >
        {/* Placeholder for background image/video */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        <div
          className={`absolute inset-0 flex flex-col justify-end pb-8 md:pb-16 ${alignClasses[align]}`}
        >
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white mb-4">
            {title}
          </h2>
          <Link
            to={link}
            className="inline-block text-white text-sm uppercase tracking-widest border-b border-white pb-1 hover:opacity-70 transition-opacity"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};