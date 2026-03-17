import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Users } from "lucide-react";

const TeamPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <Users className="w-12 h-12 mx-auto mb-4 text-foreground" />
            <h1 className="text-3xl font-serif mb-4">Our Team</h1>
            <p className="text-muted-foreground">
              Meet the people behind MUSLIMEEM.
            </p>
          </div>

          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Our passionate team of designers, engineers, and customer service specialists work together to bring you the best modest fashion experience. We're united by our mission to help everyone feel confident and elegant.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TeamPage;