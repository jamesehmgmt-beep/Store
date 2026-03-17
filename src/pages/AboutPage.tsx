import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-serif mb-4">About MUSLIMEEM</h1>
            <p className="text-muted-foreground">
              Elevating modest fashion with elegance and purpose.
            </p>
          </div>

          <div className="space-y-8 text-muted-foreground">
            <p>
              MUSLIMEEM was founded with a heartfelt mission: to empower individuals to express their faith and identity through beautifully crafted modest fashion. We believe that modesty is a form of self-expression, and our collections are designed to help you feel confident, elegant, and true to yourself.
            </p>
            
            <p>
              From premium thobes and flowing abayas to luxurious hijabs and statement jewelry, every piece in our collection is thoughtfully curated to blend traditional craftsmanship with contemporary style. We source the finest fabrics and work with skilled artisans to deliver exceptional quality.
            </p>

            <p>
              We're proud to serve a global community that values faith, fashion, and authenticity. Our inclusive collections cater to all styles and preferences, ensuring everyone can find pieces that resonate with their personal expression.
            </p>

            <div className="border-t border-border pt-8">
              <h2 className="text-xl font-medium text-foreground mb-4">Our Values</h2>
              <ul className="space-y-3">
                <li><strong className="text-foreground">Quality:</strong> Premium materials and expert craftsmanship in every piece.</li>
                <li><strong className="text-foreground">Modesty:</strong> Fashion that honors faith and celebrates identity.</li>
                <li><strong className="text-foreground">Elegance:</strong> Timeless designs that blend tradition with modern style.</li>
                <li><strong className="text-foreground">Community:</strong> Empowering our global community to express themselves with confidence.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;