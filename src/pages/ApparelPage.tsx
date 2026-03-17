import { Header } from "@/components/Header";

const ApparelPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center px-4">
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-medium tracking-tight mb-6">
            COMING SOON
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto">
            Our apparel collection is launching soon. Stay tuned for something special.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApparelPage;
