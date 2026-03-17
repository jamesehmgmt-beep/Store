import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Briefcase } from "lucide-react";

const CareersPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-foreground" />
            <h1 className="text-3xl font-serif mb-4">Careers at MUSLIMEEM</h1>
            <p className="text-muted-foreground">
              Join our team and help shape the future of modest fashion.
            </p>
          </div>

          <div className="text-center py-12 border border-border">
            <p className="text-muted-foreground mb-4">
              We're always looking for talented individuals to join our team.
            </p>
            <p className="text-sm text-muted-foreground">
              Send your CV to <a href="mailto:careers@muslimeem.com" className="underline hover:text-foreground">careers@muslimeem.com</a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CareersPage;