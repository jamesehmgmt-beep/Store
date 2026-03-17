import { Link } from "react-router-dom";

export const CategoryButtons = () => {
  return (
    <section className="py-16 px-8 bg-background">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-center">
        {/* Left Column - Women */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">Grace in every thread.</h2>
          <p className="text-muted-foreground mb-6 max-w-md">Beautifully crafted silhouettes designed for modesty, comfort, and effortless everyday elegance.</p>
          <Link to="/category/women" className="inline-block px-6 py-3 bg-foreground text-background text-sm font-medium rounded-full hover:opacity-90 transition-opacity">Shop Women</Link>
        </div>

        {/* Right Column - Men */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">Elevated essentials for him.</h2>
          <p className="text-muted-foreground mb-6 max-w-md">Clean, comfortable staples and traditional wear tailored for exceptional fit and lasting quality.</p>
          <Link to="/category/men" className="inline-block px-6 py-3 bg-foreground text-background text-sm font-medium rounded-full hover:opacity-90 transition-opacity">Shop Men</Link>
        </div>
      </div>
    </section>
  );
};