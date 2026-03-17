import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Ruler } from "lucide-react";

const SizeGuidePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <Ruler className="w-12 h-12 mx-auto mb-4 text-foreground" />
            <h1 className="text-3xl font-serif mb-4">Size Guide</h1>
            <p className="text-muted-foreground">
              Find your perfect fit with our comprehensive size guide.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-border">
              <thead>
                <tr className="bg-secondary">
                  <th className="px-4 py-3 text-left text-sm font-medium border-b border-border">Size</th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-b border-border">UK</th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-b border-border">EU</th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-b border-border">US</th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-b border-border">Waist (cm)</th>
                  <th className="px-4 py-3 text-left text-sm font-medium border-b border-border">Hips (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-sm">XS</td>
                  <td className="px-4 py-3 text-sm">6</td>
                  <td className="px-4 py-3 text-sm">34</td>
                  <td className="px-4 py-3 text-sm">2</td>
                  <td className="px-4 py-3 text-sm">60-64</td>
                  <td className="px-4 py-3 text-sm">84-88</td>
                </tr>
                <tr className="border-b border-border bg-secondary/30">
                  <td className="px-4 py-3 text-sm">S</td>
                  <td className="px-4 py-3 text-sm">8</td>
                  <td className="px-4 py-3 text-sm">36</td>
                  <td className="px-4 py-3 text-sm">4</td>
                  <td className="px-4 py-3 text-sm">64-68</td>
                  <td className="px-4 py-3 text-sm">88-92</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-sm">M</td>
                  <td className="px-4 py-3 text-sm">10</td>
                  <td className="px-4 py-3 text-sm">38</td>
                  <td className="px-4 py-3 text-sm">6</td>
                  <td className="px-4 py-3 text-sm">68-72</td>
                  <td className="px-4 py-3 text-sm">92-96</td>
                </tr>
                <tr className="border-b border-border bg-secondary/30">
                  <td className="px-4 py-3 text-sm">L</td>
                  <td className="px-4 py-3 text-sm">12</td>
                  <td className="px-4 py-3 text-sm">40</td>
                  <td className="px-4 py-3 text-sm">8</td>
                  <td className="px-4 py-3 text-sm">72-76</td>
                  <td className="px-4 py-3 text-sm">96-100</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">XL</td>
                  <td className="px-4 py-3 text-sm">14</td>
                  <td className="px-4 py-3 text-sm">42</td>
                  <td className="px-4 py-3 text-sm">10</td>
                  <td className="px-4 py-3 text-sm">76-80</td>
                  <td className="px-4 py-3 text-sm">100-104</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Still unsure? <a href="/contact" className="underline hover:text-foreground">Contact us</a> for personalized sizing advice.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SizeGuidePage;