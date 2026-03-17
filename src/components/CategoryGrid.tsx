import { Link } from "react-router-dom";
import bestsellerImage from "@/assets/bestseller.png";
import thobeImage from "@/assets/thobe.png";
import hijabImage from "@/assets/hijab.png";
import jewelryImage from "@/assets/jewelry.png";

export const CategoryGrid = () => {
  return (
    <section className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px]">
        {/* Bestsellers */}
        <Link
          to="/category/collections"
          className="category-card group aspect-[3/4] relative"
        >
          <img 
            src={bestsellerImage} 
            alt="Bestsellers"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          <div className="absolute inset-0 z-10 flex items-end justify-center pb-8">
            <span className="font-serif text-sm md:text-lg tracking-widest uppercase text-background drop-shadow-lg transform group-hover:translate-y-[-4px] transition-transform duration-300">
              Bestsellers
            </span>
          </div>
        </Link>

        {/* Thobe */}
        <Link
          to="/category/thobe"
          className="category-card group aspect-[3/4] relative"
        >
          <img 
            src={thobeImage} 
            alt="Thobe"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          <div className="absolute inset-0 z-10 flex items-end justify-center pb-8">
            <span className="font-serif text-sm md:text-lg tracking-widest uppercase text-background drop-shadow-lg transform group-hover:translate-y-[-4px] transition-transform duration-300">
              Thobe
            </span>
          </div>
        </Link>

        {/* Hijab */}
        <Link
          to="/category/hijab"
          className="category-card group aspect-[3/4] relative"
        >
          <img 
            src={hijabImage} 
            alt="Hijab"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          <div className="absolute inset-0 z-10 flex items-end justify-center pb-8">
            <span className="font-serif text-sm md:text-lg tracking-widest uppercase text-background drop-shadow-lg transform group-hover:translate-y-[-4px] transition-transform duration-300">
              Hijab
            </span>
          </div>
        </Link>

        {/* Jewelry */}
        <Link
          to="/category/jewelry"
          className="category-card group aspect-[3/4] relative"
        >
          <img 
            src={jewelryImage} 
            alt="Jewelry"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          <div className="absolute inset-0 z-10 flex items-end justify-center pb-8">
            <span className="font-serif text-sm md:text-lg tracking-widest uppercase text-background drop-shadow-lg transform group-hover:translate-y-[-4px] transition-transform duration-300">
              Jewelry
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
};
